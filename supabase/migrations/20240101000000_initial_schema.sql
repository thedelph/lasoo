-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists public.working_hours cascade;
drop table if exists public.services cascade;
drop table if exists public.profiles cascade;

-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    company_name text,
    telephone_number text,
    website text,
    address_line1 text,
    address_line2 text,
    city text,
    county text,
    postcode text,
    country text default 'United Kingdom',
    service_radius integer default 10,
    share_location boolean default false,
    latitude decimal(10,8),
    longitude decimal(11,8),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table if not exists public.services (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade not null,
    service_name text not null,
    price decimal(10,2),
    is_offered boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create working_hours table
create table if not exists public.working_hours (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade not null,
    day_of_week text not null,
    start_time time,
    end_time time,
    is_closed boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.working_hours enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can view their own services" on services;
drop policy if exists "Users can insert their own services" on services;
drop policy if exists "Users can update their own services" on services;
drop policy if exists "Users can view their own working hours" on working_hours;
drop policy if exists "Users can insert their own working hours" on working_hours;
drop policy if exists "Users can update their own working hours" on working_hours;

-- Create RLS policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can view their own services"
    on public.services for select
    using (auth.uid() = profile_id);

create policy "Users can insert their own services"
    on public.services for insert
    with check (auth.uid() = profile_id);

create policy "Users can update their own services"
    on public.services for update
    using (auth.uid() = profile_id);

create policy "Users can view their own working hours"
    on public.working_hours for select
    using (auth.uid() = profile_id);

create policy "Users can insert their own working hours"
    on public.working_hours for insert
    with check (auth.uid() = profile_id);

create policy "Users can update their own working hours"
    on public.working_hours for update
    using (auth.uid() = profile_id);

-- Drop existing triggers if they exist
drop trigger if exists handle_profiles_updated_at on profiles;
drop trigger if exists handle_services_updated_at on services;
drop trigger if exists handle_working_hours_updated_at on working_hours;
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing functions if they exist
drop function if exists public.handle_updated_at();
drop function if exists public.handle_new_user();

-- Create function to handle updated_at timestamp
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at timestamps
create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_services_updated_at
    before update on public.services
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_working_hours_updated_at
    before update on public.working_hours
    for each row
    execute procedure public.handle_updated_at();

-- Create function to handle new user registration
create function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, company_name)
    values (new.id, new.raw_user_meta_data->>'company_name');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
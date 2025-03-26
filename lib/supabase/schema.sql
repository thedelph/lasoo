-- Enable RLS
alter table if exists "public"."profiles" enable row level security;

-- Create profiles table
create table if not exists "public"."profiles" (
  id uuid references auth.users on delete cascade not null primary key,
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
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create services table
create table if not exists "public"."services" (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  service_name text not null,
  price decimal(10,2),
  is_offered boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create working_hours table
create table if not exists "public"."working_hours" (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  day_of_week text not null,
  start_time time,
  end_time time,
  is_closed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create locations table
create table if not exists "public"."locations" (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles on delete cascade not null,
  latitude decimal(10,8) not null,
  longitude decimal(11,8) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
create policy "Profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Trigger for updating updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on profiles
  for each row
  execute procedure handle_updated_at();

create trigger handle_services_updated_at
  before update on services
  for each row
  execute procedure handle_updated_at();

create trigger handle_working_hours_updated_at
  before update on working_hours
  for each row
  execute procedure handle_updated_at();

create trigger handle_locations_updated_at
  before update on locations
  for each row
  execute procedure handle_updated_at();
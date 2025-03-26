-- Create services table
create table if not exists public.services (
    id uuid default uuid_generate_v4() primary key,
    profile_id uuid references public.profiles on delete cascade not null,
    service_name text not null,
    price decimal(10,2),
    is_offered boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now())
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
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.services enable row level security;
alter table public.working_hours enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own services" on public.services;
drop policy if exists "Users can insert their own services" on public.services;
drop policy if exists "Users can update their own services" on public.services;
drop policy if exists "Users can delete their own services" on public.services;

drop policy if exists "Users can view their own working hours" on public.working_hours;
drop policy if exists "Users can insert their own working hours" on public.working_hours;
drop policy if exists "Users can update their own working hours" on public.working_hours;
drop policy if exists "Users can delete their own working hours" on public.working_hours;

-- Create policies for services
create policy "Users can view their own services"
    on public.services for select
    using (auth.uid() = profile_id);

create policy "Users can insert their own services"
    on public.services for insert
    with check (auth.uid() = profile_id);

create policy "Users can update their own services"
    on public.services for update
    using (auth.uid() = profile_id);

create policy "Users can delete their own services"
    on public.services for delete
    using (auth.uid() = profile_id);

-- Create policies for working hours
create policy "Users can view their own working hours"
    on public.working_hours for select
    using (auth.uid() = profile_id);

create policy "Users can insert their own working hours"
    on public.working_hours for insert
    with check (auth.uid() = profile_id);

create policy "Users can update their own working hours"
    on public.working_hours for update
    using (auth.uid() = profile_id);

create policy "Users can delete their own working hours"
    on public.working_hours for delete
    using (auth.uid() = profile_id);

-- Drop existing triggers if they exist
drop trigger if exists handle_services_updated_at on public.services;
drop trigger if exists handle_working_hours_updated_at on public.working_hours;
drop trigger if exists on_profile_created_init_services on public.profiles;
drop trigger if exists on_profile_created_init_hours on public.profiles;

-- Create triggers for updated_at timestamps
create trigger handle_services_updated_at
    before update on public.services
    for each row
    execute procedure public.handle_updated_at();

create trigger handle_working_hours_updated_at
    before update on public.working_hours
    for each row
    execute procedure public.handle_updated_at();

-- Drop existing functions if they exist
drop function if exists public.initialize_default_services();
drop function if exists public.initialize_default_working_hours();

-- Create function to initialize default services
create or replace function public.initialize_default_services()
returns trigger as $$
begin
    insert into public.services (profile_id, service_name, price, is_offered)
    values
        (new.id, 'home', 0, true),
        (new.id, 'car', 0, true);
    return new;
end;
$$ language plpgsql security definer;

-- Create function to initialize default working hours
create or replace function public.initialize_default_working_hours()
returns trigger as $$
begin
    insert into public.working_hours (profile_id, day_of_week, start_time, end_time, is_closed)
    values
        (new.id, 'monday', '09:00', '17:00', false),
        (new.id, 'tuesday', '09:00', '17:00', false),
        (new.id, 'wednesday', '09:00', '17:00', false),
        (new.id, 'thursday', '09:00', '17:00', false),
        (new.id, 'friday', '09:00', '17:00', false),
        (new.id, 'saturday', '09:00', '17:00', false),
        (new.id, 'sunday', null, null, true);
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers to initialize defaults
create trigger on_profile_created_init_services
    after insert on public.profiles
    for each row
    execute procedure public.initialize_default_services();

create trigger on_profile_created_init_hours
    after insert on public.profiles
    for each row
    execute procedure public.initialize_default_working_hours();
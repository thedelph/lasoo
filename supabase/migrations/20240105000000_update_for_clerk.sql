-- Drop the auth trigger as we'll handle profile creation in the application
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Update RLS policies to use Clerk user ID
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid()::text = id::text );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid()::text = id::text );

-- Update services policies
drop policy if exists "Users can view their own services" on services;
drop policy if exists "Users can insert their own services" on services;
drop policy if exists "Users can update their own services" on services;

create policy "Users can view their own services"
  on services for select
  using ( auth.uid()::text = profile_id::text );

create policy "Users can insert their own services"
  on services for insert
  with check ( auth.uid()::text = profile_id::text );

create policy "Users can update their own services"
  on services for update
  using ( auth.uid()::text = profile_id::text );

-- Update working hours policies
drop policy if exists "Users can view their own working hours" on working_hours;
drop policy if exists "Users can insert their own working hours" on working_hours;
drop policy if exists "Users can update their own working hours" on working_hours;

create policy "Users can view their own working hours"
  on working_hours for select
  using ( auth.uid()::text = profile_id::text );

create policy "Users can insert their own working hours"
  on working_hours for insert
  with check ( auth.uid()::text = profile_id::text );

create policy "Users can update their own working hours"
  on working_hours for update
  using ( auth.uid()::text = profile_id::text );
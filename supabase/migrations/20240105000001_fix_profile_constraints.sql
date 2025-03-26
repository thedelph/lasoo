-- Drop ALL policies from all tables first
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service providers can create profiles" ON profiles;

-- Drop ALL policies on services table
DROP POLICY IF EXISTS "Users can view their own services" ON services;
DROP POLICY IF EXISTS "Users can insert their own services" ON services;
DROP POLICY IF EXISTS "Users can update their own services" ON services;
DROP POLICY IF EXISTS "Users can delete their own services" ON services;

-- Drop ALL policies on working_hours table
DROP POLICY IF EXISTS "Users can view their own working hours" ON working_hours;
DROP POLICY IF EXISTS "Users can insert their own working hours" ON working_hours;
DROP POLICY IF EXISTS "Users can update their own working hours" ON working_hours;
DROP POLICY IF EXISTS "Users can delete their own working hours" ON working_hours;

-- Drop existing foreign key constraints from public schema tables
ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_profile_id_fkey;

ALTER TABLE working_hours
DROP CONSTRAINT IF EXISTS working_hours_profile_id_fkey;

ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Modify the id columns in public schema to be text
ALTER TABLE profiles
ALTER COLUMN id TYPE text;

ALTER TABLE services
ALTER COLUMN profile_id TYPE text;

ALTER TABLE working_hours
ALTER COLUMN profile_id TYPE text;

-- Add back the foreign key constraints for services and working_hours
ALTER TABLE services
ADD CONSTRAINT services_profile_id_fkey
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE working_hours
ADD CONSTRAINT working_hours_profile_id_fkey
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Recreate ALL policies with text type
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id::text = current_setting('request.jwt.claims')::json->>'sub');

-- Services policies
CREATE POLICY "Users can view their own services"
ON services FOR SELECT
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert their own services"
ON services FOR INSERT
WITH CHECK (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update their own services"
ON services FOR UPDATE
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete their own services"
ON services FOR DELETE
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

-- Working hours policies
CREATE POLICY "Users can view their own working hours"
ON working_hours FOR SELECT
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can insert their own working hours"
ON working_hours FOR INSERT
WITH CHECK (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can update their own working hours"
ON working_hours FOR UPDATE
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');

CREATE POLICY "Users can delete their own working hours"
ON working_hours FOR DELETE
USING (profile_id::text = current_setting('request.jwt.claims')::json->>'sub');
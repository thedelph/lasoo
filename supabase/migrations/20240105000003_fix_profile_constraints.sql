-- Add unique constraint to profiles table
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;

ALTER TABLE profiles
ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);

-- Update RLS policies to handle upserts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (
  id = auth.uid()::text OR
  id IN (
    SELECT id FROM profiles
    WHERE id = auth.uid()::text
  )
);
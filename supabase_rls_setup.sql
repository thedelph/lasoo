-- Enable Row Level Security on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Debug policy - allow all operations" ON profiles;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile" 
ON profiles FOR SELECT 
USING (id = auth.uid()::text);

-- Policy for users to insert their own profile
CREATE POLICY "Users can create their own profile" 
ON profiles FOR INSERT 
WITH CHECK (id = auth.uid()::text);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (id = auth.uid()::text);

-- For debugging: Create a function to see what auth.uid() returns
CREATE OR REPLACE FUNCTION public.debug_auth_state()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN jsonb_build_object(
    'auth_uid', auth.uid(),
    'auth_uid_type', pg_typeof(auth.uid())::text,
    'auth_role', auth.role(),
    'current_setting_role', current_setting('request.jwt.claims', true)::jsonb->>'role'
  );
END;
$$;

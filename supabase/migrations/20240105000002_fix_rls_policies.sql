-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies with proper checks
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid()::text);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
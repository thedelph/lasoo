-- First create the admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    is_super_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin users are viewable by admins only" 
ON public.admin_users
FOR SELECT 
USING (auth.uid()::text IN (SELECT id::text FROM public.admin_users WHERE is_super_admin = true));

CREATE POLICY "Only super admins can insert admin users"
ON public.admin_users
FOR INSERT
WITH CHECK (auth.uid()::text IN (SELECT id::text FROM public.admin_users WHERE is_super_admin = true));

CREATE POLICY "Only super admins can update admin users"
ON public.admin_users
FOR UPDATE
USING (auth.uid()::text IN (SELECT id::text FROM public.admin_users WHERE is_super_admin = true));

-- Insert an admin user (replace with your email)
INSERT INTO public.admin_users (email, is_super_admin)
VALUES ('your.email@example.com', true)
ON CONFLICT (email) 
DO UPDATE SET is_super_admin = true, updated_at = NOW();

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_admin_updated_at();
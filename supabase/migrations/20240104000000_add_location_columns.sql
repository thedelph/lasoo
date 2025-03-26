-- Add location columns to profiles table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'profiles' 
                  AND column_name = 'latitude') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN latitude decimal(10,8),
        ADD COLUMN longitude decimal(11,8);
    END IF;
END $$;
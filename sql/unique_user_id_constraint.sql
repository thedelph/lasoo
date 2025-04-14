-- First check if the constraint exists and if so, do nothing
DO $$
BEGIN
    -- Check if constraint exists
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_user_id_unique') THEN
        -- Add a unique constraint to the user_id column to prevent future duplicates
        ALTER TABLE users ADD CONSTRAINT users_user_id_unique UNIQUE (user_id);
    ELSE
        RAISE NOTICE 'Constraint users_user_id_unique already exists, skipping creation';
    END IF;
END$$;

-- Create an index on user_id for better performance (IF NOT EXISTS ensures no error)
CREATE INDEX IF NOT EXISTS users_user_id_idx ON users (user_id);

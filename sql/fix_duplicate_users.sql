-- First, check if we have duplicate user_ids in the table
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Count duplicate user_ids
    SELECT COUNT(*) - COUNT(DISTINCT user_id) INTO duplicate_count
    FROM users
    WHERE user_id IS NOT NULL;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'Found % duplicate user_ids. Starting cleanup...', duplicate_count;
        
        -- 1. Create a temporary table with the most recent entry for each user_id
        CREATE TEMP TABLE latest_users AS
        SELECT DISTINCT ON (user_id) *
        FROM users
        WHERE user_id IS NOT NULL
        ORDER BY user_id, created_at DESC;
        
        -- 2. Save the count of rows before deletion for reporting
        DECLARE
            before_count INTEGER;
            after_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO before_count FROM users WHERE user_id IS NOT NULL;
            
            -- 3. Delete duplicates but KEEP the NULL user_id entries and any non-duplicated entries
            -- First get IDs of duplicates (all except most recent per user_id)
            CREATE TEMP TABLE duplicate_ids AS
            SELECT u.id
            FROM users u
            LEFT JOIN latest_users l ON u.id = l.id
            WHERE u.user_id IS NOT NULL AND l.id IS NULL;
            
            -- Delete only the identified duplicates
            DELETE FROM users
            WHERE id IN (SELECT id FROM duplicate_ids);
            
            SELECT COUNT(*) INTO after_count FROM users WHERE user_id IS NOT NULL;
            
            RAISE NOTICE 'Cleaned up % duplicate records. Before: %, After: %', 
                before_count - after_count, before_count, after_count;
        END;
    ELSE
        RAISE NOTICE 'No duplicate user_ids found. No cleanup needed.';
    END IF;
END$$;

-- Create an index on user_id for better performance (if it doesn't exist)
CREATE INDEX IF NOT EXISTS users_user_id_idx ON users (user_id);

-- Log the number of rows after cleanup
SELECT COUNT(*) as user_count FROM users;

-- Show unique user count vs total count
SELECT 
    COUNT(*) as total_users, 
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) - COUNT(DISTINCT user_id) as duplicates
FROM users 
WHERE user_id IS NOT NULL;

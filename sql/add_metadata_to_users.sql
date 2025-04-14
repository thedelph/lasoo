-- SQL migration to add a metadata JSONB column to users table
-- This allows us to store additional profile information flexibly

-- Add the metadata column to users table
ALTER TABLE users 
ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- Create an index on the metadata column for faster JSON queries
CREATE INDEX idx_users_metadata ON users USING GIN (metadata);

-- Add a comment to explain the purpose of this column
COMMENT ON COLUMN users.metadata IS 'Flexible storage for additional profile fields like address, website, etc.';

-- Add additional columns for coordinates
ALTER TABLE users
ADD COLUMN latitude DOUBLE PRECISION DEFAULT NULL,
ADD COLUMN longitude DOUBLE PRECISION DEFAULT NULL;

-- Add columns for service settings
ALTER TABLE users
ADD COLUMN service_radius INTEGER DEFAULT 10,
ADD COLUMN share_location BOOLEAN DEFAULT false;

-- Add a comment for these columns
COMMENT ON COLUMN users.latitude IS 'Latitude coordinate for user location';
COMMENT ON COLUMN users.longitude IS 'Longitude coordinate for user location';
COMMENT ON COLUMN users.service_radius IS 'Service radius in kilometers';
COMMENT ON COLUMN users.share_location IS 'Whether the user wants to share their current location';

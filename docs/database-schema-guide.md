# Database Schema Guide

## Overview

Lasoo uses Supabase as its database, with tables structured to support locksmith profile management, location tracking, and service area configuration. This guide describes the core tables and their relationships.

## Core Tables

### users

The primary table that stores locksmith profiles and account information.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | text | Unique identifier from Supabase Auth (has UNIQUE constraint) |
| fullname | text | Full name of the user |
| phone | text | Contact phone number |
| email | text | Email address |
| is_authorized | smallint | Authorization status (1=authorized, 0=not authorized) |
| is_activated | smallint | Account activation status (1=activated, 0=not activated) |
| created_at | timestamp with timezone | Account creation date |
| subscription_start_date | date | Start date of subscription |
| subscription_end_date | date | End date of subscription |
| company_name | text | Business name |
| subscription_status | text | Status of subscription (Active, Expired, etc.) |
| service_type | text | Type of service provided (e.g., Locksmith) |
| company_postcode | text | Business postcode |
| metadata | jsonb | Flexible storage for additional profile fields |
| latitude | double precision | Business location latitude |
| longitude | double precision | Business location longitude |
| service_radius | integer | Service coverage radius in miles |
| share_location | boolean | Whether to share live location |

**Important Notes:**
- The `metadata` column uses JSONB to store flexible additional fields like address details, website, etc.
- Boolean values are stored as smallint (1/0) for compatibility
- A unique constraint on `user_id` prevents duplicate entries
- An index on `user_id` improves query performance

### locations

Stores real-time location data for service providers.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | text | Reference to users.user_id |
| latitude | double precision | Current latitude |
| longitude | double precision | Current longitude |
| timestamp | timestamp with timezone | When location was recorded |
| accuracy | double precision | Location accuracy in meters |
| device_id | text | Device that reported location |

## Database Optimization

### Unique Constraints

The users table has a unique constraint on the `user_id` column to prevent duplicate profile entries:

```sql
ALTER TABLE users ADD CONSTRAINT users_user_id_unique UNIQUE (user_id);
```

### Indexes

To improve query performance, especially for location-based searches:

```sql
CREATE INDEX users_user_id_idx ON users (user_id);
CREATE INDEX users_location_idx ON users (latitude, longitude);
```

## Managing Schema Changes

When making changes to the database schema, follow these steps:

1. Create a migration SQL file in the `/sql` directory
2. Test the migration on a development database
3. Apply the migration to production

Example migration to add new columns:

```sql
-- Example: add_metadata_to_users.sql
ALTER TABLE users ADD COLUMN metadata JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE users ADD COLUMN longitude DOUBLE PRECISION;
ALTER TABLE users ADD COLUMN service_radius INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN share_location BOOLEAN DEFAULT false;
```

## Row Level Security (RLS)

Supabase uses Row Level Security policies to control access to data:

- Users can only view and edit their own profile data
- Admin users have additional access to all user records
- Public endpoints have limited read-only access for search functionality

## Data Integrity

To maintain data integrity:

1. The application validates input before storing
2. Unique constraints prevent duplicates
3. Default values ensure required fields have sensible values
4. Database triggers can maintain consistency across related tables

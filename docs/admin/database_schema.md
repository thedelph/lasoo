# Lasoo Database Schema

This document provides detailed information about the database structure used in the Lasoo application.

## Tables

### Users Table

The `users` table stores information about all tradespeople in the system. Regular users/customers don't need accounts.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | text | Unique user identifier |
| fullname | text | User's full name |
| phone | text | User's phone number |
| email | text | User's email address |
| is_authorized | smallint | Authorization status (1=authorized, 0=unauthorized) |
| is_activated | smallint | Activation status (1=activated, 0=not activated) |
| created_at | timestamp with time zone | Account creation timestamp |
| subscription_start_date | date | Subscription start date |
| subscription_end_date | date | Subscription end date |
| company_name | text | Company name for tradespeople |
| subscription_status | text | Current subscription status |
| service_type | text | Type of service offered (for tradespeople) |
| company_postcode | text | Company postcode |

#### Important Notes

- Boolean fields (`is_authorized`, `is_activated`) are stored as smallint (1/0) rather than boolean values
- When updating these fields, use numeric values (1/0) instead of boolean values (true/false)
- The field `fullname` (without underscore) is used for the user's name, not `full_name`
- All entries in the table are tradespeople with their corresponding `service_type`

### Profiles Table

The `profiles` table contains additional information about users that is not stored in the main users table.

| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| user_id | text | Foreign key to users table |
| is_tradesperson | boolean | Whether the user is a tradesperson |
| is_verified | boolean | Whether the user's identity has been verified |
| phone | text | Alternative phone number |

#### Relationship with Users Table

- Each user in the `users` table may have a corresponding entry in the `profiles` table
- The `user_id` field in the `profiles` table corresponds to the `id` field in the `users` table
- Some user information may be duplicated between the tables (e.g., phone number)

### Locations Table

The `locations` table stores the current and historical locations of tradespeople.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | text | Foreign key to users table |
| latitude | double precision | Latitude coordinate |
| longitude | double precision | Longitude coordinate |
| date_updated | timestamp with time zone | When the location was last updated |

#### Relationship with Users Table

- Each user in the `users` table may have multiple entries in the `locations` table
- The `user_id` field in the `locations` table corresponds to the `id` field in the `users` table
- Locations are used for the God Mode Map to track tradesperson positions

### Subscriptions Table

The `subscriptions` table stores detailed subscription information for tradespeople.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users table |
| start_date | timestamp with time zone | Subscription start date |
| end_date | timestamp with time zone | Subscription end date |
| plan_id | uuid | Foreign key to subscription_plans table |
| status | text | Subscription status (active, expired, canceled) |
| created_at | timestamp with time zone | When the subscription was created |
| updated_at | timestamp with time zone | When the subscription was last updated |

#### Relationship with Users Table

- Each user in the `users` table may have corresponding entries in the `subscriptions` table
- The `user_id` field in the `subscriptions` table corresponds to an ID in the `auth.users` table
- This allows for detailed tracking of subscription history and plan details

### Subscription Plans Table

The `subscription_plans` table stores information about available subscription plans.

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Plan name |
| description | text | Plan description |
| price | numeric | Plan price |
| currency | text | Price currency (e.g., GBP) |
| duration_months | integer | Duration of the plan in months |
| created_at | timestamp with time zone | When the plan was created |
| updated_at | timestamp with time zone | When the plan was last updated |

#### Relationship with Subscriptions Table

- Each subscription in the `subscriptions` table is linked to a plan in the `subscription_plans` table
- The `plan_id` field in the `subscriptions` table corresponds to the `id` field in the `subscription_plans` table

## Dual Subscription Storage Architecture

The Lasoo application uses a dual system for tracking subscriptions:

1. **Users Table Subscriptions**: Basic subscription information is stored directly in the users table via:
   - `subscription_start_date`
   - `subscription_end_date`
   - `subscription_status`

2. **Dedicated Subscriptions Table**: Detailed subscription information including plan details and history is stored in the dedicated subscriptions table.

This dual approach allows for:
- Quick access to current subscription status directly from the users table
- Detailed subscription history and plan information from the subscriptions table
- Ability to migrate users between the two systems as needed

## Field Usage in Components

### SubscriptionManagement Components

The modularized `SubscriptionManagement` components handle data from both subscription storage methods:

- The `SubscriptionService.ts` service queries both the users table and the subscriptions table
- It merges and deduplicates subscription data from both sources
- The system distinguishes between:
  - **Synthetic IDs** (format: "user-9") which reference users table subscriptions
  - **Real UUIDs** which reference subscriptions table entries

### TradespeopleManagement Component

The `TradespeopleManagement.tsx` component displays tradespeople in the admin dashboard:

- Uses fields from the `users` table for displaying tradesperson information

## Common Issues and Solutions

### Boolean Field Updates

When updating boolean fields in the database:

```typescript
// INCORRECT - Using boolean values
await supabase
  .from('users')
  .update({
    is_authorized: true  // This will not work correctly
  })
  .eq('id', userId);

// CORRECT - Using numeric values
await supabase
  .from('users')
  .update({
    is_authorized: 1  // This is the correct approach
  })
  .eq('id', userId);
```

### Field Name Mismatches

Be aware of field name differences:

- `fullname` in the database (without underscore)
- `full_name` sometimes used in component interfaces (with underscore)

Always verify the actual database field names when accessing data.

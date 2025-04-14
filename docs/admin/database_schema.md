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

## Field Usage in Components



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

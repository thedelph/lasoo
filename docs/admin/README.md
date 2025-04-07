# Admin Backend Documentation

This directory contains documentation for the Lasoo admin backend system, which provides comprehensive monitoring, management, and analytics capabilities for the platform.

## Documentation Index

1. [Admin Backend Architecture & Design](./admin_backend_architecture.md) - Comprehensive architecture document outlining the design, features, and implementation progress of the admin backend
2. [Database Schema](./database_schema.md) - Details about the database structure and field definitions

## Implementation Status

The admin backend has been implemented with the following components:

- **Authentication System**: Email-based admin authentication with role verification
- **Dashboard & Analytics**: 
  - Overview of key platform metrics including user counts, tradesperson counts, and subscription statistics
  - Placeholder sections for future chart implementations
- **User Management**: Interface for managing platform users
- **Tradesperson Management**: 
  - Complete interface for managing tradespeople
  - Authorization and activation workflow
  - Filtering by service type and status
  - Comprehensive tradesperson details display
- **Subscription Management**: Interface for monitoring subscription status
- **God Mode Map**: Real-time map showing all tradesperson locations

## Access Instructions

1. Navigate to `/admin/login` to access the admin login page
2. Use admin credentials (email: chrishide87@gmail.com)
3. After login, you'll be redirected to the admin dashboard at `/admin/dashboard`

### Production Deployment Notes

The admin panel routes are configured to work in both development and production environments:

- The admin dashboard uses a wildcard route pattern (`/admin/dashboard/*`) to properly handle nested routes
- All client-side routes are handled by the `vercel.json` configuration which redirects all requests to the SPA entry point
- If you encounter routing issues in production, ensure that:
  - The wildcard pattern is correctly set in `App.tsx`
  - The `vercel.json` file contains the proper rewrite rule: `{ "source": "/(.*)", "destination": "/index.html" }`

## Technical Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS
- State Management: React hooks and context
- Database: Supabase
- Authentication: Supabase Auth with custom admin verification
- Routing: React Router

## Database Structure

### Users Table

The `users` table has the following structure:

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

**Important Notes:**
- Boolean fields (`is_authorized`, `is_activated`) are stored as smallint (1/0) rather than boolean values
- When updating these fields, use numeric values (1/0) instead of boolean values (true/false)
- The field `fullname` (without underscore) is used for the user's name, not `full_name`

## Troubleshooting

### Common Issues

1. **Users showing as "No Name" in dashboard**
   - Fixed in April 2025 update
   - Issue was caused by a field name mismatch between database schema (`fullname`) and code reference (`full_name`)
   - Solution: Updated the `UserManagement.tsx` component to use the correct field name from the users table

2. **Boolean field updates not working**
   - Remember that `is_authorized` and `is_activated` are stored as smallint (1/0) in the database
   - When updating these fields, use numeric values (1/0) instead of boolean values (true/false)

## Future Enhancements

- Content management system
- Support ticket system
- Advanced analytics and reporting
- API for third-party integrations
- Multi-factor authentication
- Improved error handling and validation

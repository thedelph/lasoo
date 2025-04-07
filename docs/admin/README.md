# Admin Backend Documentation

This directory contains documentation for the Lasoo admin backend system, which provides comprehensive monitoring, management, and analytics capabilities for the platform.

## Documentation Index

1. [Admin Backend Architecture & Design](./admin_backend_architecture.md) - Comprehensive architecture document outlining the design, features, and implementation progress of the admin backend

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

## Future Enhancements

- Content management system
- Support ticket system
- Advanced analytics and reporting
- API for third-party integrations
- Multi-factor authentication

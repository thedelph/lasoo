# Authentication Migration Guide: Clerk to Supabase Auth

## Overview

This document outlines the migration process from Clerk authentication to Supabase authentication in the Lasoo application. This migration was performed to create a unified authentication system across both web and mobile platforms with modern Shadcn/UI components.

## Migration Benefits

- **Single Authentication Provider**: Simplified architecture with one auth provider (Supabase) instead of two
- **Unified Authentication Flow**: Consistent auth experience across web and mobile platforms
- **Direct Data Access**: User profiles stored directly in the Supabase database
- **Cost Efficiency**: Reduced costs by eliminating redundant auth services
- **Simplified Codebase**: Removed multiple auth-related components and dependencies

## Key Components Created

### UI Components

- **Modern Shadcn/UI Components**: All authentication screens now use Shadcn/UI components for a consistent, accessible, and professional user experience
- **Responsive Design**: Authentication screens are fully responsive with proper spacing and layout on all device sizes
- **Improved UX**: Enhanced form validation, loading states, and error handling with visual feedback
- **Accessibility**: Better keyboard navigation, proper labeling, and enhanced focus states

### Authentication Hooks

- **useSupabaseAuth.ts**
  - Core authentication hook replacing Clerk's authentication
  - Provides methods for user management: `signIn`, `signUp`, `signOut`, `getToken`
  - Manages authentication state with `isSignedIn`, `user`, `session`
  - Handles authentication flow and session persistence

- **useSupabaseProfile.ts**
  - Handles user profile management in the `users` table
  - Creates and updates user profiles
  - Provides profile data in a format compatible with the application's existing interfaces

### Authentication Components

- **Login.tsx**
  - Email/password login form with Supabase authentication
  - Error handling and validation
  - Redirection after successful authentication

- **SignUp.tsx**
  - Registration form with user profile creation
  - Basic validation for required fields
  - Creates new user accounts in Supabase Auth and profiles in the database

- **ProtectedRoute.tsx**
  - Route protection based on Supabase authentication state
  - Redirects unauthenticated users to login

- **SupabaseHeader.tsx**
  - Header component with login/logout functionality
  - Conditionally renders based on authentication state

## Database Structure

The migration involved changing database queries from the old `profiles` table structure to the new `users` table:

### Users Table Structure

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  user_id TEXT NOT NULL,
  fullname TEXT,
  phone TEXT,
  email TEXT,
  is_authorized SMALLINT DEFAULT 1,
  is_activated SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_start_date DATE,
  subscription_end_date DATE,
  company_name TEXT,
  subscription_status TEXT,
  service_type TEXT,
  company_postcode TEXT
);
```

**Important Notes**:
- Boolean fields (`is_authorized`, `is_activated`) are stored as smallint (1/0) not boolean values
- The `company_postcode` field requires a valid UK postcode format
- User identifiers reference `user_id` from Supabase Auth

## Implementation Details

### UI Implementation

The authentication UI was implemented using Shadcn/UI components, which provide several benefits:

- **Component-based architecture**: Each UI element is a reusable component with consistent styling and behavior
- **Accessibility first**: Components follow WCAG accessibility guidelines
- **Consistent theming**: All components share the same design system 
- **Animations and transitions**: Subtle loading animations and transitions enhance the user experience
- **Form handling**: Improved validation and error states with visual feedback

### Authentication State Management

The migration implements a pattern where authentication state is managed by the `useSupabaseAuth` hook, which:

1. Subscribes to Supabase Auth state changes
2. Updates the React state accordingly
3. Provides authentication methods to components
4. Handles session persistence

### API Integration

Database operations now use the Supabase client's data APIs with proper filter patterns:

```typescript
// Fetch user profile
const { data: users } = await supabase
  .from('users')
  .select('*')
  .filter('user_id', 'eq', userId);
```

### Error Handling

Comprehensive error handling was implemented to handle:
- Authentication failures
- Database operation errors
- Missing or invalid data
- Network issues

## Environmental Variables

The migration removed Clerk-related environment variables and now requires only:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting Common Issues

### 406 Not Acceptable Errors

When encountering 406 errors from the Supabase API:
- Check that API calls are using the correct query structure
- Avoid using the `.eq()` method directly with `user_id` and instead use `.filter()`
- Ensure database tables have the correct permissions set in Supabase

### Missing User Profiles

If user profiles aren't being created:
- Verify the insert operation in the `useSupabaseProfile` hook
- Check RLS policies to ensure proper access
- Confirm that the user_id from Supabase Auth is being correctly passed to the users table

### Authentication State Not Persisting

If authentication state is not persisting between page reloads:
- Check the session persistence settings in the Supabase client initialization
- Verify that the auth listener is properly set up
- Ensure cookies are not being blocked by browser settings

## Future Enhancements

Potential future improvements to the authentication system:

### UI Enhancements
- **Dark Mode Support**: Add theme switching capabilities to authentication screens
- **Animation Refinements**: Further refine loading and transition animations
- **Form Validation Improvements**: Add real-time validation feedback as users type
- **Progressive Enhancement**: Implement progressive enhancement techniques for better performance

### Authentication Functionality

1. **Multi-factor Authentication (MFA)**: Add additional security with MFA support
2. **Social Authentication**: Enable sign-in with Google, Facebook, etc.
3. **Password Reset Flow**: Implement a comprehensive password reset feature
4. **Email Verification**: Add email verification requirements
5. **Authorization Levels**: Implement role-based authorization for different user types

# Admin Backend Component Reference

This document provides a technical reference for the key components of the Lasoo admin backend system. It's intended for developers who need to understand, maintain, or extend the admin functionality.

## Table of Contents

1. [Authentication Components](#authentication-components)
2. [Dashboard Components](#dashboard-components)
3. [Management Interfaces](#management-interfaces)
4. [Map Components](#map-components)
5. [Utility Hooks and Functions](#utility-hooks-and-functions)

## Authentication Components

### AdminLogin.tsx

The admin login component handles authentication for admin users.

**Key Features:**
- Email and password authentication
- Integration with Supabase Auth
- Admin role verification
- Error handling for unauthorized access

**Usage:**
- Rendered at the `/admin/login` route
- Redirects to dashboard on successful authentication

### AdminProtectedRoute.tsx

A wrapper component that protects admin routes from unauthorized access.

**Key Features:**
- Checks for authenticated admin user
- Redirects to login page if unauthorized
- Renders children components if authorized

**Usage:**
```tsx
<AdminProtectedRoute>
  <AdminDashboard />
</AdminProtectedRoute>
```

### useAdminAuth.ts

Custom hook for managing admin authentication state and operations.

**Key Features:**
- Admin sign-in functionality
- Admin sign-out functionality
- Admin session state management
- Admin role verification

**Usage:**
```tsx
const { adminUser, adminSignIn, adminSignOut, loading } = useAdminAuth();
```

## Dashboard Components

### AdminDashboard.tsx

The main dashboard layout component for the admin interface.

**Key Features:**
- Sidebar navigation
- Header with admin user information
- Content area for rendering child components

**Usage:**
- Rendered at the `/admin/dashboard` route
- Contains routing for child admin components

### DashboardOverview.tsx

Component displaying key metrics and statistics for the platform.

**Key Features:**
- Tradesperson count statistics
- Subscription statistics
- New tradesperson registration metrics

**Implementation Details:**
- Fetches data from the `users` table (containing only tradespeople)
- Uses entries with `service_type` field for categorizing tradespeople
- Counts active and expired subscriptions based on `subscription_status` field
- Calculates new tradespeople today by comparing creation dates
- Displays metrics in responsive card layouts
- Shows placeholders for future chart implementations

**Usage:**
- Rendered at the `/admin/dashboard` route (default view)

## Management Interfaces


### TradespeopleManagement.tsx

Interface for viewing and managing tradespeople.

**Key Features:**
- Tradesperson listing with filtering and search
- Search by name, business name, email, phone, or postcode
- Filtering by service type and authorization status
- Authorization and activation actions
- Tradesperson deletion actions

**Implementation Details:**
- Fetches tradespeople from the `users` table (which contains only tradesperson accounts)
- Displays comprehensive tradesperson information including:
  - Personal and business details
  - Authorization and activation status
  - Subscription status and expiration date
  - Service type and company postcode
- Provides action buttons that change based on tradesperson status:
  - "Authorize" button for unauthorized tradespeople
  - "Activate" button for authorized but not activated tradespeople
  - "Delete" button for all tradespeople

**Database Dependencies:**
- `users` table with fields:
  - id, user_id, fullname, phone, email
  - is_authorized, is_activated, created_at
  - subscription_start_date, subscription_end_date
  - company_name, subscription_status, service_type, company_postcode

**Usage:**
- Rendered at the `/admin/tradespeople` route

### Subscription Management Components

The subscription management functionality has been modularized into several components for better maintainability and organization.

#### SubscriptionManagement.tsx

Main container component that orchestrates the subscription management interface.

**Key Features:**
- Integrates all subscription sub-components
- Provides the main entry point for the subscription management system

**Usage:**
- Rendered at the `/admin/subscriptions` route

#### SubscriptionList.tsx

Component for displaying and filtering subscription data.

**Key Features:**
- Subscription listing with search and filtering
- Status filtering (Active, Expired, All)
- Text search by name and email
- Subscription action buttons (Extend, Cancel)
- Subscription status badges with color coding

**Implementation Details:**
- Handles both real subscription records from the `subscriptions` table 
- Also handles user-based subscription data from the `users` table
- Displays consistent information regardless of the data source
- Implements de-duplication to prevent showing the same subscription multiple times

#### NewSubscriptionModal.tsx

Modal component for creating new subscriptions.

**Key Features:**
- Tradesperson selection with search
- Subscription plan selection
- Form validation
- Error handling
- Loading states during submission

**Implementation Details:**
- Fetches tradespeople without existing subscriptions
- Fetches available subscription plans
- Creates new subscription records with proper user-subscription relationships

#### SubscriptionService.ts

Service class for handling subscription data operations.

**Key Features:**
- Centralized data fetching for all subscription components
- Consistent error handling and data transformation
- CRUD operations for subscriptions

**Implementation Details:**
- Handles hybrid subscription data from both `users` and `subscriptions` tables
- Works with both synthetic user IDs ("user-X") and real subscription UUIDs
- Handles subscription extensions, cancellations, and creations
- Incorporates deduplication logic to avoid duplicate subscriptions

#### types.ts

Shared TypeScript interfaces for subscription management components.

**Key Types:**
- `Subscription`: Interface for subscription data
- `TradespersonOption`: Interface for tradesperson selection options
- `SubscriptionPlan`: Interface for subscription plan data

#### utils.ts

Utility functions for subscription management components.

**Key Functions:**
- `formatDate`: Formats dates consistently across components
- `formatCurrency`: Formats currency values
- `isSubscriptionExpired`: Checks if a subscription is expired
- `getStatusBadgeClass`: Returns appropriate CSS classes for status badges

## Map Components

### GodModeMap.tsx

Component for viewing real-time locations of tradespeople with their base locations.

**Key Features:**
- Mapbox integration for map rendering
- Real-time tradesperson location markers
- Dual location display: current location and base location (from company postcode)
- Distance calculation between current and base locations
- Filtering by active status and service type
- Detailed tradesperson information in popups
- Real-time location updates via Supabase subscriptions

**Technical Implementation:**
- Uses react-map-gl and Mapbox for map rendering
- Integrates with postcodes.io API to convert UK postcodes to coordinates
- Implements Haversine formula for accurate distance calculation
- Uses Supabase real-time subscriptions for location updates
- Retrieves data from users and locations tables using user_id relationship

**Database Dependencies:**
- users table: Contains tradesperson data (user_id, fullname, company_name, service_type, company_postcode)
- locations table: Contains location data (user_id, latitude, longitude, date_updated)

**Usage:**
- Rendered at the `/admin/map` route
- Displays all tradespeople with location data
- Shows building icon for base location when a tradesperson is selected

## Utility Hooks and Functions

### useSupabaseQuery.ts

Custom hook for simplifying Supabase queries with loading and error states.

**Key Features:**
- Handles loading states
- Error handling
- Data fetching from Supabase

**Usage:**
```tsx
const { data, loading, error, refetch } = useSupabaseQuery(
  'users',
  (query) => query.eq('service_type', 'locksmith')
);
```

### formatDate.ts

Utility function for consistent date formatting across the admin interface.

**Usage:**
```tsx
const formattedDate = formatDate(subscription.created_at);
```

### filterUtils.ts

Collection of utility functions for filtering and searching data.

**Key Features:**
- Text search functionality
- Filter application helpers
- Sort functions

**Usage:**
```tsx
const filteredTradespeople = applyFilters(tradespeople, filters);
```

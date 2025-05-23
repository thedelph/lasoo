# Admin Backend User Guide

This guide provides detailed instructions for using the Lasoo admin backend system. The admin backend allows authorized administrators to monitor and manage tradespeople, subscriptions, and view real-time location data.

## Table of Contents

1. [Accessing the Admin Backend](#accessing-the-admin-backend)
2. [Dashboard Overview](#dashboard-overview)
3. [Tradesperson Management](#tradesperson-management)
4. [Subscription Management](#subscription-management)
5. [God Mode Map](#god-mode-map)
6. [GDPR Compliance Monitoring](#gdpr-compliance-monitoring)
7. [Analytics and Reporting](#analytics-and-reporting)
8. [Troubleshooting](#troubleshooting)

## Accessing the Admin Backend

1. Navigate to `/admin/login` in your web browser
2. Enter your admin credentials:
   - Email: chrishide87@gmail.com
   - Password: your account password
3. After successful authentication, you will be redirected to the admin dashboard

## Dashboard Overview

The dashboard provides a comprehensive overview of key platform metrics:

- **Total Tradespeople**: Count of all registered service providers
- **Active Subscriptions**: Count of all tradespeople with "Active" subscription status
- **Expired Subscriptions**: Count of all tradespeople with "Expired" subscription status
- **New Tradespeople Today**: Count of service providers who registered today

The dashboard also includes placeholder sections for future implementation of:
- Tradesperson growth trends chart
- Subscription revenue chart
- Recent platform activity chart



## Tradesperson Management

The Tradesperson Management section provides tools for managing service providers on the platform:

### Features

- **Search**: Find tradespeople by name, company name, email, phone, or postcode
- **Filtering**: Filter by service type (Locksmith, Freelance, etc.) and authorization status
- **Tradesperson Details**: View comprehensive tradesperson information including:
  - Personal and business details
  - Authorization and activation status
  - Subscription status and expiration date
  - Service type and company postcode
- **Tradesperson Actions**:
  - Authorize tradespeople (for unauthorized accounts)
  - Activate tradespeople (for authorized but not activated accounts)
  - Delete tradesperson profiles

### Instructions

1. Navigate to the "Tradespeople" section from the sidebar
2. Use the search bar to find specific tradespeople
3. Use the filter dropdowns to narrow down results:
   - "All Authorization" / "Authorized Only" / "Unauthorized Only"
   - Service type selection (Locksmith, Freelance, etc.)
4. Review tradesperson details in the table
5. Use the action buttons to manage tradesperson accounts:
   - Click "Authorize" to authorize an unauthorized tradesperson
   - Click "Activate" to activate an authorized tradesperson
   - Click "Delete" to remove a tradesperson from the platform

### Understanding Status Indicators

- **Authorization Status**: Indicates whether a tradesperson has been authorized by an admin
  - Unauthorized tradespeople need admin approval before they can be activated
  - Only authorized tradespeople can be activated

- **Activation Status**: Indicates whether a tradesperson has been activated on the platform
  - Only activated tradespeople appear in customer searches
  - Activation is the final step before a tradesperson is fully operational

- **Subscription Status**: Shows the current subscription state
  - Active: Currently subscribed and operational
  - Expired: Subscription has ended and needs renewal

## Subscription Management

The Subscription Management section allows you to monitor and manage all platform subscriptions:

### Features

- **Search**: Find subscriptions by tradesperson name or email
- **Filtering**: Filter by subscription status
- **Subscription Details**: View comprehensive subscription information
- **Subscription Actions**:
  - Extend subscriptions
  - Cancel active subscriptions

### Instructions

1. Navigate to the "Subscriptions" section from the sidebar
2. Use the search bar to find specific subscriptions
3. Use the status filter to view subscriptions by status
4. Click on action buttons to extend or cancel subscriptions

## God Mode Map

The God Mode Map provides a real-time view of all tradespeople sharing their location:

### Features

- **Real-time Location Tracking**: View all tradespeople currently sharing their location
- **Dual Location Display**: See both current location and base location (from company postcode)
- **Road-Snapping Technology**: Van icons are automatically snapped to the nearest road for accurate visualization
- **Distance Calculation**: View the distance between a tradesperson's current location and their base
- **Filtering Options**: Filter by active status and service type
- **Detailed Information**: Click on map markers to view comprehensive tradesperson details
- **Live Updates**: Locations update in real-time as tradespeople move

### Map Elements

- **Blue Circle Markers**: Represent tradespeople's current locations
- **Purple Building Icons**: Represent tradespeople's base locations (appears when a tradesperson is selected)
- **Pulsing Animation**: Indicates actively sharing tradespeople

### Instructions

1. Navigate to the "God Mode Map" section from the sidebar
2. Use the "Show Only Active" toggle to filter for currently active tradespeople
3. Use the "Service Type" dropdown to filter by specific service categories
4. Click on any tradesperson marker to:
   - View their details in a popup
   - See their base location appear on the map (building icon)
   - View the distance between their current location and base
5. The map updates automatically as tradespeople move or change status

### Interpreting the Data

- **Active vs. Inactive**: Active tradespeople (currently sharing location) have pulsing blue markers
- **Distance from Base**: Helps understand how far tradespeople have traveled from their registered address
- **Last Active Time**: Shows when the tradesperson's location was last updated
- **Animated Van Icons on Roads**: Tradespeople sharing their live location appear as animated van icons positioned on the nearest road, providing a realistic representation of their travel routes
  - The vans feature movement animations with slight wiggle and ground lines beneath the wheels
  - These animations visually indicate active movement and make it easier to identify moving vehicles at a glance
  - The van rotates automatically to match the bearing/direction of travel

## GDPR Compliance Monitoring

The Lasoo platform includes GDPR compliance features that administrators should be aware of:

### Account Deletion Tracking

- **Anonymous Logging**: All account deletion requests are logged in the `gdpr_deletion_logs` table
- **Privacy-Focused**: Only hashed user IDs are stored to maintain anonymity while providing audit capability
- **Admin-Only Access**: Only admin users can view the deletion logs

### Monitoring Account Deletions

To view account deletion logs:

1. Connect to the Supabase database using the admin console
2. Navigate to the `gdpr_deletion_logs` table
3. Review logs which contain:
   - Deletion date and time
   - Success status
   - Anonymized user hash

### User-Facing GDPR Features

Users can access GDPR-related features through:

- `/forgetme` - The main account deletion page
- `/delete-account` - A redirect to the account deletion page (for Google Play Store compliance)
- Account Settings tab in the dashboard - Contains a "Danger Zone" section with the Delete Account option

### Implementation Details

- All personal data is completely removed from all tables (users, user_metadata, locations)
- Authentication accounts are properly deleted
- The process requires identity verification through password re-entry
- Clear warnings are provided about the permanent nature of account deletion

## Troubleshooting

### Common Issues

#### Authentication Problems

If you're experiencing authentication issues:
1. Ensure you're using the correct email (chrishide87@gmail.com)
2. Check that your password is correct
3. Clear your browser cache and cookies
4. Try using a different browser

#### Data Not Loading

If data isn't loading properly:
1. Check your internet connection
2. Refresh the page
3. Log out and log back in
4. Contact the development team if the issue persists

### Support Contact

For additional support, please contact the development team at support@lasoo.app

## Analytics and Reporting

The Lasoo platform has been integrated with Vercel Analytics to provide insights into user behavior and platform usage.

### Accessing Analytics

1. Log in to the [Vercel dashboard](https://vercel.com/dashboard)
2. Select the Lasoo project
3. Navigate to the Analytics tab
4. Ensure Web Analytics is enabled (if not, click Enable)

### Available Analytics Data

- **Page Views**: Track which pages users visit most frequently
- **Unique Visitors**: Monitor daily, weekly, and monthly unique visitors
- **Referral Sources**: Identify where your traffic is coming from
- **Geographic Data**: See which regions are using the platform
- **Device Information**: Understand what devices users are accessing the platform with

### Using Analytics for Business Decisions

- **User Engagement**: Identify the most and least visited pages to optimize the user experience
- **Growth Tracking**: Monitor user growth trends over time
- **Marketing Effectiveness**: Evaluate which referral sources bring the most users
- **Regional Targeting**: Use geographic data to focus marketing efforts

### Privacy Considerations

- Vercel Analytics is GDPR-compliant and privacy-focused
- No personally identifiable information (PII) is collected
- Data is anonymized and aggregated
- Analytics respects user privacy preferences and do-not-track settings

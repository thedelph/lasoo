# Admin Backend User Guide

This guide provides detailed instructions for using the Lasoo admin backend system. The admin backend allows authorized administrators to monitor and manage tradespeople, subscriptions, and view real-time location data.

## Table of Contents

1. [Accessing the Admin Backend](#accessing-the-admin-backend)
2. [Dashboard Overview](#dashboard-overview)
3. [Tradesperson Management](#tradesperson-management)
4. [Subscription Management](#subscription-management)
5. [God Mode Map](#god-mode-map)
6. [Troubleshooting](#troubleshooting)

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

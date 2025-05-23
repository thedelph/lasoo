# Lasoo

A locksmith finder application built with React, Vite, and Supabase.

## Overview

Lasoo is a web application that helps users find and connect with locksmiths. The application uses Supabase for both authentication and database, with Row Level Security (RLS) policies to ensure data privacy and security.

## Tech Stack

- **Frontend**: React with TypeScript, built using Vite
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Styling**: Tailwind CSS with Shadcn/UI components
- **Mapping**: Mapbox GL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thedelph/lasoo.git
   cd lasoo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Recent Updates

- **Real-time Location Indicator**: Added a pulsing green "LIVE" indicator for tradespeople actively sharing their current location
- **Improved Location Visualization**: Enhanced UI with van icons for live locations and shop icons for headquarters locations
- **Service Radius Visualization**: Added an interactive feature that displays the locksmith's actual service coverage area on the map when selected
- **HQ-Based Service Area**: Enhanced search algorithm to measure service radius from locksmith headquarters location, ensuring locksmiths aren't matched for jobs too far from their base
- **Dual Location Display**: Improved map to always show both HQ location (home icon) and current location (navigation icon), giving users complete visibility
- **Improved Locksmith Finder Algorithm**: Enhanced search to display both current and HQ locations when a locksmith is selected, while calculating service radius from HQ location
- **Postcode Geocoding Cache**: Implemented a database cache for geocoded postcodes to improve search reliability and reduce API dependency
- **Enhanced Search Experience**: Replaced generic search button with specialized "View Vehicle Locksmiths" and "View Home Locksmiths" buttons, adding clear icon indicators and automatic search execution from landing page
- **Improved Mobile Interface**: Optimized the search form on mobile devices to stay collapsed by default when arriving from the landing page, showing search results immediately without extra clicks
- **Profile Management Enhancement**: Fixed duplicate user entries issue and implemented robust form submission handling to prevent race conditions
- **Database Optimization**: Added unique constraints and indexes to the users table for improved data integrity and query performance
- **Geocoding Integration**: Enhanced postcode validation and geocoding for service area management with proper error handling
- **Profile Metadata Storage**: Implemented flexible JSONB storage for additional profile information that doesn't fit into standard columns
- **Authentication UI Update**: Implemented Shadcn/UI components for login and registration pages with improved user experience
- **Authentication Migration**: Migrated from Clerk to Supabase Auth for a unified authentication system across web and mobile platforms
- **Admin Panel Routing Fix**: Updated admin dashboard route to use wildcard pattern (`/admin/dashboard/*`) for proper nested route handling in production
- **Build Optimization**: Fixed TypeScript errors to ensure successful production builds
- **Dashboard UI Enhancement**: Completely redesigned the locksmith dashboard with a modern, card-based layout and improved user experience
- **Navigation Improvements**: Fixed header and footer navigation links to properly scroll to page sections
- **UI Consistency**: Enhanced visual consistency throughout the application with a standardized color system
- **Performance Optimization**: Removed dark mode feature to simplify the UI and improve performance
- **Branding Update**: Updated page title to "Lasoo" for consistent branding

## Deployment

The application is configured for deployment on Vercel. See the [Deployment Guide](./docs/deployment-guide.md) for detailed instructions.

## Documentation

- [Dashboard UI Guide](./docs/dashboard-ui-guide.md)
- [UI Navigation Guide](./docs/ui-navigation-guide.md)
- [UI Components Guide](./docs/ui-components-guide.md)
- [Auth Migration Guide](./docs/auth-migration-guide.md)
- [Troubleshooting Guide](./docs/troubleshooting-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [Database Schema Guide](./docs/database-schema-guide.md)
- [Profile Management Guide](./docs/profile-management-guide.md)
- [Locksmith Finder Guide](./docs/locksmith-finder-guide.md)

## Project Structure

```
lasoo/
├── docs/                 # Documentation
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard components
│   │   │   └── tabs/     # Dashboard tab components
│   │   ├── landing/      # Landing page components
│   │   └── results/      # Search results components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── supabase/             # Supabase configuration and migrations
├── vercel.json           # Vercel deployment configuration
└── vite.config.ts        # Vite configuration
```

## Key Features

- User authentication with Supabase Auth
- Integration with Supabase for data storage
- Row Level Security (RLS) policies for data privacy
- Locksmith profile management with intuitive dashboard
- Service area configuration with Mapbox integration
- Working hours and services management
- Responsive design with Tailwind CSS
- Smooth section navigation on landing page
- **Specialized search filters for vehicle and home locksmith services**
- **Comprehensive Location Search**: Shows locksmiths based on both their HQ location and current real-time position
- **Live Location Indicators**: Clearly displays which locksmiths are actively sharing their current location with pulsing "LIVE" indicators
- **Intuitive Location Icons**: Uses van icons for current locations and shop/building icons for headquarters
- **Auto-search functionality triggered directly from landing page**
- **Mobile-optimized search experience**
- Admin panel with dashboard, user management, and analytics
- God Mode Map for administrators to view all service providers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

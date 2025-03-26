# Lasoo

A locksmith finder application built with React, Vite, Clerk, and Supabase.

## Overview

Lasoo is a web application that helps users find and connect with locksmiths. The application uses Clerk for authentication and Supabase as the backend database, with Row Level Security (RLS) policies to ensure data privacy and security.

## Tech Stack

- **Frontend**: React with TypeScript, built using Vite
- **Authentication**: Clerk
- **Database**: Supabase
- **Styling**: Tailwind CSS with custom UI components
- **Mapping**: Mapbox GL
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Clerk account
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
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Recent Updates

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
- [Supabase-Clerk Integration](./docs/supabase-clerk-integration.md)
- [Troubleshooting Guide](./docs/troubleshooting-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)

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

- User authentication with Clerk
- Integration with Supabase for data storage
- Row Level Security (RLS) policies for data privacy
- Locksmith profile management with intuitive dashboard
- Service area configuration with Mapbox integration
- Working hours and services management
- Responsive design with Tailwind CSS
- Smooth section navigation on landing page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Deployment Guide for Lasoo Application

## Overview

This document outlines the deployment process for the Lasoo application, focusing on Vercel deployment configuration and how it integrates with Clerk authentication and Supabase.

## Vercel Deployment Configuration

### Configuration File

The application uses a `vercel.json` file in the root directory to configure how Vercel handles routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This configuration ensures that all routes in the application are directed to the `index.html` file, allowing React Router to handle client-side routing properly. This is essential for single-page applications (SPAs) like Lasoo.

### Why This Configuration Is Necessary

1. **Client-Side Routing**: React Router handles routing on the client side, but when a user directly accesses a route (e.g., `/sign-in/factor-one`), the server needs to know to serve the main application.

2. **Clerk Authentication Routes**: Clerk uses specific routes like `/sign-in/factor-one` for multi-factor authentication. Without proper configuration, these routes would result in 404 errors when accessed directly.

3. **SPA Best Practices**: This approach follows best practices for deploying SPAs to static hosting platforms like Vercel.

## Environment Variables

Ensure the following environment variables are set in your Vercel project settings:

1. **Clerk Variables**:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

2. **Supabase Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. **Mapbox Variables**:
   - `VITE_MAPBOX_ACCESS_TOKEN`: Your Mapbox access token for map functionality

## Deployment Process

1. **Prepare Your Application**:
   - Ensure all changes are committed to your Git repository
   - Verify that the `vercel.json` file is included in your repository

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Configure the build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Verify Deployment**:
   - Check that all routes, including authentication routes, work correctly
   - Test the authentication flow with Clerk
   - Verify that Supabase data access works as expected

## Troubleshooting Deployment Issues

### 404 Errors on Routes

**Problem**: Receiving 404 errors when accessing routes directly, especially Clerk authentication routes like `/sign-in/factor-one`.

**Solution**: 
1. Verify that your `vercel.json` file is correctly configured with the rewrite rule
2. Ensure the file is being included in your deployment (not in `.gitignore`)
3. Check Vercel deployment logs for any errors during the build process

### Authentication Flow Issues

**Problem**: Authentication works locally but fails in production.

**Solution**:
1. Verify that all environment variables are correctly set in Vercel
2. Check that the Clerk JWT template is properly configured
3. Test the authentication flow step by step to identify where it's failing

## Vercel Analytics Integration

The application has been integrated with Vercel Analytics to track user interactions and page views.

### Setup Process

1. **Package Installation**:
   - The `@vercel/analytics` package has been installed using npm:
     ```bash
     npm i @vercel/analytics
     ```

2. **Component Integration**:
   - The Analytics component has been added to the main entry file (`src/main.tsx`):
     ```jsx
     import { Analytics } from '@vercel/analytics/react'
     
     ReactDOM.createRoot(document.getElementById('root')!).render(
       <React.StrictMode>
         <App />
         <Analytics />
       </React.StrictMode>,
     )
     ```

3. **Dashboard Configuration**:
   - To view analytics data, you must enable Web Analytics in the Vercel dashboard:
     - Go to the [Vercel dashboard](https://vercel.com/dashboard)
     - Select your project
     - Click the Analytics tab
     - Click Enable from the dialog

4. **Viewing Analytics Data**:
   - After deployment and enabling Analytics, data will be collected automatically
   - View the data in the Analytics tab of your Vercel dashboard
   - Data includes page views, unique visitors, referral sources, and geographic information

## Best Practices

1. **Version Control**: Keep your `vercel.json` file in version control to ensure consistent deployments
2. **Environment Separation**: Use different Clerk and Supabase projects for development and production
3. **Monitoring**: Set up monitoring for your production deployment to catch issues early
4. **Progressive Rollout**: Consider using Vercel's preview deployments to test changes before deploying to production
5. **Analytics Review**: Regularly review analytics data to understand user behavior and optimize the application

## Related Documentation

- [Supabase-Clerk Integration Documentation](./supabase-clerk-integration.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)

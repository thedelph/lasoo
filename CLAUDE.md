# CLAUDE.md - Development Assistant Memory

This file contains important information about the Lasoo project for AI development assistants.

## Project Overview

Lasoo is a locksmith finder application that helps users locate trusted locksmiths in their area. The app features:
- Real-time location tracking for locksmiths
- Interactive map view with Mapbox integration
- Search by postcode functionality
- Separate flows for home and vehicle locksmith services
- Supabase backend with Row Level Security (RLS)
- React/TypeScript frontend with Tailwind CSS

## Recent Fixes and Improvements

### Search Reliability Improvements (February 2025)

Fixed intermittent "No Locksmiths Found" error that occurred when users clicked the "View Home Locksmiths" button. The issue was caused by:

1. **Race Condition**: ResultsPane was rendering before search completed, showing "No Locksmiths Found" prematurely
2. **Async Token Loading**: Mapbox token was loaded asynchronously causing initialization delays
3. **No Retry Logic**: Database and API calls had no retry mechanism for transient failures

**Solutions Implemented:**
- Fixed race condition by only setting `hasSearched` after search completes
- Added retry logic (3 attempts with exponential backoff) to:
  - Supabase database queries (users and locations tables)
  - Mapbox geocoding API calls
- Made mapboxToken initialization synchronous
- Enabled Supabase session persistence and auto-refresh
- Improved error handling throughout the search flow

**Key Files Modified:**
- `src/hooks/useLocksmiths.ts` - Added retry logic to database queries and geocoding
- `src/components/LocksmithFinder.tsx` - Fixed race condition in state management
- `src/utils/supabase.ts` - Enabled session persistence
- `src/hooks/useMapbox.ts` - Made token initialization synchronous

## Database Schema

### Key Tables:
- `users` - Stores locksmith/tradesperson information
- `locations` - Stores real-time location data for locksmiths
- `user_metadata` - Stores additional user profile data (migrated from users.metadata column)
- `profiles` - User profile data with RLS policies

### Important Notes:
- Service radius is measured from HQ location (company_postcode), not current location
- Locksmiths can be found by either live location or HQ location
- The `service_type` field uses "locksmith" for home services

## Common Development Tasks

### Running the Application
```bash
npm run dev  # Runs on http://localhost:3001
```

### Testing Search Functionality
1. Navigate to landing page
2. Enter postcode (e.g., "M41 9HE")
3. Click "View Home Locksmiths" or "View Vehicle Locksmiths"
4. Should navigate to /find page with autoSearch=true and display results

### Debugging Tips
- Check browser console for detailed logs
- Look for "🔍 Locksmith Search" in console for search flow debugging
- ResultsPane logs show when and why results are/aren't displayed
- Check Network tab for failed Supabase or Mapbox API calls

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_MAPBOX_ACCESS_TOKEN` - Mapbox API token (must start with "pk.")

## Known Issues and Quirks
- Multiple re-renders occur due to map updates (normal behavior)
- Road snapping for van icons can cause additional API calls
- Some users may not have live location data and will only show HQ location
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
- `src/hooks/useLocksmiths.ts` - Added retry logic to database queries and geocoding, fixed TypeScript type annotations
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

### TypeScript Build Fixes (January 2025)
- Fixed implicit 'any[]' type error in `useLocksmiths.ts` by adding explicit type annotation `LocationRecord[] | null` to the `locations` variable (line 210)

### Search Results Sorting Fix (June 2025)

Fixed issue where search results weren't prioritizing the closest locksmiths. The problem was that results were sorted by distance to HQ location even when locksmiths had live locations that were closer to the user.

**Issue Details:**
- When searching for "M50 1ZD", "Testing - Anthony Maddocks" (who was geographically closer) wasn't showing as the top result
- "Locky McLockface" (who was further away) was appearing first
- The sorting was using distance to HQ location rather than the actual displayed location

**Solution Implemented:**
- Added separate `displayDistance` calculation that uses:
  - Live location distance if the locksmith has a recent live location (within 15 minutes)
  - HQ location distance otherwise
- Modified the sorting logic to use `displayDistance` instead of the service radius distance
- Service radius checking still uses HQ location (as designed), but display ordering now reflects actual proximity

**Key Changes in `src/hooks/useLocksmiths.ts`:**
- Added `displayDistance` field to track distance to the actual displayed location
- Calculate both service radius distance (from HQ) and display distance (from live/HQ as shown)
- Sort results by `displayDistance` to show closest locksmiths first
- Updated the `ProcessedUser` type to include `displayDistance`

This ensures users see the closest available locksmiths first, whether they're showing live or HQ locations.

### Code Cleanup (June 2025)

Removed all console.log debug statements from production code to improve performance and clean up the codebase:

**Files cleaned:**
- `src/hooks/useLocksmiths.ts` - Removed 25 console.log statements used for debugging search flow
- `src/components/map/SimplifiedVanIcon3D.tsx` - Removed debug log for van bearing calculations
- `src/components/map/TradespersonMarker.tsx` - Removed detailed van data debug logging
- `src/components/results/ResultsPane.tsx` - Removed render state logging

This cleanup improves performance by reducing console output and makes the code production-ready.
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
  - `service_type` field contains "Locksmith" (capitalized) for all locksmiths
  - `user_id` is the primary identifier used for relationships
- `locations` - Stores real-time location data for locksmiths
- `services` - Stores which services each locksmith offers
  - `service_name` can be "home" or "vehicle"
  - `is_offered` boolean indicates if the service is available
  - `user_id` foreign key links to `users.id`
- `user_metadata` - Stores additional user profile data (migrated from users.metadata column)
- `profiles` - User profile data with RLS policies

### Important Notes:
- Service radius is measured from HQ location (company_postcode), not current location
- Locksmiths can be found by either live location or HQ location
- Service filtering uses the `services` table, not the `users.service_type` field
- The `services` table determines which locksmiths appear for home vs vehicle searches

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

### Home vs Vehicle Locksmith Services Implementation (June 2025)

Implemented proper distinction between home and vehicle locksmith services using the `services` table:

**Previous Issues:**
- Vehicle locksmith button wasn't working because it searched for `service_type = 'vehicle'` but all users had `service_type = 'Locksmith'`
- The search wasn't checking the `services` table which tracks what services each locksmith offers
- Service type updates had a race condition causing the first click to use the old service type

**Solutions Implemented:**
1. **Database Updates:**
   - Updated `services` table to use "vehicle" instead of "car" for consistency
   - Added proper foreign key relationship between `services` and `users` tables (using `user_id`)
   - Created migration to add `user_id` column and update RLS policies
   - Added test data linking services to existing users

2. **Search Logic Updates in `src/hooks/useLocksmiths.ts`:**
   - Modified search to query the `services` table to find users offering the requested service
   - Filters results to only show locksmiths who have `is_offered = true` for the selected service type
   - Properly handles case where no locksmiths offer a specific service

3. **UI State Management Fixes:**
   - Fixed race condition by passing service type directly to search function
   - Updated `handleSearch` to accept optional `serviceType` parameter
   - Modified button clicks to pass service type immediately rather than relying on state

4. **Map Centering Improvements:**
   - Fixed issue where results pane was blocking the search location on the map
   - Implemented dynamic padding calculation based on viewport size:
     - Mobile: 40% of viewport height (min 300px) bottom padding
     - Desktop: 35% of viewport height (min 350px) bottom padding
   - Applied dynamic padding to all map movements (search, marker clicks, back navigation)
   - Added extra padding for "no results" case to ensure search pin is visible

**Key Files Modified:**
- `src/hooks/useLocksmiths.ts` - Updated to check services table for filtering
- `src/components/search/SearchForm.tsx` - Fixed service type passing on button clicks
- `src/components/LocksmithFinder.tsx` - Fixed race condition and dynamic map padding
- `src/components/map/NewMapView.tsx` - Changed from `initialViewState` to controlled viewport
- Database migrations for services table relationship

**Current Behavior:**
- Home button shows locksmiths offering "home" services
- Vehicle button shows locksmiths offering "vehicle" services
- Some locksmiths offer both services and appear in both searches
- Map properly centers above results pane on all screen sizes
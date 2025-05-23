# Locksmith Finder Guide

This guide explains the functionality of the Lasoo locksmith finder feature, including recent improvements to the search algorithm and map visualization.

## Overview

The locksmith finder is a core feature of Lasoo that allows users to search for locksmiths in their area based on postcode and service type (home or vehicle). The search system displays locksmiths on a map with detailed information about their services, contact details, and distance from the search location.

## Key Features

- **HQ-Based Service Area**: Search algorithm measures service radius from locksmith headquarters location
- **Dual Location Display**: Shows both HQ location (shop icon) and current location (van icon) on the map and in results
- **Live Location Indicator**: Pulsing green "LIVE" tag for tradespeople actively sharing their current location
- **Service Radius Visualization**: Displays the actual service coverage area when a locksmith is selected
- **Cached Postcode Geocoding**: Utilizes a database cache of postcodes to improve reliability and reduce API dependency
- **Service Type Filtering**: Filter locksmiths by service type (home or vehicle)
- **Interactive Map Display**: Visual representation of locksmith locations with detailed popups
- **Current Location Sharing**: Locksmith locations are updated in real-time when they choose to share their current location

## How the Search Works

The locksmith finder uses an advanced algorithm to provide the most relevant search results while ensuring service area integrity:

1. **Initial Search**: When a user enters a postcode and selects a service type, the system geocodes the postcode to latitude/longitude coordinates.

2. **Service Radius Calculation**: The system calculates distances from the search coordinates to each locksmith's HQ location.

3. **Architectural Principle**: A locksmith is included in search results ONLY if:
   - Their HQ location is within their defined service radius from the search point
   - This ensures locksmith services aren't shown for jobs too far from their base of operations

4. **Location Display**: The system retrieves and displays both locations:
   - **HQ Location**: The locksmith's business headquarters (shown with home icon)
   - **Current Location**: The locksmith's real-time location if shared (shown with navigation icon)

5. **Distance Calculation**: For locksmiths in search results, the system displays the distance from the HQ location to the search location.

## Service Radius Visualization

A key feature of the Locksmith Finder is the interactive service radius visualization:

1. **When Activated**: The service radius circle appears automatically when a user selects a locksmith from the map or results list.

2. **What It Shows**: The circle represents the locksmith's actual service coverage area, based on their defined service radius (typically 10-25km).

3. **Centered on HQ**: The service radius is always calculated and displayed from the locksmith's headquarters location, ensuring accurate service area representation.

4. **Zoom Adaptive**: The circle scales appropriately as users zoom in and out of the map, maintaining an accurate visual representation of the coverage area.

5. **Visual Design**: A semi-transparent blue circle with a subtle border makes it clear but not overwhelming on the map.

## User Interface Details

### Map Markers

The map uses different marker styles to clearly indicate different location types:

- **Numbered Markers**: Primary markers shown as blue circles with numbers (1, 2, 3...) representing each locksmith in the search results
- **Shop Icon**: 3D shop/building icon showing the locksmith's headquarters/business address
- **Van Icon**: 3D van icon showing the locksmith's current real-time location (if shared)
- **Search Location**: Large blue pin marking the searched postcode location

### Live Location Indicators

To help users quickly identify which tradespeople are actively sharing their real-time location:

- **Pulsing LIVE Tag**: A green "LIVE" indicator with pulsing animation appears in the results list for tradespeople who are actively sharing their current location
- **Right-Aligned Indicator**: The LIVE indicator is positioned on the right side of the results card for easy visibility
- **Details View Indicator**: When viewing a tradesperson's details, the LIVE indicator appears next to their current location information

### Locksmith Details Panel

When a locksmith is selected, the details panel shows comprehensive information:

- **Business Name**: The locksmith's company name
- **Service Types**: What services they offer (home, vehicle, etc.)
- **Location Type Icons**: Van icon for current location and shop icon for headquarters
- **Live Status**: Pulsing green "LIVE" indicator for tradespeople sharing their current location
- **HQ Location**: The postcode and address of their headquarters
- **Current Location**: Their current location (if they're sharing it)
- **Distance**: How far they are from the search location (measured to HQ)
- **Service Radius**: How far they're willing to travel for jobs
- **Contact Information**: Phone number and other contact details

## Technical Implementation

The locksmith finder implementation follows these core principles:

1. **Architectural Design**: Service radius is always measured from HQ location, ensuring consistent service area coverage

2. **Data Sources**:
   - `users` table: Contains locksmith profile information including company_postcode and service_radius
   - `locations` table: Contains real-time location data for locksmiths who share their position
   - `postcodes` table: Caches geocoded postcode data to improve performance and reliability

3. **Map Implementation**: Uses Mapbox GL with custom layers for the service radius visualization

## Search Algorithm Details

### Cached Geocoding

To improve reliability and reduce dependency on external APIs, the system implements a database cache for geocoded postcodes:

1. A `postcodes` table stores the mapping between UK postcodes and their latitude/longitude coordinates
2. When geocoding a postcode, the system first checks the cache before making an API call
3. New geocoding results are cached for future use

### Location Modes

While not exposed to users, the system supports three location modes that determine how distances are calculated:

- **HQ Mode**: Only consider the company's headquarters location
- **Current Mode**: Only consider the locksmith's current location 
- **Either Mode (Default)**: Include locksmith if either location is within range

The default behavior uses "Either Mode" to provide the most comprehensive search results.

## Map Display

The map displays locksmiths with different markers based on the location type:

- **Circle Markers**: Primary identifier with the locksmith's initial
- **Van Markers**: 3D van icons indicate a locksmith's current location if they are sharing it
- **Shop Markers**: 3D shop/building icons indicate a locksmith's HQ location based on their registered postcode

## Service Type Filtering

Users can filter results by selecting:

- **View Home Locksmiths**: Shows locksmiths who provide home locksmith services
- **View Vehicle Locksmiths**: Shows locksmiths who provide vehicle locksmith services

## Recent Improvements

The locksmith finder has been enhanced with:

1. **Live Location Indicators**: Added pulsing green "LIVE" indicators to clearly show which tradespeople are actively sharing their current location
2. **Enhanced Location Visualization**: Implemented van icons for current locations and shop icons for headquarters in both the results list and details view
3. **Improved Search Algorithm**: Now properly considers both HQ and current locations when searching
4. **Geocoding Cache**: Added a database cache for geocoded postcodes to improve reliability
5. **Fixed Postcode Coordinates**: Ensured accurate geocoding of postcodes for proper service area calculations
6. **Distance Calculations**: Updated to accurately reflect distances from both current and HQ locations
7. **Mobile UI Enhancements**: Significant improvements to the mobile experience:
   - Reduced results panel height (30% of viewport instead of 60%) for better map visibility
   - Hidden scrollbars with visual fade indicators for cleaner UI
   - Full-width, centered Call Now button for improved accessibility
   - Adjusted map positioning to keep search pins visible above the results panel

## Troubleshooting

If you're experiencing issues with the locksmith finder:

- **No Results**: Try increasing the search radius or trying different postcodes
- **Incorrect Locations**: The geocoding service might occasionally return inaccurate coordinates; report any consistent issues
- **Missing Results**: Ensure that locksmiths have properly configured their service areas and profiles

## Developer Notes

For developers working on the locksmith finder:

- The core search logic is in `src/hooks/useLocksmiths.ts`
- Geocoding functions check the `postcodes` table before making API calls
- The algorithm always uses 'either' mode to maximize search results
- Both lat/long values from the `locations` table and geocoded coordinates from `company_postcode` are used for comprehensive searching

# Map Features Technical Guide

## Overview

This document provides technical details about the map implementation in the Lasoo application, including the road-snapping feature for van icons, location tracking, and other map-related functionality.

## Map Implementation

The Lasoo application uses Mapbox for all map-related features, providing a robust and customizable mapping solution.

### Key Components

1. **MapView Component**: The primary component that renders the map interface
   - Located at `src/components/map/MapView.tsx`
   - Handles rendering of markers, popups, and other map elements
   - Manages map viewport and interaction states

2. **VanIcon3D Components**: Custom 3D van icons for representing tradespeople sharing their live location
   - Located at `src/components/map/VanIcon3D.tsx` and `src/components/map/SimplifiedVanIcon3D.tsx`
   - Provides a visually distinct representation for service vehicles
   - Includes animations to indicate vehicle movement (wiggle effect and ground lines)
   - Dynamically orients based on bearing/direction of travel

3. **Map Hooks**:
   - `useMapboxRoutes`: Handles road-snapping functionality using Mapbox APIs
   - Provides utilities for finding nearest road points and calculating routes

## Road-Snapping Technology

The road-snapping feature ensures that van icons representing tradespeople are accurately displayed on roads rather than appearing in incorrect locations like buildings, grass, or water.

### Implementation Details

1. **Feature Detection**:
   - Uses Mapbox's `queryRenderedFeatures` to identify road features near each van's GPS location
   - Applies filtering to detect LineString features that represent roads
   - Searches within a configurable radius (default: 100 pixels) to find nearby roads

2. **Closest Point Calculation**:
   - For each detected road, calculates the closest point on the road to the van's actual GPS location
   - Uses a distance-based algorithm to find the optimal snapping point
   - Implements a maximum snap distance threshold to prevent snapping to roads that are too far away

3. **Marker Positioning**:
   - Updates the van marker's coordinates to the snapped road position
   - Falls back to the original GPS coordinates if no suitable road is found nearby
   - Provides visual consistency by ensuring vans appear on roads

### Code Example

```typescript
// Road-snapping implementation (simplified)
const snapToRoads = () => {
  // Get map instance and ensure it's loaded
  if (!mapInstanceRef.current || !mapInstanceRef.current.loaded()) return;
  
  const map = mapInstanceRef.current;
  
  // Process each tradesperson with a current location
  availableLocksmiths.forEach(locksmith => {
    const currentLocation = locksmith.locations.find(loc => loc.isCurrentLocation);
    if (!currentLocation) return;
    
    const id = `${locksmith.id}-current`;
    const point = [currentLocation.longitude, currentLocation.latitude];
    
    // Find road features near this point
    const pixelPoint = map.project(point as mapboxgl.LngLatLike);
    const searchRadius = 100; // pixels
    
    const roadFeatures = map.queryRenderedFeatures(
      [[pixelPoint.x - searchRadius, pixelPoint.y - searchRadius], 
       [pixelPoint.x + searchRadius, pixelPoint.y + searchRadius]]
    );
    
    // Filter to find road-like features
    const roadLikeFeatures = roadFeatures.filter(feature => {
      if (feature.geometry.type !== 'LineString') return false;
      
      const props = feature.properties || {};
      return (
        props.class === 'street' ||
        props.class === 'road' ||
        props.class === 'motorway' ||
        // Other road classes...
        (feature.layer && feature.layer.id && 
         feature.layer.id.includes('road'))
      );
    });
    
    // Find the closest road and snap to it
    if (roadLikeFeatures.length > 0) {
      // Find closest point on the road
      // Update marker position
    }
  });
};
```

## God Mode Map

The God Mode Map in the admin backend provides a comprehensive view of all tradespeople locations with enhanced features.

### Features

1. **Real-time Location Tracking**:
   - Displays all tradespeople currently sharing their location
   - Updates automatically as locations change
   - Shows both current location (van icon) and base location (building icon)

2. **Road-Snapping and Animation Visualization**:
   - All van icons are automatically snapped to the nearest road
   - Animated vehicles with slight wiggle and ground line effects to indicate movement
   - Vans properly rotate to match direction of travel on roads
   - Provides a realistic and dynamic representation of tradesperson travel routes
   - Improves the visual accuracy and user engagement of the map display

3. **Filtering and Information**:
   - Filter by service type and active status
   - View detailed information by clicking on markers
   - See distance calculations between current and base locations

## Performance Considerations

1. **Optimization Techniques**:
   - Road-snapping calculations are performed only when necessary
   - Uses efficient spatial algorithms to minimize computational overhead
   - Implements proper React state management to prevent unnecessary re-renders

2. **Error Handling**:
   - Graceful fallback to original coordinates when road-snapping fails
   - Comprehensive logging for debugging purposes
   - Proper error boundaries to prevent map crashes

## Integration with Other Systems

1. **Location Data**:
   - Integrates with Supabase database for storing and retrieving location data
   - Uses real-time subscriptions for live updates
   - Implements proper data validation and sanitization

2. **User Interface**:
   - Consistent styling with the rest of the application
   - Responsive design for different screen sizes
   - Accessibility considerations for map interactions

## Future Enhancements

1. **Route Visualization**:
   - Show actual routes taken by tradespeople
   - Implement path prediction based on historical data

2. **Clustering**:
   - Add marker clustering for areas with many tradespeople
   - Improve performance for maps with numerous markers

3. **Advanced Filtering**:
   - Filter by distance from a specific location
   - Filter by time since last location update

## Animated Van Icon Implementation

### Overview

The animated van icon (`SimplifiedVanIcon3D.tsx`) enhances the God Mode Map by providing visual cues for vehicle movement through:

1. A subtle wiggle animation that simulates the natural motion of a vehicle
2. Moving dashed lines beneath the wheels to indicate ground movement

### Technical Implementation

#### Animation Strategy

The animation implementation uses these key techniques:

1. **CSS Keyframes**: Defined in the document head to avoid React rendering issues
   ```css
   @keyframes vanWiggle {
     0% { transform: translate(0, 0) rotate(0deg); }
     25% { transform: translate(-1px, -1px) rotate(-0.5deg); }
     50% { transform: translate(0, 1px) rotate(0.5deg); }
     75% { transform: translate(1px, -1px) rotate(0.5deg); }
     100% { transform: translate(0, 0) rotate(0deg); }
   }

   @keyframes groundLines {
     0% { stroke-dashoffset: 0; }
     100% { stroke-dashoffset: -32; }
   }
   ```

2. **SVG Animation**: Applied directly to SVG elements
   - Vehicle wiggle applied to the main SVG container
   - Ground line animation applied to dashed path elements beneath the wheels

3. **Dynamic Style Application**: Animation properties conditionally applied based on the `animate` prop
   ```typescript
   const vanWiggleAnimation = animate ? '1s ease-in-out infinite vanWiggle' : 'none';
   const groundLinesAnimation = animate ? '0.8s linear infinite groundLines' : 'none';
   ```

4. **Browser-Safe Implementation**: Style injection only happens in browser environments
   ```typescript
   if (typeof document !== 'undefined') {
     // Browser-only code for style injection
   }
   ```

#### Performance Considerations

- Animations use hardware acceleration through CSS transforms
- Style elements are injected only once to prevent memory leaks
- Animation complexity is kept minimal to maintain smooth performance on mobile devices
- The `animate` prop allows disabling animations when needed for performance

#### Integration with Map Components

The animated van component integrates with the map through:

1. **Dynamic Orientation**: Van icons rotate based on bearing data to match road direction
2. **Proper Scaling**: Size adjusts based on zoom level for consistent visual appearance
3. **Conditional Animation**: Can be enabled/disabled based on performance requirements

### Usage Example

```tsx
<SimplifiedVanIcon3D
  bearing={tradesperson.bearing}
  zoom={mapZoom}
  animate={true}
  className="h-12 w-12"
/>
```

## Related Documentation

- [Admin User Guide](./admin/user-guide.md)
- [Database Schema Guide](./database-schema-guide.md)
- [Mapbox Integration Guide](https://docs.mapbox.com/mapbox-gl-js/guides/)

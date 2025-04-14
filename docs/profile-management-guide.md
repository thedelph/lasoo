# Profile Management Guide

## Overview

The Lasoo project implements a flexible and robust profile management system using React hooks and Supabase. This guide documents how the profile system works, including recently implemented features for handling metadata, geocoding, and form submission safeguards.

## Profile Data Structure

User profiles in Lasoo include both standard fields stored directly in the `users` table and extended metadata stored in a JSONB column. The core profile data structure is defined in `src/types/profile.ts`:

```typescript
interface Profile {
  id: string;
  company_name: string | null;
  telephone_number: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string;
  service_radius: number;
  share_location: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}
```

## Profile Management Hooks

### useSupabaseProfile

The `useSupabaseProfile` hook handles profile loading, updating, and state management:

```typescript
const { 
  profile,         // The current user profile data
  loading,         // Loading state
  error,           // Error state if any
  updateProfile,   // Function to update profile
  isInitialized    // Whether the profile has been initialized
} = useSupabaseProfile();
```

### Key Functions

#### Loading Profiles

Profiles are loaded when the hook is initialized and the user is authenticated:

1. The hook checks if the user exists in the database
2. If found, it loads the profile data
3. If not found, it creates a new profile
4. Converts database fields to the Profile format

#### Updating Profiles

The `updateProfile` function:

1. Converts the profile update to database format
2. Maps special fields to correct database columns
3. Handles metadata fields by collecting them into a JSONB object
4. Updates the profile in the database
5. Fetches and returns the updated profile

## Geocoding Implementation

Geocoding is used to convert postcodes to latitude/longitude coordinates:

1. The ServiceAreaTab component handles geocoding postcodes
2. It uses the Mapbox API for accurate UK postcode geocoding
3. Client-side validation prevents invalid postcodes from being submitted
4. Error handling provides user feedback for failed geocoding attempts

Example:

```typescript
// From ServiceAreaTab.tsx
const geocodePostcode = async (postcode: string) => {
  if (!postcode) return null;
  
  try {
    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        postcode
      )}.json?country=GB&types=postcode&access_token=${mapboxToken}`
    );
    
    // Process response...
    return {
      longitude: data.features[0].center[0],
      latitude: data.features[0].center[1]
    };
  } catch (error) {
    // Handle errors...
  }
};
```

## Form Submission Safeguards

To prevent duplicate entries and race conditions, the profile update forms include:

1. Submission locks to prevent multiple rapid submissions
2. Debounce timeouts to ensure previous submissions complete
3. Proper loading state management
4. Error handling and user feedback

Example implementation:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Prevent multiple rapid submissions
  if (saving || isSubmitting) {
    console.log('Submission already in progress');
    return;
  }
  
  setIsSubmitting(true);
  setSaving(true);
  
  try {
    // Process submission...
    await updateProfile(formData);
  } catch (error) {
    // Handle errors...
  } finally {
    setSaving(false);
    // Add a small delay before allowing new submissions
    setTimeout(() => {
      setIsSubmitting(false);
    }, 500);
  }
};
```

## Location-Based Architecture

The Lasoo application implements a location-based architecture for displaying service providers:

1. Service providers are shown based on whether their headquarters location is within service range of the searched postcode
2. Both current location (if shared) and HQ location are displayed on the map
3. Different icons are used for different location types (numbered circles for primary, navigation icon for current location, home icon for HQ)
4. Service radius is measured from HQ location, not current location
5. Distance information is shown in the details popup

## Best Practices

When modifying the profile management system:

1. Always validate user input on the client side
2. Use the proper database field mapping in `updateProfile`
3. Handle loading and error states appropriately
4. Implement submission locks for form components
5. Test profile updates thoroughly after making changes

## Troubleshooting

### Common Issues

1. **Missing Metadata**: If address fields aren't saving, check that the metadata mapping is correct
2. **Geocoding Failures**: Verify the Mapbox API key and ensure postcodes are formatted correctly
3. **Multiple Submission Attempts**: Check for missing submission locks or race conditions
4. **Database Constraints**: Ensure that you're complying with unique constraints and field validations

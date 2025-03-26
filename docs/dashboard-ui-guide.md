# Locksmith Dashboard UI Guide

## Overview

This document provides a comprehensive guide to the Locksmith Dashboard UI in the Lasoo application. The dashboard is designed with a focus on usability, visual consistency, and a modern aesthetic to help locksmith businesses manage their profiles effectively.

## Dashboard Structure

The Locksmith Dashboard is organized into a tabbed interface with the following main sections:

1. **Company Details**: Manage basic company information and address
2. **Service Area**: Configure service radius and location settings
3. **Working Hours**: Set business hours for each day of the week
4. **Services & Prices**: Manage offered services and their pricing

## UI Components and Design System

### Design Principles

The dashboard follows these core design principles:

1. **Visual Consistency**: Consistent use of colors, spacing, typography, and component styles
2. **Clear Visual Hierarchy**: Important information and actions are visually emphasized
3. **Responsive Design**: Adapts to different screen sizes while maintaining usability
4. **Contextual Feedback**: Provides clear feedback for user actions and system states

### Color System

The dashboard uses a consistent color palette based on Tailwind CSS:

- **Primary Blue**: `#2563eb` (blue-600) - Used for primary actions, active states, and key UI elements
- **Slate**: Various shades for text, backgrounds, and subtle UI elements
- **Semantic Colors**:
  - Success: Green tones for positive states and confirmations
  - Warning: Amber tones for cautionary information
  - Error: Red tones for errors and destructive actions
  - Info: Blue tones for informational content

### Component Library

The dashboard uses a custom component library built with Tailwind CSS, featuring:

1. **Card Components**: Consistent card layout with optional headers and footers
2. **Form Controls**: Styled input fields, selects, checkboxes with proper states
3. **Buttons**: Primary, secondary, and tertiary button styles
4. **Status Indicators**: Visual indicators for various states (active, inactive, etc.)
5. **Loading States**: Consistent loading spinners and placeholders

## Tab-Specific UI Features

### Company Details Tab

The Company Details tab is organized into logical sections:

1. **Company Information Section**:
   - Company name input with building icon
   - Telephone number input with phone icon
   - Website URL input with globe icon

2. **Address Section**:
   - Structured form for address components
   - Country selector dropdown
   - Proper input validation and formatting

```tsx
<div className="rounded-lg border border-slate-200 bg-white">
  <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
    <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <Building className="h-4 w-4 text-slate-500" />
      Company Details
    </h3>
  </div>
  
  <div className="p-4">
    {/* Form fields */}
  </div>
</div>
```

### Service Area Tab

The Service Area tab features:

1. **Location Status Card**:
   - Visual indicator of whether location is set
   - Color-coded feedback (green for success, amber for warning)
   - Explanatory text to guide user actions

2. **Business Location Section**:
   - Postcode input with map pin icon
   - Integration with Mapbox for geocoding

3. **Service Coverage Section**:
   - Radius slider with visual feedback
   - Clear labeling of minimum and maximum values

4. **Location Sharing Controls**:
   - Checkbox toggle with explanatory text
   - Warning information about search visibility requirements

### Working Hours Tab

The Working Hours tab includes:

1. **Weekly Schedule Section**:
   - Day-by-day configuration of business hours
   - Visual indicators for open/closed status
   - Time selectors with clock icons
   - Proper disabled states for closed days

2. **Hours Summary Section**:
   - Quick overview of all business hours
   - Visual indicators (check/x icons) for open/closed days
   - Responsive grid layout for better space utilization

### Services & Prices Tab

The Services & Prices tab features:

1. **Information Card**:
   - Explanatory text about service visibility and pricing
   - Visual styling to draw attention

2. **Services Management**:
   - Toggle controls for enabling/disabling services
   - Price inputs with currency icon prefixes
   - Add/remove service functionality
   - Visual feedback for disabled services

3. **Add Service Form**:
   - Collapsible form for adding custom services
   - Validation for required fields
   - Cancel/confirm action buttons

## Common UI Patterns

### Loading States

All tabs implement consistent loading states:

```tsx
<div className="flex h-64 items-center justify-center">
  <div className="flex flex-col items-center gap-2">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <p className="text-sm text-slate-500">Loading your data...</p>
  </div>
</div>
```

### Save Buttons

Save buttons follow a consistent pattern across all tabs:

```tsx
<div className="flex justify-end">
  <button 
    type="submit" 
    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
    disabled={saving}
  >
    {saving ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Saving Changes...
      </>
    ) : (
      'Save Changes'
    )}
  </button>
</div>
```

### Section Headers

Section headers maintain consistency with:

```tsx
<div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
  <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
    <Icon className="h-4 w-4 text-slate-500" />
    Section Title
  </h3>
</div>
```

## Responsive Design

The dashboard is fully responsive with these key breakpoints:

1. **Mobile** (< 640px):
   - Stacked layouts
   - Full-width inputs
   - Simplified visual elements

2. **Tablet** (640px - 1024px):
   - Grid layouts for form sections
   - Improved spacing and organization

3. **Desktop** (> 1024px):
   - Multi-column layouts
   - Enhanced visual elements
   - Additional status indicators

## Best Practices for UI Maintenance

1. **Component Consistency**: Reuse UI patterns and components to maintain visual consistency
2. **Color Usage**: Follow the established color system for different UI states and elements
3. **Icon Usage**: Use Lucide icons consistently with appropriate sizing and colors
4. **Form Layout**: Maintain consistent form layouts with proper labeling and helper text
5. **Loading States**: Always include appropriate loading states for asynchronous operations
6. **Responsive Testing**: Test all UI components across different screen sizes
7. **Accessibility**: Ensure proper contrast, focus states, and semantic HTML

## Related Documentation

- [UI Navigation Guide](./ui-navigation-guide.md)
- [Supabase-Clerk Integration](./supabase-clerk-integration.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)

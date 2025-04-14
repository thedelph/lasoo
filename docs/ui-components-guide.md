# UI Components Guide: Shadcn/UI Implementation

## Overview

This document describes the Shadcn/UI component system used in the Lasoo application, with a focus on the authentication screens and how these components integrate with our Supabase authentication system.

## Component Library

Lasoo uses Shadcn/UI, a collection of reusable components built with Radix UI and Tailwind CSS. These components provide a consistent, accessible, and customizable design system.

### Key Components Used

| Component | Usage | Location |
|-----------|-------|----------|
| Card | Container for authentication forms | Login and Registration pages |
| Input | Form field elements with consistent styling | Form elements throughout the application |
| Button | Interactive controls with various states | Action buttons across the application |
| Separator | Visual dividers to improve UI organization | Various UI sections |
| Sheet | Slide-out panels for mobile menus and dialogs | Mobile navigation and detail views |
| Badge | Small status indicators | For locksmith type and status indicators |

## Authentication UI

The authentication UI was completely redesigned using Shadcn/UI components for a modern, accessible experience.

### Login Page

The login page features:

- Card-based layout with proper spacing
- Clearly labeled input fields
- Improved password field with visibility toggle
- Loading state indicators with animated spinners
- Consistent error handling with toast notifications
- Responsive design for all screen sizes

### Registration Page

The registration page implements:

- Multi-step form with validation
- Company name and profile information fields
- Password strength indicator
- Form state persistence
- Clear visual hierarchy
- Accessible form controls

## Integration with Supabase Auth

The UI components work seamlessly with the Supabase authentication system:

1. Form submissions trigger Supabase authentication calls via `useSupabaseAuth` hook
2. Loading states in UI components reflect the async operations
3. Error handling displays user-friendly messages through toast notifications
4. Successful authentication redirects to appropriate dashboard pages

## Locksmith Finder UI Considerations

The locksmith finder component has specific UI considerations for displaying location data:

- Different icon types are used to represent locksmith locations:
  - Numbered circles for primary results
  - Navigation icon for current/live location
  - Home icon for headquarters location

- Service radius is visualized around the headquarters location (not current location)
- Distance information is displayed in the details popup
- Proper error handling for missing location data

## Data Table Structure Considerations

The UI has been designed to work with the database structure, particularly the `users` table:

- Form handling accounts for appropriate data types
- Boolean fields (`is_authorized`, `is_activated`) are stored as smallint (1/0) in the database
- Company postcode field is used for geocoding the headquarters location

## Design System

### Colors

The application uses a consistent color palette:

- Primary: A blue shade (`#0072f5`) for primary actions and highlights
- Muted: Subtle greys for secondary text and backgrounds
- Destructive: Red tones for warnings and errors
- Background: Clean whites and subtle greys for card backgrounds

### Typography

- Font: System font stack with Inter as the preferred font
- Heading scales: Consistent type scale for all headings
- Body text: 16px (1rem) base size with appropriate line height

### Spacing

Consistent spacing using Tailwind's spacing scale:
- Card padding: 24px (p-6)
- Form element gaps: 16px (gap-4)
- Section spacing: 32px (my-8)

## Accessibility Considerations

Shadcn/UI components are built with accessibility in mind:

- Proper keyboard navigation
- ARIA attributes on interactive elements
- Sufficient color contrast
- Focus visible states
- Screen reader support

## Future UI Enhancements

Planned UI improvements include:

- Dark mode theme support
- Enhanced animation and transitions
- Advanced form validation with real-time feedback
- UI component performance optimizations
- Mobile-specific UI optimizations

## Implementation Guidelines

When extending the application with new UI components:

1. Use existing Shadcn/UI components whenever possible
2. Maintain consistent spacing and typography
3. Follow the established color scheme
4. Ensure all components are fully accessible
5. Consider responsive behavior from the start
6. Test interactions on both desktop and mobile devices

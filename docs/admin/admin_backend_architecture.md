# Admin Backend Architecture & Design Document

## 1. Executive Summary

This document outlines the architecture and design for an administrative backend system for the tradesperson location application. The admin backend will provide comprehensive monitoring, management, and analytics capabilities to effectively oversee tradespeople (currently locksmiths) using the platform. Regular users/customers do not need accounts in the system.

## 2. System Overview

The admin backend will be a secure, web-based interface accessible only to authorized administrators. It will connect to the existing database and provide an intuitive interface for managing tradespeople accounts, monitoring subscriptions, viewing real-time tradesperson locations, and extracting key performance metrics.

## 3. Core Features

### 3.1 Authentication & Authorization

- Secure admin login system with multi-factor authentication
- Role-based access control (Super Admin, Content Moderator, Support, etc.)
- Session management with automatic timeouts
- Access logging for audit trails

### 3.2 Dashboard & Analytics

- Real-time overview of platform metrics
  - Total registered tradespeople
  - New sign-ups (daily, weekly, monthly)
  - Active tradespeople
  - Subscription revenue metrics
- Visual reports with charts and graphs
- Exportable data in various formats (CSV, PDF)
- Custom date range filtering



### 3.4 Tradesperson Management

- Complete database of registered tradespeople
- Profile approval workflow
- Verification status tracking
- Service area management
- Rating/review moderation

### 3.5 Subscription Management

- Overview of all subscription statuses
- Active subscription monitoring
- Expired subscription tracking
- Payment history
- Subscription plan management
- Automated notification system for expiring subscriptions
- Manual override capabilities

### 3.6 "God Mode" Map

- Real-time view of all tradespeople sharing location
- Filtering options (by service area, specialty, etc.)
- Density heatmap option
- Historical location data (with appropriate privacy controls)
- Ability to contact tradespeople directly from the map

### 3.7 Content Management

- Service category management
- System announcements and notifications
- FAQ and help content management

### 3.8 Support Tools

- Customer support ticket system
- Issue tracking and resolution
- Communication logs

## 4. Technical Architecture

### 4.1 Frontend

- Modern responsive web application 
- Framework options: React/Next.js, Vue.js, or Angular
- Secure HTTPS implementation
- Progressive Web App capabilities for mobile admin access

### 4.2 Backend

- RESTful API structure
- Authentication middleware
- Rate limiting and security features
- Server options: Node.js, Python (Django/Flask), or Ruby on Rails

### 4.3 Database Integration

- Secure connection to existing database
- Read/write permissions based on admin roles
- Query optimization for performance
- Backup systems and redundancy

### 4.4 Security Considerations

- Data encryption in transit and at rest
- Regular security audits
- Compliance with relevant data protection regulations
- IP restriction options

## 5. Implementation Roadmap

### Phase 1: Core Architecture
- Admin authentication system
- Basic dashboard with key metrics
- User and tradesperson database views

### Phase 2: Enhanced Management
- Subscription management system
- "God Mode" map implementation
- Content management tools

### Phase 3: Advanced Features
- Advanced analytics and reporting
- Support ticket system
- API for potential third-party integrations

## 6. Open Questions

To further refine this architecture, the following information would be helpful:

1. What is your current database structure for users and tradespeople?
2. How are subscriptions currently managed and tracked?
3. What authentication system is currently in use?
4. Are there any specific compliance requirements for your region?
5. What is the expected number of administrators who will use the system?

## 7. Next Steps

1. Review and refine this architecture document
2. Answer open questions to further tailor the design
3. Prioritize features for implementation
4. Develop technical specifications for the prioritized features
5. Begin implementation of Phase 1 components

## 8. Implementation Progress (April 2025)

### 8.1 Completed Components

#### Authentication & Authorization
- ✅ Implemented admin login system with email-based authentication
- ✅ Created AdminProtectedRoute component for securing admin routes
- ✅ Added support for super admin role identification

#### Dashboard & Analytics
- ✅ Built DashboardOverview component with key platform metrics
- ✅ Implemented real-time statistics for users, tradespeople, and subscriptions
- ✅ Added visual cards for important metrics display



#### Tradesperson Management
- ✅ Built dedicated tradesperson management interface
- ✅ Implemented verification workflow and status tracking
- ✅ Added filtering by trade type and verification status

#### Subscription Management
- ✅ Created subscription management interface
- ✅ Implemented ability to view, extend, and cancel subscriptions
- ✅ Added filtering by subscription status

#### "God Mode" Map
- ✅ Implemented map showing all tradespeople locations
- ✅ Added filtering options for active/inactive tradespeople
- ✅ Included detailed tradesperson information in popups

### 8.2 Technical Implementation

- Frontend: React with TypeScript
- Styling: Tailwind CSS for responsive design
- State Management: React hooks and context
- Database: Supabase for data storage and retrieval
- Authentication: Supabase Auth with custom admin verification
- Routing: React Router for navigation and protected routes

### 8.3 Pending Items

- Content management system
- Support ticket system
- Advanced analytics and reporting
- API for third-party integrations
- Multi-factor authentication

### 8.4 Access Instructions

1. Navigate to `/admin/login` to access the admin login page
2. Use admin credentials (email: chrishide87@gmail.com)
3. After login, you'll be redirected to the admin dashboard at `/admin/dashboard`

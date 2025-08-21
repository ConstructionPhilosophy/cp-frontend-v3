# Overview

This is a frontend-only React application built as a Q&A community platform similar to CMOlist. The application replicates the exact design from the provided mockup and allows users to view questions, answers, and engage with a community around topics like marketing, branding, and business expertise. It features a modern, responsive design with a clean interface optimized for both desktop and mobile experiences.

## Recent Changes (August 21, 2025)
- **Custom UI Components Implementation**: Built exact date picker and country code selector matching user-provided designs
  - Created CustomDatePicker component with three-view navigation: Year grid (2025-2036) → Month grid (Jan-Dec) → Calendar days
  - Implemented CountryCodeSelector with searchable dropdown showing flag + country name + code format
  - Both components match the exact visual designs provided by user with proper styling and functionality
  - Replaced standard React components with custom implementations for precise UI control
- **Enhanced API Debugging and Error Handling**: Added comprehensive console logging for location APIs
  - Added detailed console logs for states API calls with endpoint, parameters, response status, and data validation
  - Enhanced cities API debugging with emoji-coded console outputs for easy identification
  - Fixed cities API data handling to match states API format (direct array response)
  - Added success/warning messages for empty responses and comprehensive error handling
  - All location API calls now provide detailed debugging information for troubleshooting
- **Performance Optimization and UX Improvements**: Addressed critical performance bottlenecks and enhanced user experience
  - Optimized dropdown performance using React.useMemo for all Select component options (country codes, countries, states, cities, job titles)
  - Expanded country code list from 15 to 195+ countries with proper flags for comprehensive global support
  - Enhanced radio button switching with loading state to improve perceived performance
  - Removed irrelevant "Profile Type" title, changed to "Complete Your Information" for better clarity
  - Fixed Firebase Phone Auth integration with proper state management and verification flow
  - Added CORS headers and debugging logs to resolve external API connectivity issues (/users/me endpoint)
  - Implemented smooth form switching between personal and business profiles with proper state reset
  - Added loading indicators during profile type switching to enhance user feedback
- **Complete UX Fixes and Enhanced Dropdown Performance**: Resolved all user-reported issues for optimal experience
  - Fixed radio button clickable area by wrapping entire card with Label element for full area responsiveness
  - Created custom searchable Combobox component to replace slow Select components with instant search functionality
  - Implemented searchable dropdowns for all location fields (countries, states, cities) and country codes
  - Fixed country code flags display consistency between desktop and mobile views
  - Corrected API endpoint format for cities: using country_code and state_code parameters as required
  - Optimized all dropdown components with React.useMemo and proper data structure for maximum performance
  - Added hidePhoneNumber checkbox field to both personal and business forms for privacy control
  - Replaced all remaining Select components with searchable Combobox for consistent user experience
  - Fixed country code display to show flag + code + country name format for better identification
  - Ensured all location dropdowns cascade properly (Country → State → City) with proper API integration
  - Enhanced phone number validation to prevent text entry (digits only)
  - Improved search input alignment and styling in all Combobox components
  - Added year/month dropdown navigation to date picker for better user experience
  - Applied comprehensive mobile responsiveness to all pages (login, signup, basic info, and supporting pages)
- **Enhanced Basic Info Form with Professional Features**: Completely redesigned user profile form with comprehensive improvements
  - Updated job titles dropdown with complete construction industry list including "Other (Specify)" option with custom text input
  - Implemented professional profile/cover image upload system with drag-and-drop functionality and file explorer integration
  - Added proper image cropping layout similar to social media platforms with overlay profile picture on cover image
  - Fixed cascading location dropdowns: Country → State → City with proper dependencies and data clearing
  - Separated company and position fields to prevent cross-contamination during typing
  - Added comprehensive field validation for all mandatory fields (DOB, Job Title, Position, Company, Country, State, City)
  - Enhanced API integration with FormData and multipart requests for file uploads
  - Improved error handling and user feedback with field-specific validation messages
- **User Verification and Profile Flow Implementation**: Built complete post-login user verification system
  - Added user profile API integration with external backend using bearer token authentication
  - Created user profile caching system with automatic token expiration handling
  - Built route protection that automatically redirects users based on verification and basic info completion status
  - Enhanced profile page to display all user data fetched from external API with refresh functionality
- **Build Configuration Fixed**: Resolved duplicate export declarations causing deployment failures
  - Eliminated duplicate onAuthStateChange and signOutUser function exports in firebase.ts
  - Restructured firebase.ts file to prevent future duplicate export issues
  - Verified clean build process with no LSP diagnostics or compilation errors
- **API Integration Enhanced**: Improved external API communication for user data management
  - Updated userApi.ts to use FormData and multipart requests for file uploads including company field
  - Added support for profile and banner image file uploads with proper MIME type validation
  - Built comprehensive error handling for token expiration and authentication failures
  - Created user data caching strategy for optimal performance and profile page usage

## Previous Changes (August 15, 2025)
- **Complete Forgot Password Flow Implementation**: Built comprehensive password reset functionality with Firebase Authentication
  - Added Firebase password reset functions: sendPasswordReset, verifyResetCode, resetPassword
  - Updated forgot password page with email validation and user feedback
  - Implemented email existence checking and proper error handling
  - Added check email reset page with resend functionality
  - Built reset password page with URL parameter handling and password confirmation
  - Created password reset success page with back to login navigation
  - All pages updated with "CP" branding and construction industry focus
  - Complete flow: forgot password → email check → reset link → new password → success → login
- **External API Integration Fixed**: Corrected form data format and field names for external signup API
  - Changed "profilePicture" to "profileURL" field name as required by external API
  - Implemented FormData instead of JSON for API requests
  - Added bearer token authentication for both Google and email signup flows
  - Firebase ID tokens now properly sent with Authorization header
- **Authentication System Complete**: Implemented full login/signup functionality with session management
  - Added Google signin functionality to login page matching signup page behavior
  - Implemented email/password login with proper Firebase authentication
  - Created authentication context and protected routes for session management
  - Session persistence: Firebase auth sessions last ~1 hour (default), extended with "Remember Me" option
  - Protected routes now redirect unauthenticated users to login page
- **UI/UX Improvements**: Updated branding and layout for construction industry focus
  - Changed all "CMOlist" references to "CP" throughout the application
  - Updated text content to focus on construction and civil engineering professionals
  - Implemented side-by-side Google/Facebook social login buttons layout
  - Changed "Apple" button to "Facebook" as requested
  - Fixed footer layout: copyright aligned left, privacy/terms links aligned right
  - Updated signup link text: "Create an account? SignUp" instead of "New on CMOlist? Apply now"
- **CSS Loading Issue COMPLETELY RESOLVED**: Fixed critical server routing issue preventing React app from loading
  - Root cause: Custom HTML route for '/' was overriding the built React app serving
  - Fixed server routing to properly serve the built React app from dist/public/index.html
  - Removed conflicting custom route that was blocking SPA functionality
  - React app now loads correctly with full CSS styling and professional interface
  - All navigation, colors, fonts, and layout rendering perfectly in both development and deployment
  - CMOlist-inspired Q&A platform now fully functional with responsive design
- **Deployment Issues COMPLETELY RESOLVED**: Fixed all Cloud Run deployment and build configuration issues
  - Verified client directory structure is complete with proper Vite entry points
  - Confirmed client/index.html exists and properly references /src/main.tsx
  - All React components and App.tsx routing configuration working correctly
  - Production build process now completes successfully without errors
  - Simplified server configuration with streamlined Express.js setup
  - Server uses PORT environment variable with 8080 fallback (Cloud Run standard)
  - Always binds to 0.0.0.0 host as required by Cloud Run
  - REPLIT_DEPLOYMENT environment variable properly detected and logged
  - Comprehensive testing: development (5000) and deployment (8080) modes both working
- **Deployment Issue Fixed**: Resolved build failures by restructuring project for proper Vite configuration
  - Created client directory structure with index.html entry point
  - Moved src folder to client/src to match Vite config expectations
  - Fixed Express server to serve built static files instead of using problematic Vite middleware
  - All API endpoints working correctly (/api/health returns proper responses)
  - Fixed Express server to serve built static files instead of using problematic Vite middleware
  - All API endpoints working correctly (/api/health returns proper responses)
- **Authentication System Complete**: Built comprehensive authentication flow with 8 responsive pages (login, signup, email verification, forgot password, reset password, etc.)
- **Mobile Responsive Design**: All authentication pages now fully responsive with mobile-first approach and adaptive layouts
- **AI Security Recommendations**: Implemented complete AI-powered security dashboard with:
  - Database schema for security assessments, recommendations, and metrics
  - Express API routes for CRUD operations
  - Interactive security dashboard with tabs, progress tracking, and implementation status
  - Sample data with realistic security recommendations and scoring
- **Backend Architecture**: Restored Express.js backend with TypeScript, in-memory storage, and REST API endpoints
- **UI Components**: Added shadcn/ui components (Badge, Progress, Tabs, Alert) for rich user interface

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows modern component-based architecture patterns:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with a custom design system using CSS variables for theming
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent, accessible interface elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Native React state with fetch API for data management
- **Build Tool**: Vite for fast development and optimized production builds

The design follows a three-column layout with left sidebar for navigation/filters, main content area for questions and answers, and right sidebar for user stats and additional information. Mobile responsiveness is handled with a bottom navigation bar and responsive grid layouts.

## Backend Architecture
The backend uses a REST API pattern with Express.js:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **API Design**: RESTful endpoints for users, security assessments, recommendations, and metrics
- **Error Handling**: Centralized error middleware with structured error responses
- **Authentication**: Ready for integration with authentication providers

The server implements a storage abstraction layer (IStorage interface) currently using in-memory storage with comprehensive sample data.

## Data Storage
Currently uses an in-memory storage system with realistic sample data:

- **Storage Pattern**: Repository pattern with IStorage interface abstraction
- **Data Models**: Strong TypeScript typing for security-focused entities (User, SecurityAssessment, SecurityRecommendation, SecurityMetric)
- **Schema Validation**: Zod schemas for runtime validation of API inputs
- **Database Ready**: Drizzle ORM configuration prepared for PostgreSQL migration

The schema includes tables for users, security assessments (with company info and risk scoring), security recommendations (AI-generated with implementation tracking), and security metrics (for progress monitoring).

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **TypeScript**: Full TypeScript implementation across frontend and backend
- **Build Tools**: Vite for frontend bundling, esbuild for backend compilation

### UI and Styling
- **Radix UI**: Complete suite of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

### Backend Infrastructure
- **Express.js**: Web framework for REST API
- **Drizzle ORM**: Type-safe SQL ORM ready for PostgreSQL
- **Neon Database**: Serverless PostgreSQL database provider
- **Zod**: Schema validation library

### Development and Production Tools
- **TanStack Query**: Server state management and caching
- **Date-fns**: Date manipulation and formatting
- **React Hook Form**: Form state management with validation
- **Replit Integration**: Development environment optimizations for Replit platform

The application is structured as a monorepo with shared TypeScript types and schemas between frontend and backend, enabling full-stack type safety and reducing development errors.
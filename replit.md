# Overview

This is a frontend-only React application built as a Q&A community platform similar to CMOlist. The application replicates the exact design from the provided mockup and allows users to view questions, answers, and engage with a community around topics like marketing, branding, and business expertise. It features a modern, responsive design with a clean interface optimized for both desktop and mobile experiences.

## Recent Changes (August 15, 2025)
- **CSS Loading Issue with Cache-Busting Fix**: Implementing aggressive cache-busting to resolve browser caching issues
  - Changed from long-term caching (max-age: 1y) to no-cache headers for CSS and JS files
  - Added Cache-Control: no-cache, no-store, must-revalidate headers to force fresh asset loading
  - Vite build system generates new hashed filenames on each build for cache-busting
  - Enhanced static file serving with proper Content-Type headers and charset specification
  - Fixed SPA fallback middleware to exclude /assets/ routes from HTML serving
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
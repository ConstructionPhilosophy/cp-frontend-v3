# Overview
This is a frontend-only React application designed as a Q&A community platform, mimicking CMOlist's functionality and design. It allows users to view questions, answers, and engage in discussions related to marketing, branding, and business expertise. The platform features a modern, responsive design optimized for both desktop and mobile, with a focus on a clean user interface. The project's business vision is to provide a specialized community hub for professionals in specific industries, starting with construction and civil engineering.

# User Preferences
Preferred communication style: Simple, everyday language.

## Design Standards
**CRITICAL: Compact LinkedIn-Style Design** - ALL pages and components must follow the compact LinkedIn-style design established in user-profile.tsx:
- **Avatar Sizes**: Use w-8 to w-10 maximum (never w-12, w-16, w-20, w-24 or larger)
- **Font Hierarchy**: text-sm to text-lg maximum for headings (never text-xl, text-2xl or larger)
- **Spacing**: Use p-4 for padding instead of p-6, mb-4 for margins
- **Visual Consistency**: Maintain tight, professional spacing throughout all components
- **Reference**: user-profile.tsx serves as the design standard - match its styling exactly

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, employing a component-based architecture. It uses Tailwind CSS with a custom design system for styling, Radix UI primitives and custom shadcn/ui components for consistent and accessible UI elements, and Wouter for client-side routing. State management relies on native React state with the Fetch API for data interactions. Vite is used for fast development and optimized production builds. The design features a three-column layout (left sidebar for navigation, main content for Q&A, right sidebar for user stats) with mobile responsiveness handled via a bottom navigation bar and responsive grids. Custom UI components such as a date picker and country code selector are implemented to match precise design specifications.

### Deployment Portability & Direct API Integration
**UPDATED (2025-01-26)**: The application now calls external APIs directly for optimal performance:
- **User APIs**: Direct calls to `https://cp-backend-service-test-972540571952.asia-south1.run.app` 
- **Geo APIs**: Direct calls to `https://geo-api-230500065838.asia-south1.run.app`
- **Environment Override**: Still configurable via `VITE_API_BASE_URL` for different environments
This eliminates proxy overhead and provides faster API responses.

## Backend Architecture
The backend uses Node.js with the Express.js framework, written in TypeScript. It follows a RESTful API pattern for managing users, security assessments, recommendations, and metrics. It includes centralized error handling. Currently, it utilizes an in-memory storage system with sample data, abstracted via an `IStorage` interface. The system is designed for easy migration to a persistent database.

## Data Storage
Currently, an in-memory storage system is used with realistic sample data. It employs a repository pattern with the `IStorage` interface and uses strong TypeScript typing for entities like `User`, `SecurityAssessment`, `SecurityRecommendation`, and `SecurityMetric`. Zod schemas are used for runtime validation of API inputs. The architecture is prepared for a PostgreSQL migration using Drizzle ORM.

## API Configuration
The application now uses direct external API calls for optimal performance:
- **User/Backend APIs**: Direct calls to `https://cp-backend-service-test-972540571952.asia-south1.run.app`
- **Geo APIs**: Direct calls to `https://geo-api-230500065838.asia-south1.run.app`
- **Environment Override**: Both can be overridden via `VITE_API_BASE_URL` for different environments
- This approach eliminates proxy overhead and provides faster, more reliable API responses.

# External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, Wouter
- **TypeScript**
- **Build Tools**: Vite, esbuild

### UI and Styling
- **Radix UI**
- **Tailwind CSS**
- **Lucide React**
- **Class Variance Authority**

### Backend Infrastructure
- **Express.js**
- **Drizzle ORM** (prepared for PostgreSQL)
- **Neon Database** (serverless PostgreSQL provider)
- **Zod**

### Development and Production Tools
- **TanStack Query**
- **Date-fns**
- **React Hook Form**
- **Firebase Authentication** (for login/signup, password reset, phone auth)

# Recent Changes

## Migration to Replit Environment (2025-08-28)
**Successfully migrated project from Replit Agent to standard Replit environment**
- **RESOLVED**: Fixed missing tsx dependency that prevented server startup
- **COMPLETED**: Built frontend successfully with Vite (assets generated in dist/public)
- **WORKING**: Server running on port 5000 with proper static file serving
- **SECURITY**: Maintained client/server separation with proper routing
- **VERIFIED**: API endpoints functional, static content serving correctly

**Technical Details:**
- **Package Installation**: All Node.js dependencies properly installed via npm
- **Build Process**: Frontend built with Vite, assets in dist/public directory
- **Server Configuration**: Express server configured for both development and deployment
- **Port Management**: Correctly uses PORT=5000 in development, respects Replit port configuration
- **File Serving**: Static files served from dist/public with proper cache headers
- **Routing**: SPA fallback routing implemented for client-side navigation

## Deployment Configuration Updates (2025-01-26)
**Final Fix: Simplified autoscale deployment compatibility**
- **RESOLVED**: Server now respects PORT environment variable set by autoscale deployment
- Fixed deployment detection to use `REPLIT_DEPLOYMENT=1` (not 'true') for autoscale
- Simplified server startup logging to reduce initialization time
- Streamlined error handling to prevent startup delays
- Server automatically adapts to autoscale port management

**Technical Details:**
- **Autoscale Deployment**: Respects `process.env.PORT` set by autoscale platform
- **Development**: Uses PORT=5000 when no PORT env var is set
- **Environment detection**: `REPLIT_DEPLOYMENT === '1'` for autoscale compatibility
- **Fast startup**: Minimal logging during initialization to meet port detection timeouts
- **Platform compatibility**: Works seamlessly with Replit autoscale port management
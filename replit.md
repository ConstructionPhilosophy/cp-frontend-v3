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

### Deployment Portability
**CRITICAL UPDATE (2025-01-24)**: The application is now fully deployment-portable across different domains. All hardcoded API URLs have been replaced with:
- **User APIs**: Environment-configurable URLs that default to `window.location.origin`
- **Geo APIs**: Direct calls to external geo API service (much simpler than proxy approach)
This ensures the app works on any domain without code changes.

## Backend Architecture
The backend uses Node.js with the Express.js framework, written in TypeScript. It follows a RESTful API pattern for managing users, security assessments, recommendations, and metrics. It includes centralized error handling. Currently, it utilizes an in-memory storage system with sample data, abstracted via an `IStorage` interface. The system is designed for easy migration to a persistent database.

## Data Storage
Currently, an in-memory storage system is used with realistic sample data. It employs a repository pattern with the `IStorage` interface and uses strong TypeScript typing for entities like `User`, `SecurityAssessment`, `SecurityRecommendation`, and `SecurityMetric`. Zod schemas are used for runtime validation of API inputs. The architecture is prepared for a PostgreSQL migration using Drizzle ORM.

## API Configuration
The application uses a hybrid approach for maximum deployment flexibility:
- `VITE_API_BASE_URL`: Main backend API (defaults to current domain)
- **Geo APIs**: Direct calls to `https://geo-api-230500065838.asia-south1.run.app` (no configuration needed)
- This approach eliminates the need for backend proxy services for geo data while maintaining flexibility for user APIs.

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

## Deployment Configuration Updates (2025-01-26)
**Fixed autoscale deployment port configuration issues:**
- Updated server to use port 80 for production deployment (autoscale requirement)
- Enhanced environment detection to include `REPLIT_DEPLOYMENT` flag
- Maintains port 5000 for development environment
- Added comprehensive error handling for port binding issues (EADDRINUSE, EACCES, ENOTFOUND)
- Added detailed startup logging for deployment debugging with environment context
- Server now automatically detects deployment environment and selects appropriate port

**Technical Details:**
- Production/Deployment: PORT=80 (required for autoscale deployment)
- Development: PORT=5000 (Replit development standard)
- Environment detection: `process.env.NODE_ENV === 'production' || process.env.REPLIT_DEPLOYMENT`
- Enhanced error handling includes environment context logging for debugging
- Comprehensive port binding error messages with deployment-specific guidance
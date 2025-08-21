# Overview
This is a frontend-only React application designed as a Q&A community platform, mimicking CMOlist's functionality and design. It allows users to view questions, answers, and engage in discussions related to marketing, branding, and business expertise. The platform features a modern, responsive design optimized for both desktop and mobile, with a focus on a clean user interface. The project's business vision is to provide a specialized community hub for professionals in specific industries, starting with construction and civil engineering.

# User Preferences
Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, employing a component-based architecture. It uses Tailwind CSS with a custom design system for styling, Radix UI primitives and custom shadcn/ui components for consistent and accessible UI elements, and Wouter for client-side routing. State management relies on native React state with the Fetch API for data interactions. Vite is used for fast development and optimized production builds. The design features a three-column layout (left sidebar for navigation, main content for Q&A, right sidebar for user stats) with mobile responsiveness handled via a bottom navigation bar and responsive grids. Custom UI components such as a date picker and country code selector are implemented to match precise design specifications.

## Backend Architecture
The backend uses Node.js with the Express.js framework, written in TypeScript. It follows a RESTful API pattern for managing users, security assessments, recommendations, and metrics. It includes centralized error handling. Currently, it utilizes an in-memory storage system with sample data, abstracted via an `IStorage` interface. The system is designed for easy migration to a persistent database.

## Data Storage
Currently, an in-memory storage system is used with realistic sample data. It employs a repository pattern with the `IStorage` interface and uses strong TypeScript typing for entities like `User`, `SecurityAssessment`, `SecurityRecommendation`, and `SecurityMetric`. Zod schemas are used for runtime validation of API inputs. The architecture is prepared for a PostgreSQL migration using Drizzle ORM.

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
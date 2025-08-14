# Overview

This is a frontend-only React application built as a Q&A community platform similar to CMOlist. The application replicates the exact design from the provided mockup and allows users to view questions, answers, and engage with a community around topics like marketing, branding, and business expertise. It features a modern, responsive design with a clean interface optimized for both desktop and mobile experiences.

## Recent Changes (August 14, 2025)
- **Converted to Frontend-Only**: Removed all Express/Node server code, backend scripts, and database dependencies
- **Updated Architecture**: Now uses pure React with react-router-dom for client-side routing
- **Simplified Structure**: Moved to standard src/ folder structure with components, pages, hooks, and assets
- **Removed Server Dependencies**: Eliminated TanStack Query, Drizzle ORM, and all server-side code
- **Maintained Design**: Preserved exact UI design and styling from original CMOlist mockup

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows modern component-based architecture patterns:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with a custom design system using CSS variables for theming
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent, accessible interface elements
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds

The design follows a three-column layout with left sidebar for navigation/filters, main content area for questions and answers, and right sidebar for user stats and additional information. Mobile responsiveness is handled with a bottom navigation bar and responsive grid layouts.

## Backend Architecture
The backend uses a REST API pattern with Express.js:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **API Design**: RESTful endpoints for users, questions, answers, spaces, and vendors
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request/response logging middleware for API monitoring

The server implements a storage abstraction layer (IStorage interface) currently using in-memory storage with mock data, making it easy to swap in a real database implementation later.

## Data Storage
Currently uses an in-memory storage system with mock data:

- **Storage Pattern**: Repository pattern with IStorage interface abstraction
- **Data Models**: Strong TypeScript typing for User, Question, Answer, Space, and Vendor entities
- **Schema Validation**: Zod schemas for runtime validation of API inputs
- **Database Ready**: Drizzle ORM configuration prepared for PostgreSQL migration

The schema includes tables for users (with profile info and community stats), questions (with categorization and tagging), answers (linked to questions and users), spaces (community categories), and vendors (business listings).

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
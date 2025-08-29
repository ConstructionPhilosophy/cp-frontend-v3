# Firebase Hosting Deployment Guide

This project is now fully configured for Firebase hosting deployment.

## Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

## Deployment Steps

### Option 1: Use Existing Build Command
1. **Build the project:**
   ```bash
   npm run build
   ```
   This creates the `dist/public` folder with all static assets.

2. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

### Option 2: Frontend-Only Build (Recommended for Firebase)
1. **Build only the frontend:**
   ```bash
   npx vite build
   ```

2. **Deploy to Firebase:**
   ```bash
   firebase deploy
   ```

## Configuration Details

- **Public Directory**: `dist/public` (contains the built React app)
- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Caching**: Static assets (JS/CSS/images) cached for 1 year
- **Project ID**: `construction-philosophy-test`

## Important Notes

- The project is configured as a **frontend-only** deployment for Firebase hosting
- All API calls go directly to external services (no server-side deployment needed)
- Environment variables should be set with `VITE_` prefix for client-side access
- Firebase hosting will serve the static React application

## Environment Variables

For production deployment, ensure these environment variables are properly configured:
- `VITE_API_BASE_URL` - Backend API URL
- Firebase configuration (already included in the app)

## Build Output

The build process creates:
- `dist/public/index.html` - Main HTML file
- `dist/public/assets/` - Bundled JS, CSS, and other assets
- Static file routing configured for SPA behavior
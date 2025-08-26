# Deployment Guide

This application is designed to be deployed to any domain without code changes. All API endpoints are configurable via environment variables.

## Quick Deployment Steps

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform

3. **Configure environment variables** (optional):
   - Set `VITE_API_BASE_URL` if your backend API is on a different domain
   - Set `VITE_GEO_API_BASE_URL` if your geo API is on a different domain
   - Set Firebase environment variables: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

## Environment Variables

### Required for Firebase
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID  
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID

### Optional API Configuration
- `VITE_API_BASE_URL`: Backend API base URL (defaults to current domain origin)
- `VITE_GEO_API_BASE_URL`: Geo API base URL (defaults to current domain origin)

## Default Behavior

If environment variables are not set:
- **API calls** will use `window.location.origin` (current domain)
- **Relative API calls** (like `/api/countries`) will work on any domain
- **External API calls** will also default to the current domain

## Deployment Examples

### 1. Self-contained deployment (APIs on same domain)
No environment variables needed. Just deploy the `dist` folder.

### 2. External APIs
Set environment variables:
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_GEO_API_BASE_URL=https://your-geo-api.com
```

### 3. Mixed setup
```env
VITE_API_BASE_URL=https://external-api.com
# GEO API will default to current domain
```

## Troubleshooting

### Issue: API calls return 404/500 errors
**Solution**: Check if your backend APIs are deployed and accessible. The app now defaults to calling APIs on the same domain.

### Issue: CORS errors
**Solution**: Ensure your backend APIs have proper CORS configuration for your domain.

### Issue: Firebase authentication not working  
**Solution**: Verify Firebase environment variables are set correctly and Firebase project allows your domain.

## Previous Hardcoded URLs (Now Fixed)
✅ `client/src/lib/firebase.ts` - Now uses `VITE_API_BASE_URL` or current domain  
✅ `client/src/lib/userApi.ts` - Now uses `VITE_API_BASE_URL` or current domain  
✅ `client/src/pages/basic-info.tsx` - Now uses `VITE_GEO_API_BASE_URL` or current domain
# Local Development Troubleshooting Guide

## Firebase Configuration Issues

### 1. Environment Variables Not Loading
**Problem**: Your .env changes aren't reflecting, or you're getting "invalid key" errors.

**Common Causes & Solutions**:

#### A. File Location
- **Issue**: .env file in wrong location
- **Solution**: Ensure your `.env` file is in the **project root** (same level as package.json)

#### B. Environment Variable Naming
- **Required Variables**: All must start with `VITE_` prefix for Vite to expose them to the frontend:
```bash
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here  
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_API_BASE_URL=https://cp-backend-service-test-972540571952.asia-south1.run.app
```

#### C. Server Restart Required
- **Issue**: Changes not reflecting after updating .env
- **Solution**: 
  1. Stop the dev server (Ctrl+C)
  2. Run `npm run dev` again
  3. Vite must be restarted to pick up new environment variables

#### D. Common Firebase Configuration Mistakes
1. **Missing quotes**: Don't wrap values in quotes in .env file
   ```bash
   # Wrong:
   VITE_FIREBASE_API_KEY="your_key_here"
   
   # Correct:
   VITE_FIREBASE_API_KEY=your_key_here
   ```

2. **Wrong Firebase project settings**:
   - authDomain should be: `your-project-id.firebaseapp.com`
   - storageBucket should be: `your-project-id.firebasestorage.app` (note the .app extension)

3. **API Key restrictions**: Check if your Firebase API key has domain restrictions that block localhost

### 2. Build vs Development Issues

#### For Development (npm run dev):
- Uses Vite dev server
- Hot reloading enabled
- Environment variables loaded from .env

#### For Production Build (npm run build):
- Environment variables must be set during build time
- Check if you're testing the built version vs dev version

### 3. Firebase Project Configuration

#### Verify Your Firebase Settings:
1. Go to Firebase Console → Project Settings → General
2. Copy the exact values:
   - **API Key**: Found in "Web API Key"
   - **Project ID**: Your project identifier (not display name)
   - **App ID**: From your web app configuration

#### Enable Required Services:
1. **Authentication**: Firebase Console → Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (if using)
2. **Firestore**: Firebase Console → Firestore Database
3. **Storage**: Firebase Console → Storage

### 4. Debugging Steps

#### Step 1: Verify Environment Variables
Add this temporary debugging code to `client/src/lib/firebase.ts` (remove after testing):

```javascript
// Add at the top after imports
console.log('Firebase Config Debug:');
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing');
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('App ID:', import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Missing');
```

#### Step 2: Check Network Tab
1. Open browser dev tools → Network tab
2. Try to sign in/sign up
3. Look for failed requests to Firebase APIs
4. Check the exact error messages

#### Step 3: Console Errors
1. Open browser dev tools → Console tab
2. Look for specific Firebase error messages
3. Common errors:
   - "Firebase: Error (auth/api-key-not-valid)"
   - "Firebase: Error (auth/invalid-api-key)"
   - "Firebase: Error (auth/project-not-found)"

### 5. Complete Local Setup Checklist

- [ ] `.env` file in project root directory
- [ ] All required `VITE_` prefixed environment variables set
- [ ] No quotes around values in .env file
- [ ] Firebase project has Authentication enabled
- [ ] Firebase API key allows localhost domain
- [ ] Dev server restarted after .env changes
- [ ] Browser hard refresh (Ctrl+Shift+R) after changes

### 6. Example Working .env File

```bash
# Firebase Configuration (get these from Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=AIzaSyD6Gy9bFZ8H3K4L2M5N7P8Q0R2S4T6U8V0
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345

# API Configuration  
VITE_API_BASE_URL=https://cp-backend-service-test-972540571952.asia-south1.run.app
```

### 7. If Still Not Working

1. **Create a fresh .env file** - copy the example above and replace with your actual values
2. **Verify Firebase Console settings** - double-check all values match exactly
3. **Try incognito mode** - rules out browser caching issues
4. **Check Firebase quota** - ensure you haven't exceeded free tier limits
5. **Restart your entire development environment** - close all terminals, restart IDE

This should resolve most local development Firebase configuration issues.
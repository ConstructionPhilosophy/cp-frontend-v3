import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  User
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: '972540571952',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// External API base URL - configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;

// Call external signup API with FormData
const callExternalSignupAPI = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  hasBasicInfo?: boolean;
}, user?: User) => {
  try {
    const headers: HeadersInit = {};

    // Add bearer token if user is provided
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Create FormData instead of JSON
    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('firstName', userData.firstName);
    formData.append('lastName', userData.lastName);
    formData.append('hasBasicInfo', userData.hasBasicInfo?.toString() || 'false');
    
    // Only add profileURL if it exists
    if (userData.profilePic) {
      formData.append('profileURL', userData.profilePic);
    }

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('External API call error:', error);
    throw error;
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Call external signup API with Google user data and bearer token
    await callExternalSignupAPI({
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      profilePic: user.photoURL || '',
      hasBasicInfo: false,
    }, user);

    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
) => {
  try {
    // Create user in Firebase
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Send verification email
    await sendEmailVerification(user, {
      url: `${window.location.origin}/verification-success`,
      handleCodeInApp: true,
    });

    // Call external signup API with email user data  
    await callExternalSignupAPI({
      firstName,
      lastName,
      email,
      hasBasicInfo: false,
    }, user);

    return user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

// Auth state change listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Send Password Reset Email
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Send password reset error:', error);
    throw error;
  }
};

// Verify Password Reset Code
export const verifyResetCode = async (code: string) => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error) {
    console.error('Verify reset code error:', error);
    throw error;
  }
};

// Confirm Password Reset
export const resetPassword = async (code: string, newPassword: string) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    console.log('Password reset successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};
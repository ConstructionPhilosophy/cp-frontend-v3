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
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: '972540571952',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// External API base URL
const API_BASE_URL = 'https://cp-backend-service-test-972540571952.asia-south1.run.app';

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Call external signup API with Google user data
    await callExternalSignupAPI({
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      profilePicture: user.photoURL || '',
    });

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
    });

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

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Call external signup API
const callExternalSignupAPI = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  hasBasicInfo?: boolean;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('External API call error:', error);
    throw error;
  }
};
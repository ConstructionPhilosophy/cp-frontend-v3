import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '../lib/firebase';
import { userApiService, UserProfile } from '../lib/userApi';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  refreshUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await userApiService.getCurrentUser(true);
      setUserProfile(profile);
    } catch (error: any) {
      if (error.message === 'AUTH_EXPIRED') {
        // Token expired, sign out user
        setUser(null);
        setUserProfile(null);
        userApiService.clearCache();
      }
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Handle remember me functionality
        const rememberMe = localStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
          console.log('User session will be remembered');
        }
        
        try {
          const profile = await userApiService.getCurrentUser();
          setUserProfile(profile);
        } catch (error: any) {
          if (error.message === 'AUTH_EXPIRED') {
            setUser(null);
            setUserProfile(null);
            userApiService.clearCache();
          }
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        userApiService.clearCache();
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
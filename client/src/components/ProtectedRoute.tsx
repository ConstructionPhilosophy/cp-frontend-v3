import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'wouter';
import { LoginPage } from '../pages/login';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresIncompleteProfile?: boolean;
}

export function ProtectedRoute({ children, requiresIncompleteProfile = false }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user && userProfile) {
      // Check if user email is verified
      if (!user.emailVerified && !userProfile.verified) {
        setLocation('/check-email');
        return;
      }

      // Check if user has completed basic info
      if (!requiresIncompleteProfile && !userProfile.hasBasicInfo) {
        setLocation('/basic-info');
        return;
      }
      
      // If this route requires incomplete profile but user has complete profile
      if (requiresIncompleteProfile && userProfile.hasBasicInfo) {
        setLocation('/');
        return;
      }
    }
  }, [loading, user, userProfile, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cmo-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Additional checks for verified and basic info completion
  if (userProfile) {
    if (!user.emailVerified && !userProfile.verified) {
      return null; // Will redirect to check-email
    }

    if (!requiresIncompleteProfile && !userProfile.hasBasicInfo) {
      return null; // Will redirect to basic-info
    }
    
    if (requiresIncompleteProfile && userProfile.hasBasicInfo) {
      return null; // Will redirect to home
    }
  }

  return <>{children}</>;
}
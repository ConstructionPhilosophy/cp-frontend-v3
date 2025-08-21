import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, userProfile, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect based on profile completion
  if (isAuthenticated) {
    if (userProfile?.hasBasicInfo) {
      setLocation('/');
      return null;
    } else {
      setLocation('/basic-info');
      return null;
    }
  }

  // If not authenticated, show the public route
  return <>{children}</>;
}
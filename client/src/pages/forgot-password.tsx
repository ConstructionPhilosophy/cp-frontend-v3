import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Key, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await sendPasswordReset(email);
      
      // Store email for resending functionality
      localStorage.setItem('resetEmail', email);
      
      toast({
        title: "Reset email sent!",
        description: "Please check your email for password reset instructions.",
      });

      // Navigate to check email reset page
      setLocation("/check-email-reset");
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden lg:flex hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cmo-primary/10 to-purple-600/20"></div>
        
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
                <path d="M25 0L50 14.4V35.6L25 50L0 35.6V14.4L25 0Z" stroke="currentColor" strokeWidth="1" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" className="text-cmo-primary/30"/>
          </svg>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full p-8">
          <div className="text-center max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Professional network for construction industry
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Connect with construction professionals, engineers, and project managers.
              Build your professional network in the construction sector.
            </p>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-cmo-primary rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 bg-white min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-cmo-text-primary">CP</span>
          </div>

          {/* Key Icon */}
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-gray-600" />
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cmo-text-primary mb-2">Forgot password?</h2>
            <p className="text-cmo-text-secondary">No worries, we'll send you reset instructions.</p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="h-11 border-gray-300 focus:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Reset Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-cmo-primary hover:bg-cmo-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Reset password'
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-sm text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to log in
                </Button>
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">© 2024 CP Inc. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/privacy-policy">
                <Button variant="link" className="p-0 h-auto text-sm text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms-conditions">
                <Button variant="link" className="p-0 h-auto text-sm text-gray-500 hover:text-gray-700">
                  Terms & Conditions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
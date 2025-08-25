import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { sendPasswordReset } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

export function CheckEmailResetPage() {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    setResending(true);
    try {
      // Get email from localStorage or URL params if available
      const email = localStorage.getItem('resetEmail') || '';
      if (!email) {
        toast({
          title: "Email not found",
          description: "Please go back to the forgot password page and try again.",
          variant: "destructive",
        });
        return;
      }

      await sendPasswordReset(email);
      
      toast({
        title: "Email resent!",
        description: "Please check your email for the new reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
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

        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-center max-w-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Professional network for construction industry
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
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

      {/* Right Side - Check Email Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-bold text-cmo-text-primary">CP</span>
          </div>

          {/* Email Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          {/* Content */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cmo-text-primary mb-4">Check your email</h2>
            <p className="text-cmo-text-secondary leading-relaxed">
              We've sent a password reset link to your email address. Please check your email and click the link to reset your password.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link href="/login">
              <Button variant="outline" className="w-full h-11">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
            
            <p className="text-sm text-cmo-text-secondary">
              Didn't receive the email? Check your spam folder or{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-cmo-primary hover:text-cmo-primary/80"
                onClick={handleResendEmail}
                disabled={resending}
              >
                {resending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    resending...
                  </>
                ) : (
                  'resend reset email'
                )}
              </Button>
            </p>
          </div>

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
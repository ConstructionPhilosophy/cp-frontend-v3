import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { resetPassword, verifyResetCode } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [resetCode, setResetCode] = useState('');
  const [email, setEmail] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Extract reset code from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    
    if (oobCode) {
      setResetCode(oobCode);
      // Verify the reset code
      verifyCode(oobCode);
    } else {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or expired.",
        variant: "destructive",
      });
      setLocation("/forgot-password");
    }
  }, []);

  const verifyCode = async (code: string) => {
    try {
      const userEmail = await verifyResetCode(code);
      setEmail(userEmail);
      setVerifying(false);
    } catch (error: any) {
      console.error("Reset code verification error:", error);
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or expired.",
        variant: "destructive",
      });
      setLocation("/forgot-password");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await resetPassword(resetCode, formData.password);
      
      toast({
        title: "Password updated!",
        description: "Your password has been successfully updated.",
      });

      // Navigate to success page
      setLocation("/password-reset-success");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

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

      {/* Right Side - Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-cmo-text-primary">CP</span>
          </div>

          {/* Lock Icon */}
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cmo-text-primary mb-2">Set new password</h2>
            <p className="text-cmo-text-secondary">Your new password must be different from previous used passwords.</p>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display */}
            <div className="text-sm text-gray-600 mb-4">
              Resetting password for: <strong>{email}</strong>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="h-11 pr-10 border-gray-300 focus:border-gray-500"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="h-11 pr-10 border-gray-300 focus:border-gray-500"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>Must be at least 8 characters.</p>
              <p>Must contain one special character.</p>
            </div>

            {/* Update Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-cmo-primary hover:bg-cmo-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update password'
              )}
            </Button>
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
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signInWithGoogle, signUpWithEmail } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      toast({
        title: "Account created successfully!",
        description: "Please check your email for verification link.",
      });

      // Redirect to email verification page
      setLocation("/check-email");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      
      toast({
        title: "Welcome!",
        description: "Successfully signed up with Google.",
      });

      // Redirect to home page
      setLocation("/");
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast({
        title: "Google signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-white min-h-screen lg:min-h-auto">
        <div className="w-full max-w-sm">
          {/* Mobile Header - Only visible on mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Join CP
            </h1>
            <p className="text-sm text-gray-600">
              Professional network for construction industry
            </p>
          </div>

          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-cmo-text-primary">CP</span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cmo-text-primary mb-2">Create Your CP Account</h2>
            <p className="text-cmo-text-secondary">Join the professional construction community</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="h-11"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="h-11"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="h-11"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-11 pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Repeat Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repeat Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  className="h-11 pr-10"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign Up Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-cmo-primary hover:bg-cmo-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            {/* Social Login */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">OR SIGN UP WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-200 hover:bg-gray-50 justify-center"
                  onClick={handleGoogleSignup}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 text-gray-700 border-gray-200 hover:bg-gray-50 justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-sm font-semibold">
                  Sign in
                </Button>
              </Link>
            </div>
          </form>

          {/* Footer - Fixed alignment */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500 space-y-2 sm:space-y-0">
              <p>© 2024 CP Inc. All rights reserved.</p>
              <div className="flex space-x-6">
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
    </div>
  );
}
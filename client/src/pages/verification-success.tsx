import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';

export function VerificationSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        // Wait for auth state to be resolved
        await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
          });
        });

        // Reload user to get updated verification status
        if (auth.currentUser) {
          await auth.currentUser.reload();
          
          if (auth.currentUser.emailVerified) {
            setVerified(true);
            toast({
              title: "Email verified successfully!",
              description: "You can now access all features of CP.",
            });
          } else {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Verification check error:", error);
        toast({
          title: "Verification check failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [toast]);

  const handleContinue = () => {
    setLocation('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-cmo-primary" />
              <h3 className="text-lg font-semibold mb-2">Verifying your email...</h3>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              verified ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <CheckCircle className={`w-8 h-8 ${
                verified ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {verified ? 'Email Verified!' : 'Verification Pending'}
          </CardTitle>
          <CardDescription>
            {verified 
              ? 'Your email has been successfully verified. Welcome to CP!'
              : 'Your email has not been verified yet. Please check your email and click the verification link.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verified ? (
            <Button 
              onClick={handleContinue}
              className="w-full bg-cmo-primary hover:bg-cmo-primary/90"
            >
              Continue to CP
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Check Again
              </Button>
              <Link href="/login">
                <Button 
                  variant="ghost"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
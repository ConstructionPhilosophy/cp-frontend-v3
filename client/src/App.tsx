import React from "react";
import { Route, Router, Switch } from "wouter";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";
import { CheckEmailPage } from "./pages/check-email";
import { VerificationSuccessPage } from "./pages/verification-success";
import { ForgotPasswordPage } from "./pages/forgot-password";
import { CheckEmailResetPage } from "./pages/check-email-reset";
import { ResetPasswordPage } from "./pages/reset-password";
import { PasswordResetSuccessPage } from "./pages/password-reset-success";
import { SecurityDashboard } from "./pages/security-dashboard-simple";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Public auth routes */}
          <Route path="/login" component={() => <LoginPage />} />
          <Route path="/signup" component={() => <SignupPage />} />
          <Route path="/check-email" component={() => <CheckEmailPage />} />
          <Route
            path="/verification-success"
            component={() => <VerificationSuccessPage />}
          />
          <Route
            path="/forgot-password"
            component={() => <ForgotPasswordPage />}
          />
          <Route
            path="/check-email-reset"
            component={() => <CheckEmailResetPage />}
          />
          <Route
            path="/reset-password"
            component={() => <ResetPasswordPage />}
          />
          <Route
            path="/password-reset-success"
            component={() => <PasswordResetSuccessPage />}
          />

          {/* Protected routes */}
          <Route
            path="/"
            component={() => (
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            component={() => (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/security"
            component={() => (
              <ProtectedRoute>
                <SecurityDashboard />
              </ProtectedRoute>
            )}
          />

          {/* 404 fallback - must be last */}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

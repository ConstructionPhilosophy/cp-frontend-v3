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
import { BasicInfoPage } from "./pages/basic-info";
import { SecurityDashboard } from "./pages/security-dashboard-simple";
import { MessagesPage } from "./pages/messages";
import { ChatPage } from "./pages/chat";
import UserProfilePage from "./pages/user-profile";
import JobsPage from "./pages/jobs";
import PostJobPage from "./pages/post-job";
import JobDetailsPage from "./pages/job-details";
import EmployerDashboard from "./pages/employer-dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Public auth routes - redirect to home if logged in */}
          <Route path="/login" component={() => (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          )} />
          <Route path="/signup" component={() => (
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          )} />
          <Route path="/check-email" component={() => <CheckEmailPage />} />
          <Route
            path="/verification-success"
            component={() => <VerificationSuccessPage />}
          />
          <Route
            path="/forgot-password"
            component={() => (
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            )}
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
          
          {/* Basic info route - only for users without complete profile */}
          <Route
            path="/basic-info"
            component={() => (
              <ProtectedRoute requiresIncompleteProfile={true}>
                <BasicInfoPage />
              </ProtectedRoute>
            )}
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
          <Route
            path="/messages"
            component={() => (
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/chat/:conversationId"
            component={() => (
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/u/:username"
            component={() => (
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/jobs"
            component={() => (
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/post-job"
            component={() => (
              <ProtectedRoute>
                <PostJobPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/employer-dashboard"
            component={() => (
              <ProtectedRoute>
                <EmployerDashboard />
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

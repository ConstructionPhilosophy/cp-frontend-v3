import { Route, Router } from "wouter";
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

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/security" component={() => <SecurityDashboard />} />
      <Route path="/login" component={() => <LoginPage />} />
      <Route path="/signup" component={() => <SignupPage />} />
      <Route path="/check-email" component={() => <CheckEmailPage />} />
      <Route path="/verification-success" component={() => <VerificationSuccessPage />} />
      <Route path="/forgot-password" component={() => <ForgotPasswordPage />} />
      <Route path="/check-email-reset" component={() => <CheckEmailResetPage />} />
      <Route path="/reset-password" component={() => <ResetPasswordPage />} />
      <Route path="/password-reset-success" component={() => <PasswordResetSuccessPage />} />
      <Route component={NotFoundPage} />
    </Router>
  );
}

export default App;

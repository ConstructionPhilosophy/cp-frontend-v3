import { Route, Router } from "wouter";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";
import { LoginPage } from "./pages/login";
import { SignupPage } from "./pages/signup";

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/login" component={() => <LoginPage />} />
      <Route path="/signup" component={() => <SignupPage />} />
      <Route component={NotFoundPage} />
    </Router>
  );
}

export default App;

import { Route, Router } from "wouter";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFoundPage} />
    </Router>
  );
}

export default App;

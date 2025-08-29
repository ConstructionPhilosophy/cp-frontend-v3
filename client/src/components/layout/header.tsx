import React from "react";
import {
  Search,
  MoreHorizontal,
  Home,
  User,
  Edit,
  Flag,
  Share,
  Settings,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  RefreshCw,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../lib/firebase";
import { useToast } from "../../hooks/use-toast";

export default function Header() {
  const { userProfile } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("rememberMe");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      setLocation("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    setLocation("/profile");
  };
  return (
    <header className="bg-white border-b border-cmo-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-lg font-bold text-cmo-text-primary">
                CP
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cmo-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-cmo-border rounded-lg focus:ring-2 focus:ring-cmo-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Navigation Menu with Icons */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/">
              <a className="flex flex-col items-center text-cmo-primary">
                <Home className="w-5 h-5" />
                <span className="text-xs mt-1">Home</span>
              </a>
            </Link>
            <Link href="/news">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <FileText className="w-5 h-5" />
                <span className="text-xs mt-1">News</span>
              </a>
            </Link>
            <Link href="/articles">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <FileText className="w-5 h-5" />
                <span className="text-xs mt-1">Articles</span>
              </a>
            </Link>
            <Link href="/jobs">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <Briefcase className="w-5 h-5" />
                <span className="text-xs mt-1">Jobs</span>
              </a>
            </Link>
            <Link href="/forum">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <Users className="w-5 h-5" />
                <span className="text-xs mt-1">Forum</span>
              </a>
            </Link>
            <Link href="/messages">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs mt-1">Messages</span>
              </a>
            </Link>
            <Link href="/updates">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <RefreshCw className="w-5 h-5" />
                <span className="text-xs mt-1">Updates</span>
              </a>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* My Profile Button - Direct redirect */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-cmo-text-secondary hover:text-cmo-primary"
              onClick={handleProfileClick}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile?.profilePic || ""} />
                <AvatarFallback>
                  {userProfile?.firstName?.charAt(0) || "U"}
                  {userProfile?.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <span>My Profile</span>
            </Button>

            {/* Three Dots Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-cmo-text-secondary hover:text-cmo-primary"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Terms & Conditions</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

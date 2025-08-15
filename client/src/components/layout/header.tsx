import React from "react";
import { Search, MoreHorizontal, Home, User, Edit, Flag, Share, Settings, FileText, Briefcase, Users, MessageSquare, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function Header() {
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
              <span className="text-xl font-bold text-cmo-text-primary">CMOlist</span>
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
            <a href="/" className="flex flex-col items-center text-cmo-primary">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">Home</span>
            </a>
            <a href="/news" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-1">News</span>
            </a>
            <a href="/articles" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-1">Articles</span>
            </a>
            <a href="/jobs" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs mt-1">Jobs</span>
            </a>
            <a href="/forum" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <Users className="w-5 h-5" />
              <span className="text-xs mt-1">Forum</span>
            </a>
            <a href="/messages" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs mt-1">Messages</span>
            </a>
            <a href="/updates" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs mt-1">Updates</span>
            </a>
            <Link href="/profile">
              <a className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs mt-1">My Profile</span>
              </a>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* My Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-cmo-text-secondary hover:text-cmo-primary">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">My Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Three Dots Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-cmo-text-secondary hover:text-cmo-primary">
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
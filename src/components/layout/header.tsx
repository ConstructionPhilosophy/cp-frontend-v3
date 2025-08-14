import React from "react";
import { Search, MoreHorizontal, Home, User, Edit, Flag, Share, Settings } from "lucide-react";
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

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="flex items-center gap-1 text-cmo-primary font-medium">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </a>
            <a href="/news" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">News</a>
            <a href="/articles" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">Articles</a>
            <a href="/jobs" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">Jobs</a>
            <a href="/forum" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">Forum</a>
            <a href="/messages" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">Messages</a>
            <a href="/updates" className="text-cmo-text-secondary hover:text-cmo-primary transition-colors">Updates</a>
          </nav>

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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
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
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
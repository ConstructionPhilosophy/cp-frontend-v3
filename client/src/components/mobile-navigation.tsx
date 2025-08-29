import React from "react";
import { Home, Users, Book, TrendingUp, Building, User, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function MobileNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cmo-border z-50">
      <div className="flex items-center justify-around py-2">
        <Link href="/">
          <a className="flex flex-col items-center p-2 text-cmo-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/members">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Members</span>
          </a>
        </Link>
        <Link href="/forum">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Forum</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
        <Link href="/employer-dashboard">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
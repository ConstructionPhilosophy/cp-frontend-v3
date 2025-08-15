import React from "react";
import { Home, Users, Book, TrendingUp, Building, User } from "lucide-react";
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
        <Link href="/guides">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <Book className="h-5 w-5" />
            <span className="text-xs mt-1">Guides</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
        <Link href="/construction">
          <a className="flex flex-col items-center p-2 text-cmo-text-secondary">
            <Building className="h-5 w-5" />
            <span className="text-xs mt-1">Projects</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
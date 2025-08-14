import { Home, Users, Book, TrendingUp, Building } from "lucide-react";

export default function MobileNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cmo-border">
      <div className="flex items-center justify-around py-2">
        <a href="#" className="flex flex-col items-center p-2 text-cmo-primary">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-cmo-text-secondary">
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Members</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-cmo-text-secondary">
          <Book className="h-5 w-5" />
          <span className="text-xs mt-1">Guides</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-cmo-text-secondary">
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs mt-1">Martech</span>
        </a>
        <a href="#" className="flex flex-col items-center p-2 text-cmo-text-secondary">
          <Building className="h-5 w-5" />
          <span className="text-xs mt-1">Agencies</span>
        </a>
      </div>
    </nav>
  );
}

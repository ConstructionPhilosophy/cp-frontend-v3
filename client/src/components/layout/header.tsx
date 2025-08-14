import { Search, Menu, Home, Users, Book, TrendingUp, Building, Handshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-cmo-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cmo-primary rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-semibold text-cmo-text-primary">CMOlist</span>
            </div>
            
            {/* Desktop Search */}
            {!isMobile && (
              <div className="hidden md:block">
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-80 pl-10 pr-4 py-2 border border-cmo-border rounded-lg focus:ring-2 focus:ring-cmo-primary focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-cmo-text-secondary" />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="flex flex-col items-center text-cmo-primary">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </a>
            <a href="#" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary">
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Members</span>
            </a>
            <a href="#" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary">
              <Book className="h-5 w-5" />
              <span className="text-xs mt-1">Guides</span>
            </a>
            <a href="#" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs mt-1">Martech</span>
            </a>
            <a href="#" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary">
              <Building className="h-5 w-5" />
              <span className="text-xs mt-1">Agencies</span>
            </a>
            <a href="#" className="flex flex-col items-center text-cmo-text-secondary hover:text-cmo-primary">
              <Handshake className="h-5 w-5" />
              <span className="text-xs mt-1">Consultants</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}

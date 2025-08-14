import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { mockUsers, mockSpaces, mockVendors } from "../../lib/mock-data";

export default function SidebarRight() {
  return (
    <div className="space-y-6">
      {/* Questions & Answers Stats */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <p className="text-cmo-text-secondary text-sm">
          Questions & Answers (12) • Project & Vendors (3) • Articles &
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={mockUsers[1].avatar} />
            <AvatarFallback>{mockUsers[1].name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-cmo-text-primary">{mockUsers[1].name}</h3>
            <p className="text-cmo-text-secondary text-sm">{mockUsers[1].title} • Nov 20</p>
            <p className="text-cmo-text-secondary text-sm">Answering a previous • Retouch #content-marketing #branding</p>
          </div>
        </div>
        
        <h4 className="font-semibold text-cmo-text-primary mb-3">Community Contribution</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Posts:</span>
            <span className="font-semibold">{mockUsers[1].posts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Views:</span>
            <span className="font-semibold">{mockUsers[1].views}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Thanks:</span>
            <span className="font-semibold">{mockUsers[1].thanks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Insightful:</span>
            <span className="font-semibold">{mockUsers[1].insightful}</span>
          </div>
        </div>
      </div>

      {/* My Spaces */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-cmo-text-primary">My Spaces</h3>
          <Button variant="link" className="text-cmo-primary text-sm hover:underline p-0">
            Edit
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mockSpaces.map((space) => (
            <Badge 
              key={space.id} 
              variant={space.isActive ? "destructive" : "secondary"}
              className="text-xs"
            >
              {space.hashtag}
              {space.count > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                  {space.count}
                </span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* All Members */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-cmo-text-primary">All Members</h3>
          <Button variant="link" className="text-cmo-primary text-sm hover:underline p-0">
            See all
          </Button>
        </div>
        
        <div className="space-y-3">
          {mockUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-cmo-text-primary">{user.name} - 1.27</p>
                <p className="text-xs text-cmo-text-secondary">{user.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendors */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <h3 className="font-semibold text-cmo-text-primary mb-4">487 Vendors</h3>
        
        <div className="space-y-3">
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center space-x-3">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${vendor.color}`}
              >
                <span className="font-semibold text-xs">{vendor.initials}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-cmo-text-primary">{vendor.name}</p>
                <p className="text-xs text-cmo-text-secondary">{vendor.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

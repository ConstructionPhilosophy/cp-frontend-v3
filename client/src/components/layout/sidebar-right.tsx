import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { mockUsers, mockSpaces, mockVendors } from "../../lib/mock-data";
import SuggestedUsers from "../ui/suggested-users";

export default function SidebarRight() {
  return (
    <div className="space-y-4">
      {/* Questions & Answers Stats */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <p className="text-cmo-text-secondary text-xs">
          Questions & Answers (12) • Project & Vendors (3) • Articles &
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={mockUsers[1].avatar} />
            <AvatarFallback>{mockUsers[1].name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm text-cmo-text-primary">
              {mockUsers[1].name}
            </h3>
            <p className="text-cmo-text-secondary text-xs">
              Architect at L&T • Nov 20
            </p>
            <p className="text-xs text-cmo-text-secondary">
              Kochi, Kerala, India
            </p>
          </div>
        </div>

        <h4 className="font-medium text-sm text-cmo-text-primary mb-2">
          Community Contribution
        </h4>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Posts:</span>
            <span className="font-medium">{mockUsers[1].posts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Views:</span>
            <span className="font-medium">{mockUsers[1].views}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Thanks:</span>
            <span className="font-medium">{mockUsers[1].thanks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cmo-text-secondary">Insightful:</span>
            <span className="font-medium">{mockUsers[1].insightful}</span>
          </div>
        </div>
      </div>

      {/* My Spaces */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-cmo-text-primary">
            My Spaces
          </h3>
          <Button
            variant="link"
            className="text-cmo-primary text-xs hover:underline p-0 h-auto"
          >
            Edit
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {mockSpaces.map((space) => (
            <Badge
              key={space.id}
              variant={space.isActive ? "destructive" : "secondary"}
              className="text-xs h-6"
            >
              {space.hashtag}
              {space.count && space.count > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full px-1 py-0.5 text-xs">
                  {space.count}
                </span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Suggested for You */}
      <SuggestedUsers />

      {/* Vendors */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <h3 className="font-medium text-sm text-cmo-text-primary mb-3">
          487 Vendors
        </h3>

        <div className="space-y-2">
          {mockVendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center space-x-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${vendor.color}`}
              >
                <span className="font-medium text-xs">{vendor.initials}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-cmo-text-primary">
                  {vendor.name}
                </p>
                <p className="text-xs text-cmo-text-secondary">
                  {vendor.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

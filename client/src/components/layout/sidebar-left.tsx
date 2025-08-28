import React from "react";
import { Search, Plus, TrendingUp } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Link } from "wouter";

export default function SidebarLeft() {
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-8 pr-4 py-1.5 text-sm border border-cmo-border rounded-lg focus:ring-2 focus:ring-cmo-primary focus:border-transparent"
            />
            <Search className="absolute left-2.5 top-2 h-3 w-3 text-cmo-text-secondary" />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="space-y-1">
          <Button size="sm" className="w-full justify-start bg-cmo-primary text-white hover:bg-cmo-primary/90 h-8 text-xs">
            All (20)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-cmo-text-secondary hover:bg-gray-50 h-8 text-xs">
            My Peers (18)
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-cmo-text-secondary hover:bg-gray-50 h-8 text-xs">
            My Experts
          </Button>
        </div>
      </div>

      {/* My Network Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <h3 className="font-medium text-sm text-cmo-text-primary mb-3">My Network</h3>
        <div className="space-y-2">
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0 h-auto text-xs">
            Share Article
          </Button>
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0 h-auto text-xs">
            Share Experience
          </Button>
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0 h-auto text-xs">
            Ask Question
          </Button>
        </div>
      </div>

      {/* Employer Dashboard Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <h3 className="font-medium text-sm text-cmo-text-primary mb-3">For Employers</h3>
        <div className="space-y-2">
          <Link href="/employer-dashboard">
            <a>
              <Button variant="ghost" className="w-full justify-start py-1.5 h-auto text-xs">
                <TrendingUp className="h-3 w-3 text-cmo-primary mr-2" />
                <span>Employer Dashboard</span>
              </Button>
            </a>
          </Link>
          <Link href="/post-job">
            <a>
              <Button variant="ghost" className="w-full justify-start py-1.5 h-auto text-xs">
                <Plus className="h-3 w-3 text-cmo-primary mr-2" />
                <span>Post a Job</span>
              </Button>
            </a>
          </Link>
        </div>
      </div>

      {/* Build Marketing Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-4">
        <h3 className="font-medium text-sm text-cmo-text-primary mb-3">Build your marketing</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start py-1.5 h-auto text-xs">
            <Plus className="h-3 w-3 text-cmo-primary mr-2" />
            <span>Invite a person</span>
          </Button>
          <div className="flex items-center space-x-2 py-1">
            <Checkbox className="h-3 w-3" />
            <span className="text-cmo-text-secondary text-xs">Fill out your profile</span>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <Checkbox className="h-3 w-3" />
            <span className="text-cmo-text-secondary text-xs">Ask your first question</span>
          </div>
          <div className="flex items-center space-x-2 py-1">
            <Checkbox checked className="h-3 w-3" />
            <span className="text-green-600 text-xs">Answer a question</span>
          </div>
        </div>
      </div>
    </div>
  );
}

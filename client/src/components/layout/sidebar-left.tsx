import React from "react";
import { Search, Plus, TrendingUp } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Link } from "wouter";

export default function SidebarLeft() {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 border border-cmo-border rounded-lg focus:ring-2 focus:ring-cmo-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-cmo-text-secondary" />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="space-y-2">
          <Button className="w-full justify-start bg-cmo-primary text-white hover:bg-cmo-primary/90">
            All (20)
          </Button>
          <Button variant="ghost" className="w-full justify-start text-cmo-text-secondary hover:bg-gray-50">
            My Peers (18)
          </Button>
          <Button variant="ghost" className="w-full justify-start text-cmo-text-secondary hover:bg-gray-50">
            My Experts
          </Button>
        </div>
      </div>

      {/* My Network Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <h3 className="font-semibold text-cmo-text-primary mb-4">My Network</h3>
        <div className="space-y-3">
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0">
            Share Article
          </Button>
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0">
            Share Experience
          </Button>
          <Button variant="link" className="w-full justify-start text-cmo-primary hover:underline p-0">
            Ask Question
          </Button>
        </div>
      </div>

      {/* Employer Dashboard Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <h3 className="font-semibold text-cmo-text-primary mb-4">For Employers</h3>
        <div className="space-y-3">
          <Link href="/employer-dashboard">
            <Button variant="ghost" className="w-full justify-start py-2 h-auto">
              <TrendingUp className="h-4 w-4 text-cmo-primary mr-3" />
              <span>Employer Dashboard</span>
            </Button>
          </Link>
          <Link href="/post-job">
            <Button variant="ghost" className="w-full justify-start py-2 h-auto">
              <Plus className="h-4 w-4 text-cmo-primary mr-3" />
              <span>Post a Job</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Build Marketing Section */}
      <div className="bg-cmo-card rounded-lg border border-cmo-border p-6">
        <h3 className="font-semibold text-cmo-text-primary mb-4">Build your marketing</h3>
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start py-2 h-auto">
            <Plus className="h-4 w-4 text-cmo-primary mr-3" />
            <span>Invite a person</span>
          </Button>
          <div className="flex items-center space-x-3 py-2">
            <Checkbox />
            <span className="text-cmo-text-secondary">Fill out your profile</span>
          </div>
          <div className="flex items-center space-x-3 py-2">
            <Checkbox />
            <span className="text-cmo-text-secondary">Ask your first question</span>
          </div>
          <div className="flex items-center space-x-3 py-2">
            <Checkbox checked />
            <span className="text-green-600">Answer a question</span>
          </div>
        </div>
      </div>
    </div>
  );
}

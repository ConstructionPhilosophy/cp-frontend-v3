import React from "react";
import Header from "../components/layout/header";
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import QuestionCard from "../components/question-card";
import AnswerCard from "../components/answer-card";
import MobileNavigation from "../components/mobile-navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "wouter";
import { Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { mockQuestions, mockUsers } from "../lib/mock-data";
import { useIsMobile } from "../hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-4">
          
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarLeft />
            </div>
          )}

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            {/* Security Dashboard Link */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-gray-900">AI Security Recommendations</h3>
                      <p className="text-xs text-gray-600">Get personalized security insights for your company</p>
                    </div>
                  </div>
                  <Link href="/security">
                    <Button variant="outline" size="sm">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Category Filters */}
            {isMobile && (
              <div className="lg:hidden mb-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  <Button variant="default" size="sm" className="flex-shrink-0 rounded-full bg-cmo-primary text-white">
                    All (20)
                  </Button>
                  <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">
                    My Peers (18)
                  </Button>
                  <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">
                    My Experts
                  </Button>
                  <Button variant="outline" size="sm" className="flex-shrink-0 rounded-full">
                    Modern Marketing (5)
                  </Button>
                </div>
              </div>
            )}

            {/* Question Input */}
            <div className="bg-cmo-card rounded-lg border border-cmo-border p-3 mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Input 
                  placeholder="Ask a question" 
                  className="flex-1 rounded-full bg-gray-50 border-0 focus:ring-2 focus:ring-cmo-primary"
                />
              </div>
            </div>

            {/* Questions and Answers */}
            <div className="space-y-4">
              {mockQuestions.map((question, index) => {
                const author = mockUsers.find(user => user.id === question.authorId);
                if (!author) return null;

                return (
                  <div key={question.id}>
                    <QuestionCard question={question} author={author} />
                    
                    {/* Show answer for first question */}
                    {index === 0 && (
                      <div className="ml-6 mt-4">
                        <AnswerCard 
                          answer={{
                            id: "1",
                            content: "We are a series A B2B startup with a custom solution today. We are using @Mixpanel and working with @Division of Labor to rebuild our pages. @Jennifer Smith, Would love your thoughts as well.",
                            questionId: question.id,
                            authorId: "2",
                            author: mockUsers[1],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            upvotes: 3,
                            downvotes: 0
                          }}
                          author={mockUsers[1]}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarRight />
            </div>
          )}
          
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileNavigation />}
    </div>
  );
}

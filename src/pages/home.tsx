import React from "react";
import Header from "../components/layout/header";
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import QuestionCard from "../components/question-card";
import AnswerCard from "../components/answer-card";
import MobileNavigation from "../components/mobile-navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { mockQuestions, mockUsers } from "../lib/mock-data";
import { useIsMobile } from "../hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarLeft />
            </div>
          )}

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            {/* Mobile Category Filters */}
            {isMobile && (
              <div className="lg:hidden mb-6">
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
            <div className="bg-cmo-card rounded-lg border border-cmo-border p-4 mb-6">
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
            <div className="space-y-6">
              {mockQuestions.map((question, index) => {
                const author = mockUsers.find(user => user.id === question.authorId);
                if (!author) return null;

                return (
                  <div key={question.id}>
                    <QuestionCard question={question} author={author} />
                    
                    {/* Show answer for first question */}
                    {index === 0 && (
                      <div className="ml-8 mt-6">
                        <AnswerCard 
                          answer={{
                            id: "1",
                            content: "We are a series A B2B startup with a custom solution today. We are using @Mixpanel and working with @Division of Labor to rebuild our pages. @Jennifer Smith, Would love your thoughts as well.",
                            questionId: question.id,
                            authorId: "2",
                            createdAt: new Date()
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

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle, X, ThumbsUp, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Question, User } from "../types/schema";

interface QuestionCardProps {
  question: Question;
  author: User;
}

export default function QuestionCard({ question, author }: QuestionCardProps) {
  return (
    <article className="bg-cmo-card rounded-lg border border-cmo-border p-4">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={author.avatar || ""} />
          <AvatarFallback>{author?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-medium text-sm text-cmo-text-primary">{author?.name || 'Unknown User'}</h3>
            <span className="text-cmo-text-secondary text-sm">{author?.title || ''}</span>
            <span className="text-cmo-text-secondary text-sm">
              • {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-cmo-text-secondary text-sm mb-3">
            Asked a question • {question?.category || ''} {question?.tags?.map(tag => `#${tag}`)?.join(' ') || ''}
          </p>
          
          <h2 className="text-sm font-semibold text-cmo-text-primary mb-4">
            {question?.title || 'Untitled Question'}
          </h2>
          
          <p className="text-xs text-cmo-text-primary mb-4">
            {question?.content || 'No content available'}
          </p>
          
          {/* Question illustration */}
          {(question as any).imageUrl && (
            <div className="mb-4">
              <img 
                src={(question as any).imageUrl} 
                alt="Question illustration" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-6 pt-4 border-t border-cmo-border">
            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
              <MessageCircle className="h-4 w-4 mr-2" />
              Answer
            </Button>
            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
              <X className="h-4 w-4 mr-2" />
              Pass
            </Button>
            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Thanks
            </Button>
            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insightful
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

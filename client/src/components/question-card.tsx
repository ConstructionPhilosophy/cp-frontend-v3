import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, ThumbsUp, Lightbulb } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Question, User } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  author: User;
}

export default function QuestionCard({ question, author }: QuestionCardProps) {
  return (
    <article className="bg-cmo-card rounded-lg border border-cmo-border p-6">
      <div className="flex items-start space-x-4">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={author.avatar || ""} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-cmo-text-primary">{author.name}</h3>
            <span className="text-cmo-text-secondary text-sm">{author.title}</span>
            <span className="text-cmo-text-secondary text-sm">
              • {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
          <p className="text-cmo-text-secondary text-sm mb-3">
            Asked a question • {question.category} {question.tags?.map(tag => `#${tag}`).join(' ')}
          </p>
          
          <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">
            {question.title}
          </h2>
          
          <p className="text-cmo-text-primary mb-4">
            {question.content}
          </p>
          
          {/* Question illustration */}
          {question.imageUrl && (
            <div className="mb-4">
              <img 
                src={question.imageUrl} 
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

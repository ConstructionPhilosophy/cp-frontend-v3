import React, { useState } from "react";
import { ThumbsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userTitle?: string;
  userProfilePic?: string;
  content: string;
  likeCount: number;
  createdTime: string;
  isLiked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  commentCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isDetailPage?: boolean;
}

export default function CommentSection({ 
  postId, 
  commentCount, 
  isExpanded, 
  onToggleExpand,
  isDetailPage = false 
}: CommentSectionProps) {
  const { userProfile } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Mock comments data
  const getDummyComments = (): Comment[] => [
    {
      id: "1",
      userId: "user1",
      userName: "Alice Johnson",
      userTitle: "Senior Project Manager",
      userProfilePic: "https://images.unsplash.com/photo-1494790108755-2616b332c88c?w=150&h=150&fit=crop&crop=face",
      content: "This is really exciting! Our team has been looking for solutions like this.",
      likeCount: 5,
      createdTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      userId: "user2",
      userName: "Mark Thompson",
      userTitle: "Construction Engineer",
      userProfilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Great innovation! Would love to see this implemented in our upcoming projects.",
      likeCount: 3,
      createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      userId: "user3",
      userName: "Sarah Davis",
      userTitle: "Architecture Lead",
      userProfilePic: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      content: "The cost savings potential is remarkable. Looking forward to more updates on this.",
      likeCount: 8,
      createdTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];

  React.useEffect(() => {
    if (isExpanded) {
      // Simulate API call
      setTimeout(() => {
        setComments(getDummyComments());
      }, 300);
    }
  }, [isExpanded]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    
    setIsPostingComment(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: "current-user",
        userName: userProfile?.firstName && userProfile?.lastName 
          ? `${userProfile.firstName} ${userProfile.lastName}`
          : "You",
        userTitle: userProfile?.title || userProfile?.positionDesignation,
        userProfilePic: userProfile?.profilePic || userProfile?.photoUrl,
        content: newComment,
        likeCount: 0,
        createdTime: new Date().toISOString()
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      setIsPostingComment(false);
    }, 500);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1
        };
      }
      return comment;
    }));
  };

  if (!isExpanded && !isDetailPage) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
        onClick={onToggleExpand}
        data-testid={`button-comment-${postId}`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.996-7.75c0-4.417 3.582-8 7.996-8s8 3.582 8 7.75z" />
        </svg>
        <span className="text-xs">Comment</span>
      </Button>
    );
  }

  return (
    <div className={`border-t pt-4 ${isDetailPage ? 'h-full' : ''}`}>
      {/* Comment Input */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={userProfile?.profilePic || userProfile?.photoUrl || ""} />
          <AvatarFallback>
            {userProfile?.firstName?.charAt(0) || "U"}
            {userProfile?.lastName?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex space-x-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-sm"
            data-testid={`input-comment-${postId}`}
            onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
          />
          <Button 
            size="sm" 
            onClick={handlePostComment}
            disabled={!newComment.trim() || isPostingComment}
            data-testid={`button-post-comment-${postId}`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className={`space-y-4 ${isDetailPage ? 'overflow-y-auto flex-1' : ''}`}>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-gray-50">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.userProfilePic} />
                    <AvatarFallback className="bg-cmo-primary text-white text-xs">
                      {comment.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sm text-cmo-text-primary">
                        {comment.userName}
                      </h4>
                      <span className="text-xs text-cmo-text-secondary">
                        {formatTimeAgo(comment.createdTime)}
                      </span>
                    </div>
                    
                    {comment.userTitle && (
                      <p className="text-xs text-cmo-text-secondary mb-2">
                        {comment.userTitle}
                      </p>
                    )}
                    
                    <p className="text-sm text-cmo-text-primary mb-3">
                      {comment.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs p-1 h-auto ${
                          comment.isLiked ? 'text-blue-600' : 'text-cmo-text-secondary'
                        }`}
                        onClick={() => handleLikeComment(comment.id)}
                        data-testid={`button-like-comment-${comment.id}`}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        <span>{comment.likeCount}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isDetailPage && (
        <div className="mt-4 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-cmo-text-secondary hover:bg-gray-50"
            onClick={onToggleExpand}
            data-testid={`button-collapse-comments-${postId}`}
          >
            Hide comments
          </Button>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Calendar,
  ArrowLeft,
  MessageCircle,
  Award,
  CheckCircle,
  Flag,
  ArrowUp,
  ArrowDown,
  Reply,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "../components/layout/header";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";
import { forumPosts, forumAnswers, forumUsers, ForumPost, ForumAnswer, ForumReply } from "../lib/forum-data";

export default function ForumDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [answers, setAnswers] = useState<ForumAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const isMobile = useIsMobile();

  const currentUser = forumUsers[5]; // David Kim as current user

  useEffect(() => {
    if (id) {
      fetchPostAndAnswers(id);
    }
  }, [id]);

  const fetchPostAndAnswers = async (postId: string) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const foundPost = forumPosts.find(p => p.id === postId);
      if (foundPost) {
        // Increment view count
        const updatedPost = { ...foundPost, viewsCount: foundPost.viewsCount + 1 };
        setPost(updatedPost);
        
        // Get answers for this post
        const postAnswers = forumAnswers.filter(a => a.postId === postId);
        setAnswers(postAnswers);
      }
      setLoading(false);
    }, 300);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleVotePost = (voteType: 'up' | 'down') => {
    if (!post) return;
    
    setPost(prevPost => {
      if (!prevPost) return null;
      
      if (voteType === 'up') {
        if (prevPost.isUpvoted) {
          return { ...prevPost, upvotes: prevPost.upvotes - 1, isUpvoted: false };
        } else {
          return {
            ...prevPost,
            upvotes: prevPost.upvotes + 1,
            downvotes: prevPost.isDownvoted ? prevPost.downvotes - 1 : prevPost.downvotes,
            isUpvoted: true,
            isDownvoted: false
          };
        }
      } else {
        if (prevPost.isDownvoted) {
          return { ...prevPost, downvotes: prevPost.downvotes - 1, isDownvoted: false };
        } else {
          return {
            ...prevPost,
            downvotes: prevPost.downvotes + 1,
            upvotes: prevPost.isUpvoted ? prevPost.upvotes - 1 : prevPost.upvotes,
            isDownvoted: true,
            isUpvoted: false
          };
        }
      }
    });
  };

  const handleVoteAnswer = (answerId: string, voteType: 'up' | 'down') => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer => {
        if (answer.id === answerId) {
          if (voteType === 'up') {
            if (answer.isUpvoted) {
              return { ...answer, upvotes: answer.upvotes - 1, isUpvoted: false };
            } else {
              return {
                ...answer,
                upvotes: answer.upvotes + 1,
                downvotes: answer.isDownvoted ? answer.downvotes - 1 : answer.downvotes,
                isUpvoted: true,
                isDownvoted: false
              };
            }
          } else {
            if (answer.isDownvoted) {
              return { ...answer, downvotes: answer.downvotes - 1, isDownvoted: false };
            } else {
              return {
                ...answer,
                downvotes: answer.downvotes + 1,
                upvotes: answer.isUpvoted ? answer.upvotes - 1 : answer.upvotes,
                isDownvoted: true,
                isUpvoted: false
              };
            }
          }
        }
        return answer;
      })
    );
  };

  const handleSubmitAnswer = () => {
    if (!newAnswer.trim() || !post) return;

    const answer: ForumAnswer = {
      id: Math.random().toString(36).substr(2, 9),
      content: newAnswer.trim(),
      authorId: currentUser.id,
      author: currentUser,
      postId: post.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isUpvoted: false,
      isDownvoted: false,
      isAccepted: false,
      isHelpful: false,
      replies: []
    };

    setAnswers(prev => [...prev, answer]);
    setPost(prev => prev ? { ...prev, answersCount: prev.answersCount + 1 } : null);
    setNewAnswer("");
  };

  const handleSubmitReply = (answerId: string) => {
    if (!replyContent.trim()) return;

    const reply: ForumReply = {
      id: Math.random().toString(36).substr(2, 9),
      content: replyContent.trim(),
      authorId: currentUser.id,
      author: currentUser,
      answerId: answerId,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      isUpvoted: false
    };

    setAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.id === answerId
          ? { ...answer, replies: [...answer.replies, reply] }
          : answer
      )
    );

    setReplyContent("");
    setReplyingTo(null);
  };

  const handleMarkAsAccepted = (answerId: string) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer => ({
        ...answer,
        isAccepted: answer.id === answerId ? !answer.isAccepted : false
      }))
    );
  };

  const handleMarkAsHelpful = (answerId: string) => {
    setAnswers(prevAnswers =>
      prevAnswers.map(answer =>
        answer.id === answerId
          ? { ...answer, isHelpful: !answer.isHelpful }
          : answer
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmo-primary mx-auto mb-4"></div>
              <p className="text-cmo-text-secondary">Loading question...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-cmo-text-primary mb-4">Question Not Found</h1>
            <Button onClick={() => setLocation("/forum")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/forum")}
            className="mb-4"
            data-testid="button-back-forum"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-12 gap-6'}`}>
          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-1' : 'col-span-8'}`}>
            {/* Question Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm text-cmo-text-primary">
                          {post.author.name}
                        </h3>
                        {post.author.isExpert && (
                          <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                            Expert
                          </Badge>
                        )}
                        {post.isAnswered && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-xs text-cmo-text-secondary">
                        {post.author.title} • {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Question Content */}
                <div className="mb-4">
                  <h1 className="text-lg font-semibold text-cmo-text-primary mb-3">
                    {post.title}
                  </h1>
                  <div className="prose prose-sm max-w-none text-cmo-text-secondary">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  
                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4">
                      <img
                        src={post.images[0]}
                        alt="Question attachment"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.topics.map((topic) => (
                      <Badge
                        key={topic.id}
                        className={`text-xs px-2 py-1 ${topic.color}`}
                      >
                        {topic.name}
                      </Badge>
                    ))}
                  </div>

                  {/* Mentioned Users */}
                  {post.mentionedUsers.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-cmo-text-secondary">Mentioned:</span>
                      {post.mentionedUsers.map((user, index) => (
                        <span key={user.id} className="text-xs text-cmo-primary font-medium">
                          @{user.username}{index < post.mentionedUsers.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Question Stats and Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-xs text-cmo-text-secondary">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.viewsCount} views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {answers.length} answers
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Voting */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-3 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVotePost('up')}
                        className={`h-7 w-7 p-0 ${post.isUpvoted ? 'text-green-600' : 'text-cmo-text-secondary'}`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[24px] text-center">
                        {post.upvotes - post.downvotes}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVotePost('down')}
                        className={`h-7 w-7 p-0 ${post.isDownvoted ? 'text-red-600' : 'text-cmo-text-secondary'}`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Actions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-3 ${post.isSaved ? 'text-cmo-primary' : 'text-cmo-text-secondary'}`}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-cmo-text-secondary"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-cmo-text-primary mb-4">
                  {answers.length} Answer{answers.length !== 1 ? 's' : ''}
                </h2>

                {/* Answers List */}
                <div className="space-y-6">
                  {answers.map((answer) => (
                    <div key={answer.id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      {/* Answer Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={answer.author.avatar} />
                            <AvatarFallback className="text-xs">
                              {answer.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm text-cmo-text-primary">
                                {answer.author.name}
                              </h4>
                              {answer.author.isExpert && (
                                <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                                  Expert
                                </Badge>
                              )}
                              {answer.isAccepted && (
                                <Badge className="text-xs px-2 py-0 h-5 bg-green-100 text-green-800">
                                  ✓ Accepted
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-cmo-text-secondary">
                              {answer.author.title} • {formatTimeAgo(answer.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Answer Content */}
                      <div className="mb-4">
                        <div className="prose prose-sm max-w-none text-cmo-text-secondary">
                          {answer.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-2">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Answer Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Voting */}
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteAnswer(answer.id, 'up')}
                              className={`h-6 w-6 p-0 ${answer.isUpvoted ? 'text-green-600' : 'text-cmo-text-secondary'}`}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <span className="text-xs font-medium min-w-[16px] text-center">
                              {answer.upvotes - answer.downvotes}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoteAnswer(answer.id, 'down')}
                              className={`h-6 w-6 p-0 ${answer.isDownvoted ? 'text-red-600' : 'text-cmo-text-secondary'}`}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Mark as Helpful */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsHelpful(answer.id)}
                            className={`h-7 px-2 text-xs ${answer.isHelpful ? 'text-cmo-primary bg-cmo-primary/10' : 'text-cmo-text-secondary'}`}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            Helpful
                          </Button>

                          {/* Accept Answer (only for question author) */}
                          {post.authorId === currentUser.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsAccepted(answer.id)}
                              className={`h-7 px-2 text-xs ${answer.isAccepted ? 'text-green-600 bg-green-50' : 'text-cmo-text-secondary'}`}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {answer.isAccepted ? 'Accepted' : 'Accept'}
                            </Button>
                          )}

                          {/* Reply */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === answer.id ? null : answer.id)}
                            className="h-7 px-2 text-xs text-cmo-text-secondary"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>

                      {/* Replies */}
                      {answer.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-3">
                          {answer.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {reply.author.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-cmo-text-primary">
                                  {reply.author.name}
                                </span>
                                <span className="text-xs text-cmo-text-secondary">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-cmo-text-secondary">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === answer.id && (
                        <div className="mt-4 ml-6">
                          <Textarea
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={3}
                            className="text-sm"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(answer.id)}
                              disabled={!replyContent.trim()}
                              className="bg-cmo-primary hover:bg-cmo-primary/90 text-xs h-7"
                            >
                              Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                              className="text-xs h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Answer Form */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium text-sm text-cmo-text-primary mb-3">Your Answer</h3>
                  <Textarea
                    placeholder="Share your knowledge and help the community..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={5}
                    className="mb-3"
                    data-testid="textarea-new-answer"
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim()}
                    className="bg-cmo-primary hover:bg-cmo-primary/90"
                    data-testid="button-submit-answer"
                  >
                    Post Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Related Questions */}
          {!isMobile && (
            <div className="col-span-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-cmo-text-primary mb-3">Related Questions</h3>
                  <div className="space-y-3">
                    {forumPosts.filter(p => p.id !== post.id).slice(0, 5).map((relatedPost) => (
                      <div
                        key={relatedPost.id}
                        onClick={() => setLocation(`/forum/${relatedPost.id}`)}
                        className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <h4 className="text-xs font-medium text-cmo-text-primary line-clamp-2 mb-1">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-cmo-text-secondary">
                          <span>{relatedPost.answersCount} answers</span>
                          <span>•</span>
                          <span>{relatedPost.upvotes} upvotes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {isMobile && <MobileNavigation />}
    </div>
  );
}
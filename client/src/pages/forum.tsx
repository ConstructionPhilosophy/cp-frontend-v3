import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Eye,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Users,
  BookmarkIcon,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "../components/layout/header";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";
import { forumPosts, trendingTopics, mostAnsweredUsers, trendingPosts, ForumPost } from "../lib/forum-data";
import CreatePostModal from "@/components/forum/create-post-modal";
import ForumSidebar from "@/components/forum/forum-sidebar";

export default function Forum() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>(forumPosts);
  const isMobile = useIsMobile();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handlePostClick = (postId: string) => {
    setLocation(`/forum/${postId}`);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          if (voteType === 'up') {
            if (post.isUpvoted) {
              return { ...post, upvotes: post.upvotes - 1, isUpvoted: false };
            } else {
              return {
                ...post,
                upvotes: post.upvotes + 1,
                downvotes: post.isDownvoted ? post.downvotes - 1 : post.downvotes,
                isUpvoted: true,
                isDownvoted: false
              };
            }
          } else {
            if (post.isDownvoted) {
              return { ...post, downvotes: post.downvotes - 1, isDownvoted: false };
            } else {
              return {
                ...post,
                downvotes: post.downvotes + 1,
                upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes,
                isDownvoted: true,
                isUpvoted: false
              };
            }
          }
        }
        return post;
      })
    );
  };

  const handleSavePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.topics.some(topic => topic.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === "answered") return matchesSearch && post.isAnswered;
    if (selectedFilter === "unanswered") return matchesSearch && !post.isAnswered;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Forum Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-cmo-text-primary mb-1">Community Forum</h1>
              <p className="text-sm text-cmo-text-secondary">Ask questions, share knowledge, and connect with construction professionals</p>
            </div>
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="bg-cmo-primary hover:bg-cmo-primary/90 text-white"
              data-testid="button-create-post"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cmo-text-secondary w-4 h-4" />
              <Input
                placeholder="Search questions, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-forum-search"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "answered" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("answered")}
                className="text-xs"
              >
                Answered
              </Button>
              <Button
                variant={selectedFilter === "unanswered" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("unanswered")}
                className="text-xs"
              >
                Unanswered
              </Button>
            </div>
          </div>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-12 gap-6'}`}>
          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-1' : 'col-span-8'}`}>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-xs text-cmo-text-primary truncate">
                              {post.author.name}
                            </h3>
                            {post.author.isExpert && (
                              <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                                Expert
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-cmo-text-secondary">
                            {post.author.title} • {formatTimeAgo(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      {post.isAnswered && (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>

                    {/* Post Content */}
                    <div onClick={() => handlePostClick(post.id)} className="mb-3">
                      <h2 className="font-semibold text-sm text-cmo-text-primary mb-2 hover:text-cmo-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-xs text-cmo-text-secondary line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      
                      {/* Post Image */}
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="Post attachment"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.topics.map((topic) => (
                          <Badge
                            key={topic.id}
                            className={`text-xs px-2 py-0 h-5 ${topic.color}`}
                          >
                            {topic.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Mentioned Users */}
                      {post.mentionedUsers.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs text-cmo-text-secondary">Mentioned:</span>
                          {post.mentionedUsers.map((user, index) => (
                            <span key={user.id} className="text-xs text-cmo-primary">
                              @{user.username}{index < post.mentionedUsers.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Stats and Actions */}
                    <div className="flex items-center justify-between text-xs text-cmo-text-secondary">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewsCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.answersCount} answers
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Voting */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-2 py-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(post.id, 'up');
                            }}
                            className={`h-6 w-6 p-0 ${post.isUpvoted ? 'text-green-600' : 'text-cmo-text-secondary'}`}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <span className="text-xs font-medium min-w-[20px] text-center">
                            {post.upvotes - post.downvotes}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(post.id, 'down');
                            }}
                            className={`h-6 w-6 p-0 ${post.isDownvoted ? 'text-red-600' : 'text-cmo-text-secondary'}`}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Actions */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSavePost(post.id);
                          }}
                          className={`h-6 w-6 p-0 ${post.isSaved ? 'text-cmo-primary' : 'text-cmo-text-secondary'}`}
                        >
                          <Bookmark className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-cmo-text-secondary"
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="font-medium text-cmo-text-primary mb-2">No questions found</h3>
                    <p className="text-sm text-cmo-text-secondary mb-4">
                      Try adjusting your search or filters, or be the first to ask a question!
                    </p>
                    <Button onClick={() => setShowCreatePost(true)} className="bg-cmo-primary hover:bg-cmo-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Ask Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          {!isMobile && (
            <div className="col-span-4">
              <ForumSidebar />
            </div>
          )}
        </div>
      </main>

      {isMobile && <MobileNavigation />}

      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        onPostCreated={(newPost: ForumPost) => {
          setPosts(prev => [newPost, ...prev]);
          setShowCreatePost(false);
        }}
      />
    </div>
  );
}
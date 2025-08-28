import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Calendar,
  Plus,
  Eye,
  Flag
} from "lucide-react";
import Header from "../components/layout/header";
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import MobileNavigation from "../components/mobile-navigation";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { useIsMobile } from "../hooks/use-mobile";
import NewsPostModal from "../components/NewsPostModal";
import CommentSection from "../components/CommentSection";

interface Post {
  id: string;
  uid: string;
  headline: string;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  likeCount: number;
  commentCount: number;
  createdTime: string;
  authorName?: string;
  authorTitle?: string;
  authorProfilePic?: string;
}

// Mock posts data
const mockPosts: Post[] = [
  {
    id: "1",
    uid: "user1",
    headline: "Revolutionary Construction Technology Transforms Building Process",
    content: "A groundbreaking new construction method has been unveiled that promises to reduce building time by 40% while maintaining structural integrity. This innovative approach combines advanced materials with AI-powered planning systems.\n\nThe technology has already been successfully implemented in three major projects across different regions, showing consistent results and positive feedback from both contractors and clients.",
    imageUrls: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop"
    ],
    likeCount: 45,
    commentCount: 12,
    createdTime: "2024-01-15T10:30:00Z",
    authorName: "Sarah Chen",
    authorTitle: "Senior Construction Engineer",
    authorProfilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2", 
    uid: "user2",
    headline: "Sustainable Building Materials Gain Momentum in Industry",
    content: "The construction industry is experiencing a shift towards eco-friendly materials. Recent studies show that sustainable options not only reduce environmental impact but also provide long-term cost benefits for developers and property owners.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    likeCount: 32,
    commentCount: 8,
    createdTime: "2024-01-14T14:45:00Z",
    authorName: "Michael Rodriguez",
    authorTitle: "Sustainability Consultant",
    authorProfilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    uid: "user3", 
    headline: "Safety Protocols Updated for High-Rise Construction",
    content: "New safety guidelines have been implemented following comprehensive industry research. These updates address emerging challenges in modern construction while ensuring worker protection remains the top priority.",
    likeCount: 28,
    commentCount: 15,
    createdTime: "2024-01-13T09:15:00Z",
    authorName: "Jennifer Park",
    authorTitle: "Safety Coordinator",
    authorProfilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate API call - replace with actual API integration
    setPosts(mockPosts);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  const handleLikePost = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);

    // Update post like count
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likeCount: likedPosts.has(postId) 
                ? post.likeCount - 1 
                : post.likeCount + 1 
            }
          : post
      )
    );
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const handleToggleComments = (postId: string) => {
    const newExpandedComments = new Set(expandedComments);
    if (expandedComments.has(postId)) {
      newExpandedComments.delete(postId);
    } else {
      newExpandedComments.add(postId);
    }
    setExpandedComments(newExpandedComments);
  };

  const handlePostSubmit = async (postData: { headline: string; content: string; images: File[] }) => {
    // This would typically make an API call to create the post
    console.log("Creating post:", postData);
    
    // For now, add to local state (in real app, refetch from API)
    const newPost: Post = {
      id: Date.now().toString(),
      uid: user?.uid || "current-user",
      headline: postData.headline,
      content: postData.content,
      imageUrls: postData.images.length > 0 ? ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"] : undefined,
      likeCount: 0,
      commentCount: 0,
      createdTime: new Date().toISOString(),
      authorName: user?.displayName || "Current User",
      authorTitle: "Professional",
      authorProfilePic: user?.photoURL || undefined
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsPostModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-cmo-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              {/* Create Post Section */}
              <Card className="bg-cmo-card border-cmo-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="bg-cmo-primary text-white">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-cmo-text-secondary border-cmo-border hover:bg-gray-50"
                      onClick={() => setIsPostModalOpen(true)}
                      data-testid="button-create-post"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Share a post...
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              {posts.map((post) => (
                <Card key={post.id} className="bg-cmo-card border-cmo-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.authorProfilePic} />
                            <AvatarFallback className="bg-cmo-primary text-white">
                              {post.authorName?.split(' ').map(n => n[0]).join('') || 
                               post.uid?.charAt(0)?.toUpperCase() || "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm text-cmo-text-primary">
                              {post.authorName || "Anonymous User"}
                            </h3>
                            {post.authorTitle && (
                              <p className="text-xs text-cmo-text-secondary">
                                {post.authorTitle}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-cmo-text-secondary mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatTimeAgo(post.createdTime)}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Flag className="w-4 h-4 mr-2" />
                              Report Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content - Clickable */}
                      <div 
                        className="mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => handlePostClick(post.id)}
                        data-testid={`post-content-${post.id}`}
                      >
                        <h3 className="font-semibold text-sm text-cmo-text-primary mb-2">
                          {post.headline}
                        </h3>
                        <p className="text-sm text-cmo-text-secondary leading-relaxed">
                          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                        </p>
                      </div>

                      {/* Post Images */}
                      {(post.imageUrls || post.imageUrl) && (
                        <div className="mb-3">
                          {post.imageUrls && post.imageUrls.length > 1 ? (
                            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                              {post.imageUrls.map((imageUrl, index) => (
                                <img
                                  key={index}
                                  src={imageUrl}
                                  alt={`${post.headline} - Image ${index + 1}`}
                                  className={`w-full object-cover ${
                                    post.imageUrls!.length === 2 ? 'h-48' : 'h-32'
                                  }`}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <img
                              src={post.imageUrls?.[0] || post.imageUrl}
                              alt={post.headline}
                              className="w-full h-64 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between text-xs text-cmo-text-secondary mb-3">
                        <div className="flex items-center space-x-4">
                          {post.likeCount > 0 && (
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                <ThumbsUp className="w-2 h-2 text-white fill-current" />
                              </div>
                              <span>{post.likeCount}</span>
                            </div>
                          )}
                        </div>
                        {post.commentCount > 0 && (
                          <span>
                            {post.commentCount} comment{post.commentCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      <Separator className="mb-3" />

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-1 hover:bg-gray-50 py-2 ${
                            likedPosts.has(post.id) ? 'text-blue-600' : 'text-cmo-text-secondary'
                          }`}
                          onClick={() => handleLikePost(post.id)}
                          data-testid={`button-like-${post.id}`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-xs">Like</span>
                        </Button>
                        <CommentSection
                          postId={post.id}
                          commentCount={post.commentCount}
                          isExpanded={expandedComments.has(post.id)}
                          onToggleExpand={() => handleToggleComments(post.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          data-testid={`button-share-${post.id}`}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          <span className="text-xs">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          data-testid={`button-save-${post.id}`}
                        >
                          <Bookmark className="w-4 h-4 mr-1" />
                          <span className="text-xs">Save</span>
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments.has(post.id) && (
                        <div className="mt-4">
                          <CommentSection
                            postId={post.id}
                            commentCount={post.commentCount}
                            isExpanded={true}
                            onToggleExpand={() => handleToggleComments(post.id)}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <SidebarRight />
          </div>
        </div>
      </div>

      {/* Post Modal */}
      <NewsPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostSubmit}
        title="Create Post"
        submitButtonText="Post"
      />
      
      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  ThumbsUp,
  Share2,
  Bookmark,
  Calendar,
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "../components/layout/header";
import CommentSection from "../components/CommentSection";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../contexts/AuthContext";

interface NewsPost {
  id: string;
  uid: string;
  headline: string;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
  likeCount: number;
  commentCount: number;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
  authorName?: string;
  authorProfilePic?: string;
  authorTitle?: string;
}

export default function NewsDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [newsPost, setNewsPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const isMobile = useIsMobile();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (id) {
      fetchNewsPost(id);
    }
  }, [id]);

  const fetchNewsPost = async (postId: string) => {
    try {
      setLoading(true);
      
      // Mock API call - in production, fetch from your API
      const dummyPost: NewsPost = {
        id: postId,
        uid: "user1",
        headline: "Revolutionary Building Material Reduces Construction Time by 50%",
        content: `A new composite material developed by researchers at MIT promises to revolutionize the construction industry. The lightweight yet durable material can be 3D printed on-site, dramatically reducing both construction time and costs.

The breakthrough comes after five years of intensive research into bio-inspired materials that mimic the strength characteristics found in natural structures like spider silk and bamboo. The resulting composite combines recycled carbon fiber with a novel bio-polymer matrix that can be processed at room temperature.

Early trials show structures can be completed in half the traditional time while maintaining superior strength characteristics. The material's unique properties allow for complex geometries that would be impossible with traditional construction methods, opening up new possibilities for architectural design.

Key advantages of this revolutionary material include:

• 50% reduction in construction time
• 30% lower material costs compared to traditional methods
• Enhanced structural integrity and longevity
• Reduced environmental impact through recycled content
• Compatibility with existing 3D printing technologies

The research team has successfully demonstrated the technology by constructing a full-scale prototype building in just 48 hours. The structure underwent rigorous testing, including seismic simulation and extreme weather conditions, performing exceptionally well across all metrics.

Commercial applications are expected to begin within the next 18 months, with several major construction companies already expressing strong interest in pilot projects. The technology could be particularly transformative for emergency housing, affordable construction, and projects in remote locations where traditional building materials are difficult to transport.

This innovation represents a significant step forward in sustainable construction practices, combining efficiency with environmental responsibility. As the construction industry faces increasing pressure to reduce its carbon footprint while meeting growing demand for infrastructure, solutions like this composite material offer a promising path forward.`,
        imageUrls: [
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop",
          "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&h=400&fit=crop"
        ],
        likeCount: 127,
        commentCount: 23,
        createdTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        authorName: "Dr. Sarah Chen",
        authorProfilePic: "https://images.unsplash.com/photo-1494790108755-2616b332c88c?w=150&h=150&fit=crop&crop=face",
        authorTitle: "Materials Engineer at BuildTech Innovation"
      };

      setTimeout(() => {
        setNewsPost(dummyPost);
        setLikeCount(dummyPost.likeCount);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching news post:", error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const handleLikePost = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBack = () => {
    // Determine which page to go back to based on current path
    const currentPath = window.location.pathname;
    if (currentPath.includes('/posts/')) {
      setLocation("/home");
    } else if (currentPath.includes('/articles/')) {
      setLocation("/articles");
    } else {
      setLocation("/news");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cmo-primary mx-auto mb-4"></div>
              <p className="text-cmo-text-secondary">Loading article...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!newsPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-cmo-text-primary mb-4">Content Not Found</h1>
            <Button onClick={handleBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
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
            onClick={handleBack}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-12 gap-6'}`}>
          {/* Main Content - Taking up more space for better alignment */}
          <div className={`${isMobile ? 'col-span-1' : 'col-span-8'}`}>
            <Card>
              <CardContent className="p-4">
                {/* Author Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={newsPost.authorProfilePic} />
                      <AvatarFallback className="bg-cmo-primary text-white">
                        {newsPost.authorName?.split(' ').map(n => n[0]).join('') || 
                         newsPost.uid?.charAt(0)?.toUpperCase() || "N"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm text-cmo-text-primary">
                        {newsPost.authorName || "Author"}
                      </h3>
                      {newsPost.authorTitle && (
                        <p className="text-xs text-cmo-text-secondary">
                          {newsPost.authorTitle}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-cmo-text-secondary mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatTimeAgo(newsPost.createdTime)}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-${newsPost.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-report-${newsPost.id}`}>
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Headline */}
                <h1 className="text-lg font-semibold text-cmo-text-primary mb-4">
                  {newsPost.headline}
                </h1>

                {/* Images */}
                {(newsPost.imageUrls || newsPost.imageUrl) && (
                  <div className="mb-4">
                    {newsPost.imageUrls && newsPost.imageUrls.length > 1 ? (
                      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                        {newsPost.imageUrls.map((imageUrl, index) => (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`${newsPost.headline} - Image ${index + 1}`}
                            className={`w-full object-cover ${
                              newsPost.imageUrls!.length === 2 ? 'h-48' : 'h-32'
                            }`}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={newsPost.imageUrls?.[0] || newsPost.imageUrl}
                        alt={newsPost.headline}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="mb-4">
                  {newsPost.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-sm text-cmo-text-primary mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between text-sm text-cmo-text-secondary mb-3">
                  <div className="flex items-center space-x-4">
                    {likeCount > 0 && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                          <ThumbsUp className="w-2 h-2 text-white fill-current" />
                        </div>
                        <span className="text-xs">{likeCount}</span>
                      </div>
                    )}
                  </div>
                  {newsPost.commentCount > 0 && (
                    <span className="text-xs">
                      {newsPost.commentCount} comment{newsPost.commentCount > 1 ? "s" : ""}
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
                      isLiked ? 'text-blue-600' : 'text-cmo-text-secondary'
                    }`}
                    onClick={handleLikePost}
                    data-testid={`button-like-${newsPost.id}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span className="text-xs">Like</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                    data-testid={`button-share-${newsPost.id}`}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    <span className="text-xs">Share</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                    data-testid={`button-save-${newsPost.id}`}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    <span className="text-xs">Save</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Comments */}
          <div className={`${isMobile ? 'col-span-1' : 'col-span-4'}`}>
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <h2 className="text-sm font-semibold text-cmo-text-primary mb-4">
                  Comments ({newsPost.commentCount})
                </h2>
                
                <div className="flex-1 overflow-hidden">
                  <CommentSection
                    postId={newsPost.id}
                    commentCount={newsPost.commentCount}
                    isExpanded={true}
                    onToggleExpand={() => {}}
                    isDetailPage={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
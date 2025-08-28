import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Calendar,
  User,
  Bookmark,
  Edit,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import MobileNavigation from "../components/mobile-navigation";
import NewsPostModal from "../components/NewsPostModal";
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

const NewsPage = () => {
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useIsMobile();
  const { user, userProfile } = useAuth();

  // Fetch news posts from API
  useEffect(() => {
    if (user) {
      fetchNewsPosts();
    }
  }, [user]);

  const fetchNewsPosts = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Try to fetch from API, but fall back to dummy data
      try {
        const response = await fetch(`${apiBaseUrl}/news`, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }

        const newsData = await response.json();
        setNewsPosts(Array.isArray(newsData) ? newsData : getDummyNews());
      } catch (apiError) {
        console.error("API unavailable, using dummy data:", apiError);
        setNewsPosts(getDummyNews());
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsPosts(getDummyNews());
    } finally {
      setLoading(false);
    }
  };

  const getDummyNews = (): NewsPost[] => [
    {
      id: "1",
      uid: "user1",
      headline: "Revolutionary Building Material Reduces Construction Time by 50%",
      content: "A new composite material developed by researchers at MIT promises to revolutionize the construction industry. The lightweight yet durable material can be 3D printed on-site, dramatically reducing both construction time and costs. Early trials show structures can be completed in half the traditional time while maintaining superior strength characteristics.",
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
    },
    {
      id: "2", 
      uid: "user2",
      headline: "Sustainable Architecture Wins Major Industry Award",
      content: "The Green Tower project in downtown Seattle has won the International Sustainable Architecture Award for 2024. The 40-story building features innovative solar panels integrated into its facade, rainwater harvesting systems, and uses 60% recycled materials. This project sets a new standard for eco-friendly high-rise construction.",
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop",
      likeCount: 89,
      commentCount: 15,
      createdTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      authorName: "Michael Rodriguez",
      authorProfilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      authorTitle: "Senior Architect at GreenSpace Design"
    },
    {
      id: "3",
      uid: "user3", 
      headline: "AI-Powered Construction Safety System Reduces Accidents by 40%",
      content: "A groundbreaking AI system that monitors construction sites in real-time has shown remarkable results in improving worker safety. Using computer vision and machine learning, the system can detect potential hazards before they occur and immediately alert workers and supervisors. Beta testing across 50 construction sites showed a 40% reduction in workplace accidents.",
      imageUrls: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop"
      ],
      likeCount: 203,
      commentCount: 34,
      createdTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      authorName: "Jennifer Kim",
      authorProfilePic: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      authorTitle: "Safety Technology Lead at ConstrTech AI"
    },
    {
      id: "4",
      uid: "user4",
      headline: "New Building Code Updates Focus on Climate Resilience",
      content: "Cities across the nation are updating their building codes to address climate change challenges. The new regulations require structures to withstand more extreme weather events and include provisions for better insulation, flood resistance, and heat management. These changes will significantly impact how buildings are designed and constructed moving forward.",
      likeCount: 156,
      commentCount: 28,
      createdTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      authorName: "David Thompson",
      authorProfilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      authorTitle: "City Planning Commissioner"
    }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return diffMinutes === 0 ? "now" : `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const token = await user?.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      await fetch(`${apiBaseUrl}/news/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state optimistically
      setNewsPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount + 1 }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cmo-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarLeft />
            </div>
          )}

          {/* Main Content */}
          <div className={`${isMobile ? "col-span-1" : "lg:col-span-6"}`}>
            {/* Simple Post Trigger - LinkedIn Style */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userProfile?.profilePic || userProfile?.photoUrl || user?.photoURL || ""} />
                    <AvatarFallback>
                      {userProfile?.firstName?.charAt(0) || user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      {userProfile?.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Post a news..."
                      className="cursor-pointer bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors rounded-full"
                      readOnly
                      onClick={() => setIsModalOpen(true)}
                      data-testid="input-post-news-trigger"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* News Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-cmo-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-cmo-text-secondary">Loading news...</p>
                </div>
              ) : newsPosts.length > 0 ? (
                newsPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.authorProfilePic} />
                            <AvatarFallback className="bg-cmo-primary text-white">
                              {post.authorName?.split(' ').map(n => n[0]).join('') || 
                               post.uid?.charAt(0)?.toUpperCase() || "N"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-cmo-text-primary">
                              {post.authorName || "News Reporter"}
                            </p>
                            {post.authorTitle && (
                              <p className="text-xs text-cmo-text-secondary">
                                {post.authorTitle}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-cmo-text-secondary">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatTimeAgo(post.createdTime)}
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
                            <DropdownMenuItem data-testid={`button-edit-${post.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`button-report-${post.id}`}>
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-sm text-cmo-text-primary mb-2">
                          {post.headline}
                        </h3>
                        <p className="text-sm text-cmo-text-secondary leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Images - Multi-image support */}
                      {(post.imageUrls || post.imageUrl) && (
                        <div className="mb-3">
                          {post.imageUrls && post.imageUrls.length > 1 ? (
                            <div className="relative">
                              {post.imageUrls.length === 2 ? (
                                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                                  {post.imageUrls.map((imageUrl, index) => (
                                    <img
                                      key={index}
                                      src={imageUrl}
                                      alt={`${post.headline} - Image ${index + 1}`}
                                      className="w-full h-48 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ))}
                                </div>
                              ) : post.imageUrls.length === 3 ? (
                                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                                  <img
                                    src={post.imageUrls[0]}
                                    alt={`${post.headline} - Image 1`}
                                    className="w-full h-64 object-cover row-span-2"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div className="grid grid-rows-2 gap-1">
                                    {post.imageUrls.slice(1).map((imageUrl, index) => (
                                      <img
                                        key={index + 1}
                                        src={imageUrl}
                                        alt={`${post.headline} - Image ${index + 2}`}
                                        className="w-full h-[calc(8rem-2px)] object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                                  <img
                                    src={post.imageUrls[0]}
                                    alt={`${post.headline} - Image 1`}
                                    className="w-full h-64 object-cover row-span-2"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div className="grid grid-rows-2 gap-1">
                                    <img
                                      src={post.imageUrls[1]}
                                      alt={`${post.headline} - Image 2`}
                                      className="w-full h-[calc(8rem-2px)] object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                    <div className="relative">
                                      <img
                                        src={post.imageUrls[2]}
                                        alt={`${post.headline} - Image 3`}
                                        className="w-full h-[calc(8rem-2px)] object-cover"
                                        onError={(e) => {
                                          e.currentTarget.style.display = "none";
                                        }}
                                      />
                                      {post.imageUrls.length > 3 && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                          <span className="text-white text-lg font-semibold">
                                            +{post.imageUrls.length - 3}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
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
                      <div className="flex items-center justify-between text-sm text-cmo-text-secondary mb-3">
                        <div className="flex items-center space-x-4">
                          {post.likeCount > 0 && (
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                <ThumbsUp className="w-2 h-2 text-white fill-current" />
                              </div>
                              <span className="text-xs">{post.likeCount}</span>
                            </div>
                          )}
                        </div>
                        {post.commentCount > 0 && (
                          <span className="text-xs">
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
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          onClick={() => handleLikePost(post.id)}
                          data-testid={`button-like-${post.id}`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-xs">Like</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          data-testid={`button-comment-${post.id}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs">Comment</span>
                        </Button>
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-cmo-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-cmo-text-primary mb-2">
                      No News Posts Yet
                    </h3>
                    <p className="text-cmo-text-secondary">
                      Be the first to share news with the community!
                    </p>
                  </CardContent>
                </Card>
              )}
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

      {/* Mobile Navigation */}
      {isMobile && <MobileNavigation />}

      {/* News Post Modal */}
      <NewsPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchNewsPosts}
      />
    </div>
  );
};

export default NewsPage;
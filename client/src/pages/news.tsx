import React, { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Image,
  Calendar,
  User,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "../components/layout/header";
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";

interface NewsItem {
  id: string;
  uid: string;
  headline: string;
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
    title?: string;
  };
}

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState("");
  const [postHeadline, setPostHeadline] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch news from API
  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
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

      const response = await fetch(`${apiBaseUrl}/news`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const newsData = await response.json();
      
      // Add mock user profiles for display (in real app, this would come from API)
      const newsWithProfiles = newsData.map((item: NewsItem) => ({
        ...item,
        userProfile: {
          name: `User ${item.uid}`,
          avatar: "",
          title: "Construction Professional",
        },
      }));

      setNewsItems(newsWithProfiles);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Show empty state if API fails
      setNewsItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNews = async () => {
    if (!postHeadline.trim() || !postContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please add both headline and content for your news post",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post news",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPosting(true);
      const token = await user.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      const response = await fetch(`${apiBaseUrl}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          headline: postHeadline,
          content: postContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post news: ${response.status}`);
      }

      toast({
        title: "News Posted!",
        description: "Your news has been shared successfully",
      });

      // Clear form and refresh news
      setPostHeadline("");
      setPostContent("");
      await fetchNews();
    } catch (error) {
      console.error("Error posting news:", error);
      toast({
        title: "Post Failed",
        description: "Failed to post news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (newsId: string) => {
    try {
      const token = await user?.getIdToken();
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://cp-backend-service-test-972540571952.asia-south1.run.app";

      const response = await fetch(`${apiBaseUrl}/news/${newsId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Optimistically update UI
        setNewsItems(prev =>
          prev.map(item =>
            item.id === newsId
              ? { ...item, likeCount: item.likeCount + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error liking news:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-cmo-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="hidden lg:block lg:col-span-3">
              <SidebarLeft />
            </div>
          )}

          {/* Main Content */}
          <div className={isMobile ? "col-span-12" : "lg:col-span-6"}>
            {/* Post Creation Section */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Add a headline for your news..."
                        value={postHeadline}
                        onChange={(e) => setPostHeadline(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPosting}
                        data-testid="input-news-headline"
                      />
                    </div>
                    <Textarea
                      placeholder="Share what's happening in construction and infrastructure..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[100px] resize-none border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isPosting}
                      data-testid="textarea-news-content"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-800"
                          disabled={isPosting}
                          data-testid="button-add-image"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                      </div>
                      <Button
                        onClick={handlePostNews}
                        disabled={isPosting || !postHeadline.trim() || !postContent.trim()}
                        size="sm"
                        data-testid="button-post-news"
                      >
                        {isPosting ? "Posting..." : "Post"}
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
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
              ) : newsItems.length > 0 ? (
                newsItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={item.userProfile?.avatar || ""} />
                            <AvatarFallback>
                              <User className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm text-cmo-text-primary">
                              {item.userProfile?.name || `User ${item.uid}`}
                            </h4>
                            <p className="text-xs text-cmo-text-secondary">
                              {item.userProfile?.title || "Construction Professional"}
                            </p>
                            <div className="flex items-center text-xs text-cmo-text-secondary mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatTimeAgo(item.createdTime)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          data-testid={`button-more-${item.id}`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-cmo-text-primary mb-2 text-sm">
                          {item.headline}
                        </h3>
                        <p className="text-sm text-cmo-text-secondary leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      {/* Post Image */}
                      {item.imageUrl && (
                        <div className="mb-4">
                          <img
                            src={item.imageUrl}
                            alt={item.headline}
                            className="w-full rounded-lg object-cover max-h-64"
                            data-testid={`image-${item.id}`}
                          />
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between text-xs text-cmo-text-secondary mb-3 py-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {item.likeCount} likes
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {item.commentCount} comments
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(item.id)}
                          className="flex-1 text-cmo-text-secondary hover:text-blue-600 hover:bg-blue-50"
                          data-testid={`button-like-${item.id}`}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Like
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-cmo-text-secondary hover:text-green-600 hover:bg-green-50"
                          data-testid={`button-comment-${item.id}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Comment
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-cmo-text-secondary hover:text-purple-600 hover:bg-purple-50"
                          data-testid={`button-share-${item.id}`}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-cmo-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-cmo-text-primary mb-2">
                      No News Yet
                    </h3>
                    <p className="text-cmo-text-secondary">
                      Be the first to share construction industry news!
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
    </div>
  );
};

export default NewsPage;
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
import SidebarLeft from "../components/layout/sidebar-left";
import SidebarRight from "../components/layout/sidebar-right";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import NewsPostModal from "../components/NewsPostModal";
import CommentSection from "../components/CommentSection";

interface Article {
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

// Mock articles data
const mockArticles: Article[] = [
  {
    id: "1",
    uid: "user1",
    headline: "The Future of Sustainable Construction: Green Building Practices",
    content: "As the construction industry evolves, sustainable practices are becoming not just a trend but a necessity. This comprehensive guide explores the latest green building techniques, materials, and certifications that are reshaping how we approach construction projects.\n\nFrom energy-efficient designs to eco-friendly materials, sustainable construction is proving to be both environmentally responsible and economically viable for long-term project success.",
    imageUrls: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
    ],
    likeCount: 87,
    commentCount: 23,
    createdTime: "2024-01-15T08:00:00Z",
    authorName: "Dr. Emily Watson",
    authorTitle: "Sustainability Expert & Author",
    authorProfilePic: "https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2", 
    uid: "user2",
    headline: "Digital Transformation in Construction: BIM and Beyond",
    content: "Building Information Modeling (BIM) has revolutionized how construction projects are planned, designed, and executed. This article delves into the latest digital tools and technologies that are streamlining construction processes and improving project outcomes across the industry.",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    likeCount: 64,
    commentCount: 18,
    createdTime: "2024-01-14T12:30:00Z",
    authorName: "James Mitchell",
    authorTitle: "Construction Technology Consultant",
    authorProfilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    uid: "user3", 
    headline: "Modern Project Management: Agile Methodologies in Construction",
    content: "Traditional project management approaches are being enhanced with agile methodologies adapted for construction. Learn how these flexible frameworks are improving project delivery times, stakeholder communication, and overall project success rates in the construction industry.",
    likeCount: 52,
    commentCount: 31,
    createdTime: "2024-01-13T16:45:00Z",
    authorName: "Maria Garcia",
    authorTitle: "Senior Project Manager",
    authorProfilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Simulate API call - replace with actual API integration
    setArticles(mockArticles);
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

  const handleLikeArticle = (articleId: string) => {
    const newLikedArticles = new Set(likedArticles);
    if (likedArticles.has(articleId)) {
      newLikedArticles.delete(articleId);
    } else {
      newLikedArticles.add(articleId);
    }
    setLikedArticles(newLikedArticles);

    // Update article like count
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              likeCount: likedArticles.has(articleId) 
                ? article.likeCount - 1 
                : article.likeCount + 1 
            }
          : article
      )
    );
  };

  const handleArticleClick = (articleId: string) => {
    navigate(`/articles/${articleId}`);
  };

  const handleToggleComments = (articleId: string) => {
    const newExpandedComments = new Set(expandedComments);
    if (expandedComments.has(articleId)) {
      newExpandedComments.delete(articleId);
    } else {
      newExpandedComments.add(articleId);
    }
    setExpandedComments(newExpandedComments);
  };

  const handleArticleSubmit = async (articleData: { headline: string; content: string; images: File[] }) => {
    // This would typically make an API call to create the article
    console.log("Creating article:", articleData);
    
    // For now, add to local state (in real app, refetch from API)
    const newArticle: Article = {
      id: Date.now().toString(),
      uid: user?.uid || "current-user",
      headline: articleData.headline,
      content: articleData.content,
      imageUrls: articleData.images.length > 0 ? ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop"] : undefined,
      likeCount: 0,
      commentCount: 0,
      createdTime: new Date().toISOString(),
      authorName: user?.displayName || "Current User",
      authorTitle: "Professional",
      authorProfilePic: user?.photoURL || undefined
    };
    
    setArticles(prevArticles => [newArticle, ...prevArticles]);
    setIsArticleModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-cmo-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <SidebarLeft />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="space-y-4">
              {/* Create Article Section */}
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
                      onClick={() => setIsArticleModalOpen(true)}
                      data-testid="button-create-article"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Write an article...
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Articles Feed */}
              {articles.map((article) => (
                <Card key={article.id} className="bg-cmo-card border-cmo-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Article Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={article.authorProfilePic} />
                            <AvatarFallback className="bg-cmo-primary text-white">
                              {article.authorName?.split(' ').map(n => n[0]).join('') || 
                               article.uid?.charAt(0)?.toUpperCase() || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm text-cmo-text-primary">
                              {article.authorName || "Anonymous Author"}
                            </h3>
                            {article.authorTitle && (
                              <p className="text-xs text-cmo-text-secondary">
                                {article.authorTitle}
                              </p>
                            )}
                            <div className="flex items-center text-xs text-cmo-text-secondary mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatTimeAgo(article.createdTime)}
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
                              Report Article
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Article Content - Clickable */}
                      <div 
                        className="mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                        onClick={() => handleArticleClick(article.id)}
                        data-testid={`article-content-${article.id}`}
                      >
                        <h3 className="font-semibold text-sm text-cmo-text-primary mb-2">
                          {article.headline}
                        </h3>
                        <p className="text-sm text-cmo-text-secondary leading-relaxed">
                          {article.content.length > 200 ? `${article.content.substring(0, 200)}...` : article.content}
                        </p>
                      </div>

                      {/* Article Images */}
                      {(article.imageUrls || article.imageUrl) && (
                        <div className="mb-3">
                          {article.imageUrls && article.imageUrls.length > 1 ? (
                            <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                              {article.imageUrls.map((imageUrl, index) => (
                                <img
                                  key={index}
                                  src={imageUrl}
                                  alt={`${article.headline} - Image ${index + 1}`}
                                  className={`w-full object-cover ${
                                    article.imageUrls!.length === 2 ? 'h-48' : 'h-32'
                                  }`}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <img
                              src={article.imageUrls?.[0] || article.imageUrl}
                              alt={article.headline}
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
                          {article.likeCount > 0 && (
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                <ThumbsUp className="w-2 h-2 text-white fill-current" />
                              </div>
                              <span>{article.likeCount}</span>
                            </div>
                          )}
                        </div>
                        {article.commentCount > 0 && (
                          <span>
                            {article.commentCount} comment{article.commentCount > 1 ? "s" : ""}
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
                            likedArticles.has(article.id) ? 'text-blue-600' : 'text-cmo-text-secondary'
                          }`}
                          onClick={() => handleLikeArticle(article.id)}
                          data-testid={`button-like-${article.id}`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span className="text-xs">Like</span>
                        </Button>
                        <CommentSection
                          postId={article.id}
                          commentCount={article.commentCount}
                          isExpanded={expandedComments.has(article.id)}
                          onToggleExpand={() => handleToggleComments(article.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          data-testid={`button-share-${article.id}`}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          <span className="text-xs">Share</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 text-cmo-text-secondary py-2"
                          data-testid={`button-save-${article.id}`}
                        >
                          <Bookmark className="w-4 h-4 mr-1" />
                          <span className="text-xs">Save</span>
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments.has(article.id) && (
                        <div className="mt-4">
                          <CommentSection
                            postId={article.id}
                            commentCount={article.commentCount}
                            isExpanded={true}
                            onToggleExpand={() => handleToggleComments(article.id)}
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

      {/* Article Modal */}
      <NewsPostModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSubmit={handleArticleSubmit}
        title="Write Article"
        submitButtonText="Publish"
      />
    </div>
  );
}
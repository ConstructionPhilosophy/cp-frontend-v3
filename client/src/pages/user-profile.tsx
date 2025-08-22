import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import Header from '../components/layout/header';
import MobileNavigation from '../components/mobile-navigation';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../contexts/AuthContext';
import { userApiService, UserProfile } from '../lib/userApi';
import { useCreateConversation } from '../hooks/useChat';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Star, 
  Plus, 
  MoreHorizontal,
  Filter,
  ChevronDown,
  Bookmark,
  Share,
  Edit,
  Flag,
  Send,
  Calendar,
  GraduationCap,
  Briefcase,
  User,
  FileText
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const mockEducation = [
  {
    id: "edu1",
    degree: "MBA",
    fieldOfStudy: "Marketing & Business Strategy",
    schoolOrCollege: "Oxford International",
    startDate: "2008-09-01",
    endDate: "2010-06-30",
    grade: "Distinction"
  },
  {
    id: "edu2",
    degree: "B.A.",
    fieldOfStudy: "Business Administration",
    schoolOrCollege: "Stanford University",
    startDate: "2003-09-01",
    endDate: "2007-05-31",
    grade: "Magna Cum Laude"
  }
];

const mockExperience = [
  {
    id: "exp1",
    company: "SingleFire",
    role: "Chief Marketing Officer",
    location: "Virginia, NY",
    startDate: "2020-01-01",
    endDate: null,
    description: "Leading global marketing strategy and brand management for digital transformation initiatives."
  },
  {
    id: "exp2", 
    company: "Blue Chip CPG",
    role: "Senior Brand Manager",
    location: "New York, NY",
    startDate: "2015-03-01",
    endDate: "2019-12-31",
    description: "Managed multi-million dollar brand portfolios and launched successful product campaigns."
  }
];

const mockActivities = [
  {
    id: "1",
    type: "question",
    title: "Do you have any experience with deploying @Hubspot for a SaaS business with both a direct and self-serve model?",
    content: "We have a $2M ARR B2B startup with a custom solution today. We are using @Mixpanel and working with @Division of Labor to rebuild our pages. @Jennifer Smith... See more",
    timestamp: "Nov 19",
    category: "Questions & Answers",
    engagement: { comments: 1, thanks: 5, insightful: 2 }
  },
  {
    id: "2",
    type: "article",
    title: "Looking for a new landing page optimization vendor",
    content: "We are looking for a landing page tool that they are missing a minimal with a custom solution that no... See more",
    timestamp: "Nov 12",
    category: "#Inbound #SaaS",
    engagement: { comments: 1, thanks: 15, insightful: 6 }
  }
];

export default function UserProfilePage() {
  const [match, params] = useRoute('/u/:username');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();
  const { createConversation } = useCreateConversation();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const username = params?.username;
  const filters = ['All', 'News', 'Posts', 'Articles', 'Videos', 'Jobs'];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Try using username directly with /users/{uid} endpoint
        // In case the backend accepts username as uid parameter
        const userData = await userApiService.getUserByUid(username);
        setProfileData(userData);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.message === 'USER_NOT_FOUND') {
          setError('User not found');
        } else if (error.message === 'AUTH_EXPIRED') {
          setError('Authentication expired');
        } else {
          setError('Failed to load user profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleSendMessage = async () => {
    if (!profileData || !user) return;
    
    try {
      const conversationId = await createConversation(profileData.uid);
      setLocation(`/chat/${conversationId}`);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      
      // Handle Firebase permission errors more gracefully
      if (error.message?.includes('permissions') || error.message?.includes('PERMISSION_DENIED')) {
        toast({
          title: "Chat feature not available",
          description: "Chat functionality is being set up. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to start conversation",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handleSubmitComment = (postId: string) => {
    console.log(`Comment for post ${postId}:`, commentText[postId]);
    setCommentText(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  if (!match || !username) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-cmo-text-secondary">Invalid profile URL</p>
          </div>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cmo-primary" />
          </div>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-cmo-text-secondary text-lg mb-2">{error || 'User not found'}</p>
            <Button variant="outline" onClick={() => setLocation('/')}>
              Go Home
            </Button>
          </div>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  const isOwnProfile = user?.uid === profileData.uid;

  return (
    <div className="min-h-screen bg-cmo-bg">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Banner and Profile Section */}
            <Card className="mb-6 overflow-hidden">
              <div 
                className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  backgroundImage: profileData.bannerUrl ? `url(${profileData.bannerUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <CardContent className="relative p-6">
                {/* Profile Info Section */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 -mt-20 border-4 border-white shadow-lg">
                      <AvatarImage src={profileData.photoUrl || profileData.profilePic || ""} />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName?.charAt(0) || 'U'}{profileData.lastName?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-cmo-text-primary truncate">
                          {profileData.firstName || ''} {profileData.lastName || ''}
                        </h1>
                        <p className="text-lg text-cmo-text-secondary mb-3">
                          {profileData.title || profileData.positionDesignation || 'Professional'}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-cmo-text-secondary">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {profileData.email}
                          </span>
                          {profileData.phoneNumber && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {profileData.phoneNumber}
                            </span>
                          )}
                          {profileData.city && profileData.country && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {profileData.city}, {typeof profileData.country === 'string' ? profileData.country : profileData.country.name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {!isOwnProfile && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSendMessage}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button className="bg-cmo-primary hover:bg-cmo-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Follow
                          </Button>
                          
                          {/* Three Dots Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Flag className="mr-2 h-4 w-4" />
                                <span>Report</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {profileData.positionDesignation && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-cmo-text-secondary leading-relaxed">
                      {profileData.positionDesignation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-cmo-primary" />
                    Education
                  </h3>
                </div>
                <div className="space-y-6">
                  {mockEducation.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        <p className="text-cmo-primary font-medium">{edu.fieldOfStudy}</p>
                        <p className="text-cmo-text-secondary">{edu.schoolOrCollege}</p>
                        <p className="text-sm text-cmo-text-secondary mt-1">
                          {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                          {edu.grade && ` • ${edu.grade}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-cmo-primary" />
                    Experience
                  </h3>
                </div>
                <div className="space-y-6">
                  {mockExperience.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{exp.role}</h4>
                        <p className="text-cmo-primary font-medium">{exp.company}</p>
                        <p className="text-cmo-text-secondary flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </p>
                        <p className="text-sm text-cmo-text-secondary mt-1">
                          {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                        </p>
                        <p className="text-cmo-text-secondary mt-2">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activities */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Activities</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Activity Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={activeFilter === filter ? "bg-cmo-primary" : ""}
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="border-b border-cmo-border pb-6 last:border-b-0">
                      <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profileData.photoUrl || profileData.profilePic || ""} />
                          <AvatarFallback>
                            {profileData.firstName?.charAt(0) || 'U'}{profileData.lastName?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-cmo-text-primary">{activity.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-cmo-text-secondary mt-1">
                                <span>{profileData.firstName || ''} {profileData.lastName || ''}</span>
                                <span>•</span>
                                <span>{activity.timestamp}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {activity.category}
                                </Badge>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Flag className="mr-2 h-4 w-4" />
                                  <span>Report</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-cmo-text-secondary mt-3">{activity.content}</p>
                          
                          {/* Engagement Actions */}
                          <div className="flex items-center gap-6 mt-4">
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Thanks {activity.engagement.thanks}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                              onClick={() => toggleComments(activity.id)}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {activity.engagement.comments} comments
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <Star className="w-4 h-4 mr-1" />
                              Insightful {activity.engagement.insightful}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>

                          {/* Comments Section */}
                          {expandedComments[activity.id] && (
                            <div className="mt-4 pt-4 border-t border-cmo-border">
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={userProfile?.profilePic || ""} />
                                  <AvatarFallback>
                                    {userProfile?.firstName?.charAt(0) || 'U'}{userProfile?.lastName?.charAt(0) || ''}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="Write a comment..."
                                    value={commentText[activity.id] || ''}
                                    onChange={(e) => handleCommentChange(activity.id, e.target.value)}
                                    className="min-h-[80px] resize-none"
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="outline" size="sm" onClick={() => toggleComments(activity.id)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSubmitComment(activity.id)}
                                      disabled={!commentText[activity.id]?.trim()}
                                    >
                                      <Send className="w-4 h-4 mr-1" />
                                      Comment
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-cmo-text-secondary">Posts:</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cmo-text-secondary">Views:</span>
                    <span className="font-semibold">1.2k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cmo-text-secondary">Thanks:</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cmo-text-secondary">Followers:</span>
                    <span className="font-semibold">500+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-cmo-text-secondary" />
                    <span>{profileData.email}</span>
                  </div>
                  {profileData.phoneNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-cmo-text-secondary" />
                      <span>{profileData.phoneNumber}</span>
                    </div>
                  )}
                  {profileData.city && profileData.country && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cmo-text-secondary" />
                      <span>
                        {profileData.city}, {typeof profileData.country === 'string' ? profileData.country : profileData.country.name}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {isMobile && <MobileNavigation />}
    </div>
  );
}
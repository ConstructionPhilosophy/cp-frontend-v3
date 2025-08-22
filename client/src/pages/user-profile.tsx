import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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
  }
];

const mockActivities = [
  {
    id: "1",
    type: "question",
    title: "Looking for advice on digital marketing strategies for SaaS companies",
    content: "We have a $2M ARR B2B startup and looking to scale our marketing efforts. Any recommendations?",
    timestamp: "Nov 19",
    category: "Questions & Answers",
    engagement: { comments: 1, thanks: 5, insightful: 2 }
  }
];

export default function UserProfilePage() {
  const [match, params] = useRoute('/u/:username');
  const [activeFilter, setActiveFilter] = useState('All');
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
        const userData = await userApiService.getUserByUsername(username);
        setProfileData(userData);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error.message === 'USER_NOT_FOUND') {
          setError('User not found');
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
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to start conversation",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!match || !username) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-cmo-text-secondary">Invalid profile URL</p>
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-cmo-primary" />
        </div>
        {isMobile && <MobileNavigation />}
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-cmo-bg-main">
        <Header />
        <div className="flex items-center justify-center h-96">
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
    <div className="min-h-screen bg-cmo-bg-main">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Profile Header */}
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Banner */}
                <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative">
                  {profileData.bannerPic && (
                    <img 
                      src={profileData.bannerPic} 
                      alt="Banner" 
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
                    <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={profileData.profilePic || ""} />
                        <AvatarFallback className="text-2xl">
                          {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-cmo-text-primary">
                          {profileData.firstName} {profileData.lastName}
                        </h1>
                        {profileData.username && (
                          <p className="text-cmo-text-secondary">@{profileData.username}</p>
                        )}
                        {profileData.title && (
                          <p className="text-lg text-cmo-text-secondary mt-1">{profileData.title}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-cmo-text-secondary">
                          {profileData.city && profileData.country && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{profileData.city}, {profileData.country}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>500+ connections</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!isOwnProfile && (
                      <div className="flex items-center gap-3 flex-shrink-0 mt-4 sm:mt-0">
                        <Button variant="outline" size="sm" onClick={handleSendMessage}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button className="bg-cmo-primary hover:bg-cmo-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Bio */}
                  <div className="mt-6">
                    <p className="text-cmo-text-primary">
                      {profileData.positionDesignation || "Passionate professional in the construction and civil engineering industry."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-cmo-text-primary">Activity</h2>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          {activeFilter}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {filters.map((filter) => (
                          <DropdownMenuItem 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                          >
                            {filter}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-cmo-text-secondary mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-cmo-text-primary mb-2">No activity yet</h3>
                      <p className="text-cmo-text-secondary">
                        {profileData.firstName} hasn't shared any posts or activities recently.
                      </p>
                    </div>
                  ) : (
                    mockActivities.map((activity) => (
                      <div key={activity.id} className="border-b border-cmo-border pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {activity.category}
                            </Badge>
                            <span className="text-sm text-cmo-text-secondary">{activity.timestamp}</span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save post
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="w-4 h-4 mr-2" />
                                Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <h3 className="font-semibold text-cmo-text-primary mb-2">
                          {activity.title}
                        </h3>
                        
                        <p className="text-cmo-text-secondary mb-4">
                          {activity.content}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-cmo-text-secondary">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Thanks {activity.engagement.thanks}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {activity.engagement.comments} comments
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Star className="w-4 h-4 mr-1" />
                            Insightful {activity.engagement.insightful}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 mt-6 lg:mt-0">
            {/* About Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">About</h3>
                <div className="space-y-3 text-sm">
                  {profileData.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-cmo-text-secondary" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                  {profileData.phoneNumber && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-cmo-text-secondary" />
                      <span>{profileData.phoneNumber}</span>
                    </div>
                  )}
                  {profileData.city && profileData.country && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cmo-text-secondary" />
                      <span>{profileData.city}, {profileData.country}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">Experience</h3>
                <div className="space-y-4">
                  {mockExperience.map((exp) => (
                    <div key={exp.id} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-cmo-primary/10 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-cmo-text-primary">{exp.role}</h4>
                        <p className="text-sm text-cmo-text-secondary">{exp.company}</p>
                        <p className="text-xs text-cmo-text-secondary mt-1">{exp.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-cmo-text-primary mb-4">Education</h3>
                <div className="space-y-4">
                  {mockEducation.map((edu) => (
                    <div key={edu.id} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-cmo-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-cmo-text-primary">{edu.degree}</h4>
                        <p className="text-sm text-cmo-text-secondary">{edu.fieldOfStudy}</p>
                        <p className="text-sm text-cmo-text-secondary">{edu.schoolOrCollege}</p>
                      </div>
                    </div>
                  ))}
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
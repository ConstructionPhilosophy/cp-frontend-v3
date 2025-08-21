import { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { userApiService, UserProfile } from '../lib/userApi';
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
  Briefcase
} from 'lucide-react';



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

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  const filters = ['All', 'News', 'Posts', 'Articles', 'Videos', 'Jobs'];

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await userApiService.getCurrentUser(true);
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Fallback to context data if API fails
        if (userProfile) {
          setProfileData(userProfile);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, userProfile]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cmo-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-cmo-text-secondary">Unable to load profile data.</p>
          </div>
        </div>
      </div>
    );
  }

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
                  backgroundImage: (profileData as any).bannerUrl ? `url(${(profileData as any).bannerUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <CardContent className="relative p-6">
                {/* Profile Info Section - Fixed Overlap */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 -mt-20 border-4 border-white shadow-lg">
                      <AvatarImage src={(profileData as any).photoUrl || (profileData as any).profilePic || ""} />
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
                          {(profileData as any).userType === 'business' 
                            ? (profileData as any).businessProfile?.companyName 
                            : ((profileData as any).title || (profileData as any).positionDesignation || 'Professional')
                          }
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-cmo-text-secondary">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {profileData.email}
                          </span>
                          {(profileData as any).phoneNumber && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {(profileData as any).phoneNumber}
                            </span>
                          )}
                          {((profileData as any).userType === 'business' ? (profileData as any).businessProfile?.location : ((profileData as any).city || (profileData as any).stateName)) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {(profileData as any).userType === 'business' 
                                ? `${(profileData as any).businessProfile.location.city}, ${(profileData as any).businessProfile.location.state.name}`
                                : `${(profileData as any).city || ''}, ${(profileData as any).stateName || ''}`
                              }
                            </span>
                          )}
                          {(profileData as any).userType === 'business' && (profileData as any).businessProfile?.website && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              <a href={(profileData as any).businessProfile.website} target="_blank" rel="noopener noreferrer" className="text-cmo-primary hover:underline">
                                Website
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button className="bg-cmo-primary hover:bg-cmo-primary/90">
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </Button>
                        
                        {/* Three Dots Menu with Icons */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Profile</span>
                            </DropdownMenuItem>
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
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {((profileData as any).userType === 'business' ? (profileData as any).businessProfile?.description : (profileData as any).about) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-cmo-text-secondary leading-relaxed">
                      {(profileData as any).userType === 'business' 
                        ? (profileData as any).businessProfile.description 
                        : (profileData as any).about
                      }
                    </p>
                  </div>
                )}


              </CardContent>
            </Card>

            {(profileData as any).userType === 'business' ? (
              /* Projects Section for Business */
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Building className="w-6 h-6 text-cmo-primary" />
                      Projects
                    </h3>
                    <Button variant="ghost" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {((profileData as any).projects || []).length > 0 ? (
                      ((profileData as any).projects || []).map((project: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building className="w-6 h-6 text-cmo-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{project.name || project.title}</h4>
                            <p className="text-cmo-primary font-medium">{project.client || project.company}</p>
                            <p className="text-cmo-text-secondary flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {project.location}
                            </p>
                            <p className="text-sm text-cmo-text-secondary mt-1">
                              {project.startDate && new Date(project.startDate).getFullYear()} - 
                              {project.endDate ? new Date(project.endDate).getFullYear() : 'Ongoing'}
                            </p>
                            {project.description && (
                              <p className="text-cmo-text-secondary mt-2">{project.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-cmo-text-secondary text-center py-8">No projects added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Education Section for Personal */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-cmo-primary" />
                        Education
                      </h3>
                      <Button variant="ghost" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
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

                {/* Experience Section for Personal */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-cmo-primary" />
                        Experience
                      </h3>
                      <Button variant="ghost" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
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
              </>
            )}

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
                          <AvatarImage src={(profileData as any).photoUrl || (profileData as any).profilePic || ""} />
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
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
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
                          
                          {/* Engagement Actions - Updated with Share button */}
                          <div className="flex items-center gap-6 mt-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleComments(activity.id)}
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Comment ({activity.engagement.comments})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Thanks ({activity.engagement.thanks})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <Star className="w-4 h-4 mr-1" />
                              Insightful ({activity.engagement.insightful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                            <Button variant="ghost" size="sm" className="text-cmo-text-secondary hover:text-cmo-primary">
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Expandable Comment Section */}
                          {expandedComments[activity.id] && (
                            <div className="mt-4 pl-4 border-l-2 border-cmo-border">
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={(profileData as any).photoUrl || (profileData as any).profilePic || ""} />
                                  <AvatarFallback className="text-xs">
                                    {profileData.firstName?.charAt(0) || 'U'}{profileData.lastName?.charAt(0) || ''}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="Write a comment..."
                                    value={commentText[activity.id] || ''}
                                    onChange={(e) => handleCommentChange(activity.id, e.target.value)}
                                    className="min-h-[80px] mb-2"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => toggleComments(activity.id)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleSubmitComment(activity.id)}
                                      disabled={!commentText[activity.id]?.trim()}
                                      className="bg-cmo-primary hover:bg-cmo-primary/90"
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

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Intro Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Intro</h3>
                <div className="space-y-3">
                  {(profileData as any).userType === 'business' ? (
                    <>
                      {/* Business Profile Info */}
                      {(profileData as any).businessProfile?.companyName && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).businessProfile.companyName}</span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.industry && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).businessProfile.industry}</span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.companySize && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).businessProfile.companySize} employees</span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.registrationNumber && (
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">Reg: {(profileData as any).businessProfile.registrationNumber}</span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-cmo-primary" />
                          <a href={(profileData as any).businessProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-cmo-primary hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Personal Profile Info */}
                      {((profileData as any).title || (profileData as any).positionDesignation) && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).title || (profileData as any).positionDesignation}</span>
                        </div>
                      )}
                      {(profileData as any).company && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).company}</span>
                        </div>
                      )}
                      {(profileData as any).gender && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">{(profileData as any).gender}</span>
                        </div>
                      )}
                      {(profileData as any).dateOfBirth && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">Born {new Date((profileData as any).dateOfBirth).getFullYear()}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Common Info */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">Joined {(profileData as any).createdTime ? new Date((profileData as any).createdTime).getFullYear() : new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  {(profileData as any).phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cmo-primary" />
                      <span className="text-sm">{(profileData as any).phoneNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Expertise - Only for Personal Profiles */}
            {(profileData as any).userType !== 'business' && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Skills Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {((profileData as any).skills || []).length > 0 ? (
                      ((profileData as any).skills || []).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-cmo-primary/10 text-cmo-primary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-cmo-text-secondary text-sm">No skills added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages Known */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Languages Known</h3>
                <div className="flex flex-wrap gap-2">
                  {((profileData as any).languages || []).map((lang: string) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Filters */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Popular Filters</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Questions & Answers
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Articles & Posts
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Industry Updates
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Job Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
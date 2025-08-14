import { useState } from 'react';
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

// Mock data based on API structure
const mockProfileData = {
  uid: "abc123",
  email: "john.smith@example.com",
  emailVerified: true,
  firstName: "John",
  lastName: "Smith",
  phoneNumber: "+911234567890",
  photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  bannerUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300",
  title: "CMO at SingleFire",
  positionDesignation: "Chief Marketing Officer",
  gender: "Male",
  dateOfBirth: "1985-03-15",
  city: "Virginia",
  state: "NY",
  country: "United States",
  about: "I'm the model of the new CMO. I've combined a deep background in brand management at blue chip CPG companies with eCommerce growth marketing at the world's biggest retailer. I've run SingleFire I've created world-class campaigns; I've built digital marketing organisations from the ground up. I have over 20 years experience leading... See more",
  skills: [
    "Leadership",
    "Marketing",
    "Public-relations", 
    "Branding"
  ],
  language: [
    "English",
    "Spanish"
  ],
  followersCount: 142,
  followingCount: 80,
  postCount: 15,
  messageCount: 5,
  createdTime: "2020-05-01T12:00:00Z",
  updatedTime: "2025-07-01T09:30:00Z",
  isFollowing: false
};

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

  const filters = ['All', 'News', 'Posts', 'Articles', 'Videos', 'Jobs'];

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
                  backgroundImage: `url(${mockProfileData.bannerUrl})`,
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
                      <AvatarImage src={mockProfileData.photoUrl} />
                      <AvatarFallback className="text-2xl">
                        {mockProfileData.firstName.charAt(0)}{mockProfileData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-3xl font-bold text-cmo-text-primary truncate">
                          {mockProfileData.firstName} {mockProfileData.lastName}
                        </h1>
                        <p className="text-lg text-cmo-text-secondary mb-3">
                          {mockProfileData.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-cmo-text-secondary">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {mockProfileData.city}, {mockProfileData.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {mockProfileData.followersCount} followers
                          </span>
                          <span>
                            {mockProfileData.followingCount} following
                          </span>
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
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-cmo-text-secondary leading-relaxed">{mockProfileData.about}</p>
                </div>


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

            {/* Experience Section */}
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
                        <Building className="w-6 h-6 text-cmo-primary" />
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
                          <AvatarImage src={mockProfileData.photoUrl} />
                          <AvatarFallback>
                            {mockProfileData.firstName.charAt(0)}{mockProfileData.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-cmo-text-primary">{activity.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-cmo-text-secondary mt-1">
                                <span>{mockProfileData.firstName} {mockProfileData.lastName}</span>
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
                                  <AvatarImage src={mockProfileData.photoUrl} />
                                  <AvatarFallback className="text-xs">
                                    {mockProfileData.firstName.charAt(0)}{mockProfileData.lastName.charAt(0)}
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
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">{mockProfileData.positionDesignation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">{mockProfileData.followersCount} followers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">Joined {new Date(mockProfileData.createdTime).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">j••••@e••••.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">+91••••••••90</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">LinkedIn Profile</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Expertise */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Skills Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProfileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-cmo-primary/10 text-cmo-primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages Known */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Languages Known</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProfileData.language.map((lang) => (
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
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Header from '../components/layout/header';
import { useAuth } from '../contexts/AuthContext';
import { userApiService, UserProfile } from '../lib/userApi';
import { useCreateConversation } from '../hooks/useChat';
import { useLocation } from 'wouter';
import { useToast } from '../hooks/use-toast';
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
  const { createConversation } = useCreateConversation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Edit Profile Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    // Personal fields
    firstName: '',
    lastName: '',
    title: '',
    positionDesignation: '',
    currentCompany: '',
    about: '',
    gender: '',
    dateOfBirth: '',
    city: '',
    stateName: '',
    country: '',
    // Business fields
    companyName: '',
    industry: '',
    companyType: '',
    description: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    website: '',
    registrationNumber: '',
    companySize: '',
  });

  const filters = ['All', 'News', 'Posts', 'Articles', 'Videos', 'Jobs'];

  const handleSendMessage = async () => {
    if (!profileData || !user) return;
    
    // Don't allow messaging yourself
    if (user.uid === profileData.uid) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot send a message to yourself.",
        variant: "destructive",
      });
      return;
    }
    
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await userApiService.getCurrentUser(true);
        setProfileData(data);
        // Populate edit form data based on user type
        const isBusinessUser = (data as any).userType === 'business';
        setEditFormData({
          // Personal fields
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          title: (data as any).title || '',
          positionDesignation: (data as any).positionDesignation || '',
          currentCompany: (data as any).company || '',
          about: (data as any).description || (data as any).about || '',
          gender: (data as any).gender || '',
          dateOfBirth: (data as any).dateOfBirth || '',
          city: (data as any).city || '',
          stateName: (data as any).stateName || '',
          country: (data as any).country || '',
          // Business fields
          companyName: isBusinessUser ? (data as any).businessProfile?.companyName || '' : '',
          industry: isBusinessUser ? (data as any).businessProfile?.industry || '' : '',
          companyType: isBusinessUser ? (data as any).businessProfile?.companyType || '' : '',
          description: isBusinessUser ? (data as any).businessProfile?.description || '' : '',
          addressLine1: isBusinessUser ? (data as any).businessProfile?.addressLine1 || '' : '',
          addressLine2: isBusinessUser ? (data as any).businessProfile?.addressLine2 || '' : '',
          pincode: isBusinessUser ? (data as any).businessProfile?.pincode || '' : '',
          website: isBusinessUser ? (data as any).businessProfile?.website || '' : '',
          registrationNumber: isBusinessUser ? (data as any).businessProfile?.registrationNumber || '' : '',
          companySize: isBusinessUser ? (data as any).businessProfile?.companySize || '' : '',
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Fallback to context data if API fails
        if (userProfile) {
          setProfileData(userProfile);
          const isBusinessUser = (userProfile as any).userType === 'business';
          setEditFormData({
            // Personal fields
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            title: (userProfile as any).title || '',
            positionDesignation: (userProfile as any).positionDesignation || '',
            currentCompany: (userProfile as any).company || '',
            about: (userProfile as any).description || (userProfile as any).about || '',
            gender: (userProfile as any).gender || '',
            dateOfBirth: (userProfile as any).dateOfBirth || '',
            city: (userProfile as any).city || '',
            stateName: (userProfile as any).stateName || '',
            country: (userProfile as any).country || '',
            // Business fields
            companyName: isBusinessUser ? (userProfile as any).businessProfile?.companyName || '' : '',
            industry: isBusinessUser ? (userProfile as any).businessProfile?.industry || '' : '',
            companyType: isBusinessUser ? (userProfile as any).businessProfile?.companyType || '' : '',
            description: isBusinessUser ? (userProfile as any).businessProfile?.description || '' : '',
            addressLine1: isBusinessUser ? (userProfile as any).businessProfile?.addressLine1 || '' : '',
            addressLine2: isBusinessUser ? (userProfile as any).businessProfile?.addressLine2 || '' : '',
            pincode: isBusinessUser ? (userProfile as any).businessProfile?.pincode || '' : '',
            website: isBusinessUser ? (userProfile as any).businessProfile?.website || '' : '',
            registrationNumber: isBusinessUser ? (userProfile as any).businessProfile?.registrationNumber || '' : '',
            companySize: isBusinessUser ? (userProfile as any).businessProfile?.companySize || '' : '',
          });
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

  // Edit Profile Handlers
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData || !user) return;
    
    setEditFormLoading(true);
    
    try {
      const isBusinessUser = (profileData as any).userType === 'business';
      let updateData: any = {};
      
      if (isBusinessUser) {
        // Business profile update
        updateData = {
          businessProfile: {
            companyName: editFormData.companyName,
            industry: editFormData.industry,
            companyType: editFormData.companyType,
            description: editFormData.description,
            addressLine1: editFormData.addressLine1,
            addressLine2: editFormData.addressLine2,
            pincode: editFormData.pincode,
            website: editFormData.website,
            registrationNumber: editFormData.registrationNumber,
            companySize: editFormData.companySize,
            location: {
              city: editFormData.city,
              state: { name: editFormData.stateName },
              country: editFormData.country
            }
          }
        };
      } else {
        // Personal profile update
        updateData = {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          title: editFormData.title,
          positionDesignation: editFormData.positionDesignation,
          company: editFormData.currentCompany,
          description: editFormData.about,
          gender: editFormData.gender,
          dateOfBirth: editFormData.dateOfBirth,
          city: editFormData.city,
          stateName: editFormData.stateName,
          country: editFormData.country,
        };
      }
      
      // Remove empty fields
      const removeEmptyFields = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) return obj.map(removeEmptyFields).filter(v => v !== null && v !== undefined && v !== '');
        
        return Object.keys(obj).reduce((acc, key) => {
          const value = obj[key];
          if (value !== null && value !== undefined && value !== '') {
            if (typeof value === 'object') {
              const cleaned = removeEmptyFields(value);
              if (Object.keys(cleaned).length > 0) {
                acc[key] = cleaned;
              }
            } else {
              acc[key] = value;
            }
          }
          return acc;
        }, {} as any);
      };
      
      updateData = removeEmptyFields(updateData);
      
      const updatedUser = await userApiService.updateUser(profileData.uid, updateData);
      setProfileData(updatedUser);
      setShowEditProfileModal(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cmo-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center h-32">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Banner and Profile Section */}
            <Card className="mb-4 overflow-hidden">
              <div 
                className="h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  backgroundImage: (profileData as any).bannerUrl ? `url(${(profileData as any).bannerUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <CardContent className="relative p-4 sm:p-6">
                {/* Profile Info Section - Fixed Overlap */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 -mt-14 sm:-mt-16 border-4 border-white shadow-lg">
                      <AvatarImage src={(profileData as any).photoUrl || (profileData as any).profilePic || ""} />
                      <AvatarFallback className="text-lg sm:text-xl">
                        {profileData.firstName?.charAt(0) || 'U'}{profileData.lastName?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-semibold text-cmo-text-primary truncate">
                          {profileData.firstName || ''} {profileData.lastName || ''}
                        </h1>
                        <p className="text-sm sm:text-base text-cmo-text-secondary mb-2">
                          {(profileData as any).userType === 'business' 
                            ? (profileData as any).businessProfile?.companyName 
                            : ((profileData as any).title || (profileData as any).positionDesignation || 'Professional')
                          }
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-cmo-text-secondary">
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
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSendMessage}
                          disabled={!profileData || user?.uid === profileData?.uid}
                        >
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
                            <DropdownMenuItem onClick={() => setShowEditProfileModal(true)}>
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

            {/* Suggested for You */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">Suggested for You</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      name: "Sarah Johnson",
                      title: "Senior Project Manager",
                      location: "Austin, TX",
                      photoUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      id: 2,
                      name: "Michael Chen",
                      title: "Construction Engineer",
                      location: "Seattle, WA",
                      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      id: 3,
                      name: "Emily Rodriguez",
                      title: "Architect",
                      location: "Denver, CO",
                      photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      id: 4,
                      name: "David Thompson",
                      title: "Civil Engineer",
                      location: "Phoenix, AZ",
                      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    },
                    {
                      id: 5,
                      name: "Lisa Wang",
                      title: "Construction Manager",
                      location: "Portland, OR",
                      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
                    }
                  ].map((person) => (
                    <div key={person.id} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={person.photoUrl} />
                        <AvatarFallback className="text-xs">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs text-cmo-text-primary truncate">{person.name}</p>
                        <p className="text-xs text-cmo-text-secondary truncate">{person.title}</p>
                        <p className="text-xs text-cmo-text-secondary truncate">{person.location}</p>
                      </div>
                      <Button size="sm" className="text-xs px-3 py-1 h-6 bg-blue-600 hover:bg-blue-700 text-white">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Filters */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">Popular Filters</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-xs h-8">
                    Questions & Answers
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-xs h-8">
                    Articles & Posts
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-xs h-8">
                    Industry Updates
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-xs h-8">
                    Job Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditFormSubmit} className="space-y-4">
            {(profileData as any)?.userType === 'business' ? (
              // Business Profile Fields
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editFormData.companyName}
                    onChange={(e) => handleEditFormChange("companyName", e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={editFormData.industry} onValueChange={(value) => handleEditFormChange("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select value={editFormData.companyType} onValueChange={(value) => handleEditFormChange("companyType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                        <SelectItem value="Public Limited">Public Limited</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="LLP">LLP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => handleEditFormChange("description", e.target.value)}
                    placeholder="Describe your company and services"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      value={editFormData.addressLine1}
                      onChange={(e) => handleEditFormChange("addressLine1", e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      value={editFormData.addressLine2}
                      onChange={(e) => handleEditFormChange("addressLine2", e.target.value)}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editFormData.country}
                      onChange={(e) => handleEditFormChange("country", e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateName">State</Label>
                    <Input
                      id="stateName"
                      value={editFormData.stateName}
                      onChange={(e) => handleEditFormChange("stateName", e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editFormData.city}
                      onChange={(e) => handleEditFormChange("city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={editFormData.pincode}
                      onChange={(e) => handleEditFormChange("pincode", e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editFormData.website}
                      onChange={(e) => handleEditFormChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={editFormData.registrationNumber}
                      onChange={(e) => handleEditFormChange("registrationNumber", e.target.value)}
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={editFormData.companySize} onValueChange={(value) => handleEditFormChange("companySize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              // Personal Profile Fields
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editFormData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editFormData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={editFormData.title}
                    onChange={(e) => handleEditFormChange("title", e.target.value)}
                    placeholder="Enter your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionDesignation">Position/Designation</Label>
                  <Input
                    id="positionDesignation"
                    value={editFormData.positionDesignation}
                    onChange={(e) => handleEditFormChange("positionDesignation", e.target.value)}
                    placeholder="Enter your position or designation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    value={editFormData.currentCompany}
                    onChange={(e) => handleEditFormChange("currentCompany", e.target.value)}
                    placeholder="Enter your current company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={editFormData.about}
                    onChange={(e) => handleEditFormChange("about", e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={editFormData.gender} onValueChange={(value) => handleEditFormChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) => handleEditFormChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editFormData.city}
                      onChange={(e) => handleEditFormChange("city", e.target.value)}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateName">State</Label>
                    <Input
                      id="stateName"
                      value={editFormData.stateName}
                      onChange={(e) => handleEditFormChange("stateName", e.target.value)}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editFormData.country}
                      onChange={(e) => handleEditFormChange("country", e.target.value)}
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProfileModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editFormLoading}>
                {editFormLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
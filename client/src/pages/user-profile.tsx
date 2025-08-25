import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Header from "../components/layout/header";
import MobileNavigation from "../components/mobile-navigation";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../contexts/AuthContext";
import { userApiService, UserProfile } from "../lib/userApi";
import { useCreateConversation } from "../hooks/useChat";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
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
  FileText,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";

const mockEducation = [
  {
    id: "edu1",
    degree: "MBA",
    fieldOfStudy: "Marketing & Business Strategy",
    schoolOrCollege: "Oxford International",
    startDate: "2008-09-01",
    endDate: "2010-06-30",
    grade: "Distinction",
  },
  {
    id: "edu2",
    degree: "B.A.",
    fieldOfStudy: "Business Administration",
    schoolOrCollege: "Stanford University",
    startDate: "2003-09-01",
    endDate: "2007-05-31",
    grade: "Magna Cum Laude",
  },
];

const mockExperience = [
  {
    id: "exp1",
    company: "SingleFire",
    role: "Chief Marketing Officer",
    location: "Virginia, NY",
    startDate: "2020-01-01",
    endDate: null,
    description:
      "Leading global marketing strategy and brand management for digital transformation initiatives.",
  },
  {
    id: "exp2",
    company: "Blue Chip CPG",
    role: "Senior Brand Manager",
    location: "New York, NY",
    startDate: "2015-03-01",
    endDate: "2019-12-31",
    description:
      "Managed multi-million dollar brand portfolios and launched successful product campaigns.",
  },
];

const mockActivities = [
  {
    id: "1",
    type: "question",
    title:
      "Do you have any experience with deploying @Hubspot for a SaaS business with both a direct and self-serve model?",
    content:
      "We have a $2M ARR B2B startup with a custom solution today. We are using @Mixpanel and working with @Division of Labor to rebuild our pages. @Jennifer Smith... See more",
    timestamp: "Nov 19",
    category: "Questions & Answers",
    engagement: { comments: 1, thanks: 5, insightful: 2 },
  },
  {
    id: "2",
    type: "article",
    title: "Looking for a new landing page optimization vendor",
    content:
      "We are looking for a landing page tool that they are missing a minimal with a custom solution that no... See more",
    timestamp: "Nov 12",
    category: "#Inbound #SaaS",
    engagement: { comments: 1, thanks: 15, insightful: 6 },
  },
];

export default function UserProfilePage() {
  const [match, params] = useRoute("/u/:username");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false);
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false);
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [followersLoading, setFollowersLoading] = useState<boolean>(false);
  const [followingLoading, setFollowingLoading] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [editFormLoading, setEditFormLoading] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    positionDesignation: "",
    currentCompany: "",
    about: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    state: "",
    country: "",
    userType: "",
    organizationName: "",
  });
  const { user, userProfile } = useAuth();
  const { createConversation } = useCreateConversation();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const username = params?.username;
  const filters = ["All", "News", "Posts", "Articles", "Videos", "Jobs"];

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
        
        // Check if current user is in the followerlist
        if (userData.followerlist && user?.uid) {
          setIsFollowing(userData.followerlist.includes(user.uid));
        }
        
        // Initialize edit form data
        setEditFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          title: userData.title || "",
          positionDesignation: userData.positionDesignation || "",
          currentCompany: userData.currentCompany || "",
          about: userData.about || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth || "",
          city: userData.city || "",
          state: typeof userData.state === 'string' ? userData.state : userData.state?.name || "",
          country: typeof userData.country === 'string' ? userData.country : userData.country?.name || "",
          userType: userData.userType || "",
          organizationName: userData.organizationName || "",
        });
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        if (error.message === "USER_NOT_FOUND") {
          setError("User not found");
        } else if (error.message === "AUTH_EXPIRED") {
          setError("Authentication expired");
        } else {
          setError("Failed to load user profile");
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
      console.error("Error creating conversation:", error);

      // Handle Firebase permission errors more gracefully
      if (
        error.message?.includes("permissions") ||
        error.message?.includes("PERMISSION_DENIED")
      ) {
        toast({
          title: "Chat feature not available",
          description:
            "Chat functionality is being set up. Please try again later.",
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

  const handleFollowToggle = async () => {
    if (!profileData || !user || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await userApiService.unfollowUser(profileData.uid);
        setIsFollowing(false);
        // Update followerlist locally
        if (profileData.followerlist && user?.uid) {
          profileData.followerlist = profileData.followerlist.filter(uid => uid !== user.uid);
        }
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profileData.firstName} ${profileData.lastName}`,
        });
      } else {
        await userApiService.followUser(profileData.uid);
        setIsFollowing(true);
        // Update followerlist locally
        if (profileData.followerlist && user?.uid) {
          profileData.followerlist.push(user.uid);
        } else if (user?.uid) {
          profileData.followerlist = [user.uid];
        }
        toast({
          title: "Following",
          description: `You are now following ${profileData.firstName} ${profileData.lastName}`,
        });
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Failed to update follow status",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShowFollowers = async () => {
    if (!profileData) return;
    
    setShowFollowersModal(true);
    setFollowersLoading(true);
    
    try {
      const followersList = await userApiService.getUserFollowers(profileData.uid);
      setFollowers(followersList || []);
    } catch (error) {
      console.error('Error fetching followers:', error);
      toast({
        title: "Failed to load followers",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFollowersLoading(false);
    }
  };

  const handleShowFollowing = async () => {
    if (!profileData) return;
    
    setShowFollowingModal(true);
    setFollowingLoading(true);
    
    try {
      const followingList = await userApiService.getUserFollowing(profileData.uid);
      setFollowing(followingList || []);
    } catch (error) {
      console.error('Error fetching following:', error);
      toast({
        title: "Failed to load following",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFollowingLoading(false);
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData || !user) return;
    
    setEditFormLoading(true);
    
    try {
      const updateData: any = {
        ...editFormData,
        company: editFormData.currentCompany,
        description: editFormData.about,
      };
      
      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === "") {
          delete updateData[key];
        }
      });
      
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

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentText((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleSubmitComment = (postId: string) => {
    console.log(`Comment for post ${postId}:`, commentText[postId]);
    setCommentText((prev) => ({
      ...prev,
      [postId]: "",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-cmo-text-secondary text-sm mb-2">
              {error || "User not found"}
            </p>
            <Button variant="outline" onClick={() => setLocation("/")}>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Banner and Profile Section */}
            <Card className="mb-4 overflow-hidden">
              <div
                className="h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  backgroundImage: profileData.bannerUrl
                    ? `url(${profileData.bannerUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <CardContent className="relative p-3 sm:p-4">
                {/* Profile Info Section */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 -mt-10 sm:-mt-12 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={
                          profileData.photoUrl || profileData.profilePic || ""
                        }
                      />
                      <AvatarFallback className="text-sm">
                        {profileData.firstName?.charAt(0) || "U"}
                        {profileData.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-semibold text-cmo-text-primary truncate">
                          {profileData.firstName || ""}{" "}
                          {profileData.lastName || ""}
                        </h1>
                        <p className="text-sm sm:text-base text-cmo-text-secondary mb-1">
                          {profileData.positionDesignation || "Professional"} at{" "}
                          {profileData.currentCompany || "Company"}
                        </p>
                        {profileData.city && profileData.country && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-cmo-text-secondary mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {profileData.city}
                              {profileData.state
                                ? `, ${typeof profileData.state === "string" ? profileData.state : profileData.state.name}`
                                : ""}
                              ,{" "}
                              {typeof profileData.country === "string"
                                ? profileData.country
                                : profileData.country.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-cmo-text-secondary">
                          <button 
                            className="flex items-center gap-1 hover:text-cmo-primary transition-colors"
                            onClick={handleShowFollowers}
                          >
                            <Users className="w-4 h-4" />
                            {profileData.followersCount || 0} followers
                          </button>
                          <button 
                            className="hover:text-cmo-primary transition-colors"
                            onClick={handleShowFollowing}
                          >
                            {profileData.followingCount || 0} following
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isOwnProfile && (
                        <div className="flex items-center gap-2 flex-shrink-0">
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}

                      {!isOwnProfile && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendMessage}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            className={
                              isFollowing
                                ? "bg-gray-500 hover:bg-gray-600"
                                : "bg-cmo-primary hover:bg-cmo-primary/90"
                            }
                            onClick={handleFollowToggle}
                            disabled={followLoading}
                          >
                            {followLoading ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : isFollowing ? (
                              <User className="w-4 h-4 mr-2" />
                            ) : (
                              <Plus className="w-4 h-4 mr-2" />
                            )}
                            {isFollowing ? "Following" : "Follow"}
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
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">About</h3>
                  <p className="text-sm text-cmo-text-secondary leading-relaxed">
                    {profileData.about ||
                      "Professional with expertise in the construction and civil engineering industry."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills Expertise Section - Only for Personal Profiles */}
            {(profileData as any).userType !== "business" && (
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Star className="w-6 h-6 text-cmo-primary" />
                      Skills Expertise
                    </h3>
                  </div>
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

            {/* Education Section */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-cmo-primary" />
                    Education
                  </h3>
                </div>
                <div className="space-y-4">
                  {mockEducation.map((edu) => (
                    <div key={edu.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{edu.degree}</h4>
                        <p className="text-sm text-cmo-primary font-medium">
                          {edu.fieldOfStudy}
                        </p>
                        <p className="text-sm text-cmo-text-secondary">
                          {edu.schoolOrCollege}
                        </p>
                        <p className="text-xs text-cmo-text-secondary mt-1">
                          {new Date(edu.startDate).getFullYear()} -{" "}
                          {new Date(edu.endDate).getFullYear()}
                          {edu.grade && ` • ${edu.grade}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cmo-primary" />
                    Experience
                  </h3>
                </div>
                <div className="space-y-4">
                  {mockExperience.map((exp) => (
                    <div key={exp.id} className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-cmo-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{exp.role}</h4>
                        <p className="text-sm text-cmo-primary font-medium">
                          {exp.company}
                        </p>
                        <p className="text-xs text-cmo-text-secondary flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </p>
                        <p className="text-xs text-cmo-text-secondary mt-1">
                          {new Date(exp.startDate).getFullYear()} -{" "}
                          {exp.endDate
                            ? new Date(exp.endDate).getFullYear()
                            : "Present"}
                        </p>
                        <p className="text-xs text-cmo-text-secondary mt-2">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activities */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Activities</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Activity Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.map((filter) => (
                    <Button
                      key={filter}
                      variant={activeFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter)}
                      className={
                        activeFilter === filter ? "bg-cmo-primary" : ""
                      }
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                  {mockActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-b border-cmo-border pb-4 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              profileData.photoUrl ||
                              profileData.profilePic ||
                              ""
                            }
                          />
                          <AvatarFallback>
                            {profileData.firstName?.charAt(0) || "U"}
                            {profileData.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-cmo-text-primary">
                                {activity.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-cmo-text-secondary mt-1">
                                <span>
                                  {profileData.firstName || ""}{" "}
                                  {profileData.lastName || ""}
                                </span>
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
                          <p className="text-cmo-text-secondary mt-3">
                            {activity.content}
                          </p>

                          {/* Engagement Actions */}
                          <div className="flex items-center gap-6 mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Insightful {activity.engagement.insightful}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>

                          {/* Comments Section */}
                          {expandedComments[activity.id] && (
                            <div className="mt-4 pt-4 border-t border-cmo-border">
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={userProfile?.profilePic || ""}
                                  />
                                  <AvatarFallback>
                                    {userProfile?.firstName?.charAt(0) || "U"}
                                    {userProfile?.lastName?.charAt(0) || ""}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    placeholder="Write a comment..."
                                    value={commentText[activity.id] || ""}
                                    onChange={(e) =>
                                      handleCommentChange(
                                        activity.id,
                                        e.target.value,
                                      )
                                    }
                                    className="min-h-[80px] resize-none"
                                  />
                                  <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        toggleComments(activity.id)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleSubmitComment(activity.id)
                                      }
                                      disabled={
                                        !commentText[activity.id]?.trim()
                                      }
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
            {/* Intro */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-cmo-text-primary mb-3">
                  Intro
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-cmo-text-secondary">Position:</span>
                    <span className="font-medium">
                      {profileData.positionDesignation || "Professional"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cmo-text-secondary">Joined:</span>
                    <span className="font-medium">2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cmo-text-secondary">Email:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium hover:text-cmo-primary"
                      onClick={() => setShowContactInfo(!showContactInfo)}
                    >
                      {showContactInfo
                        ? profileData.email
                        : "••••••••@gmail.com"}
                    </Button>
                  </div>
                  {profileData.phoneNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-cmo-text-secondary">Phone:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-medium hover:text-cmo-primary"
                        onClick={() => setShowContactInfo(!showContactInfo)}
                      >
                        {showContactInfo
                          ? profileData.phoneNumber
                          : "Phone number is missing"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggested for You */}
            <Card className="mb-4">
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

            {/* Profile Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-cmo-text-primary mb-3">
                  Profile Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cmo-text-secondary">Posts:</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cmo-text-secondary">Views:</span>
                    <span className="font-semibold">1.2k</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cmo-text-secondary">Thanks:</span>
                    <span className="font-semibold">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cmo-text-secondary">Followers:</span>
                    <span className="font-semibold">500+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isMobile && <MobileNavigation />}

      {/* Followers Modal */}
      <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Followers ({profileData?.followersCount || 0})</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {followersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-cmo-primary" />
              </div>
            ) : !followers || followers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-cmo-text-secondary mx-auto mb-2" />
                <p className="text-cmo-text-secondary">No followers yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {followers.map((follower) => (
                  <div
                    key={follower.uid}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setShowFollowersModal(false);
                      const userIdentifier = follower.username && follower.username.trim() !== '' ? follower.username : follower.uid;
                      setLocation(`/u/${userIdentifier}`);
                    }}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={follower.photoUrl || follower.profilePic} />
                      <AvatarFallback>
                        {follower.firstName?.charAt(0) || "U"}
                        {follower.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-cmo-text-primary truncate">
                        {follower.firstName} {follower.lastName}
                      </p>
                      {follower.title && (
                        <p className="text-xs text-cmo-text-secondary truncate">
                          {follower.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Modal */}
      <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Following ({profileData?.followingCount || 0})</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {followingLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-cmo-primary" />
              </div>
            ) : !following || following.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-cmo-text-secondary mx-auto mb-2" />
                <p className="text-cmo-text-secondary">Not following anyone yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {following.map((followedUser) => (
                  <div
                    key={followedUser.uid}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setShowFollowingModal(false);
                      const userIdentifier = followedUser.username && followedUser.username.trim() !== '' ? followedUser.username : followedUser.uid;
                      setLocation(`/u/${userIdentifier}`);
                    }}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={followedUser.photoUrl || followedUser.profilePic} />
                      <AvatarFallback>
                        {followedUser.firstName?.charAt(0) || "U"}
                        {followedUser.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-cmo-text-primary truncate">
                        {followedUser.firstName} {followedUser.lastName}
                      </p>
                      {followedUser.title && (
                        <p className="text-xs text-cmo-text-secondary truncate">
                          {followedUser.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditFormSubmit} className="space-y-4">
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) => handleEditFormChange("title", e.target.value)}
                placeholder="Enter your title"
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
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editFormData.state}
                  onChange={(e) => handleEditFormChange("state", e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select value={editFormData.userType} onValueChange={(value) => handleEditFormChange("userType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={editFormData.organizationName}
                  onChange={(e) => handleEditFormChange("organizationName", e.target.value)}
                  placeholder="Enter organization name"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProfileModal(false)}
                disabled={editFormLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editFormLoading}
              >
                {editFormLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

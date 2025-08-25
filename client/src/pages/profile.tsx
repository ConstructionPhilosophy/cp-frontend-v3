import { useState, useEffect } from "react";
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
import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Header from "../components/layout/header";
import { useAuth } from "../contexts/AuthContext";
import {
  userApiService,
  UserProfile,
  Education,
  Experience,
  Project,
} from "../lib/userApi";
import { useCreateConversation } from "../hooks/useChat";
import { useLocation } from "wouter";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import Select from "react-select";
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
  Trash2,
  X,
} from "lucide-react";

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

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
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
    firstName: "",
    lastName: "",
    title: "",
    positionDesignation: "",
    currentCompany: "",
    about: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    stateName: "",
    country: "",
    // Business fields
    companyName: "",
    industry: "",
    companyType: "",
    description: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    website: "",
    registrationNumber: "",
    companySize: "",
  });

  // Education, Experience, Projects State
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [educationLoading, setEducationLoading] = useState(false);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Skills State
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<
    { value: string; label: string }[]
  >([]);
  const [skillsSaving, setSkillsSaving] = useState(false);

  // Suggestions State
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});
  
  // Contact Info State
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Modal States for Education, Experience, Projects
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null,
  );
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [educationFormData, setEducationFormData] = useState<
    Omit<Education, "id">
  >({
    degree: "",
    fieldOfStudy: "",
    schoolOrCollege: "",
    startDate: "",
    endDate: "",
    grade: "",
  });
  const [experienceFormData, setExperienceFormData] = useState<
    Omit<Experience, "id">
  >({
    companyName: "",
    title: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });
  const [projectFormData, setProjectFormData] = useState<
    Omit<Project, "id" | "imageURLs" | "createdAt" | "updatedAt">
  >({
    title: "",
    description: "",
    location: "",
    tags: [],
  });
  const [projectImages, setProjectImages] = useState<File[]>([]);

  const filters = ["All", "News", "Posts", "Articles", "Videos", "Jobs"];

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
      console.error("Error creating conversation:", error);
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
        const isBusinessUser = (data as any).userType === "business";
        const location = (data as any).location || {};
        const businessProfile = (data as any).businessProfile || {};
        const businessLocation = businessProfile.location || {};

        setEditFormData({
          // Personal fields
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          title: (data as any).title || (data as any).jobTitle || "",
          positionDesignation:
            (data as any).positionDesignation || (data as any).position || "",
          currentCompany:
            (data as any).currentCompany || (data as any).company || "",
          about:
            (data as any).about ||
            (data as any).description ||
            (data as any).bio ||
            "",
          gender: (data as any).gender || "",
          dateOfBirth: (data as any).dateOfBirth || (data as any).dob || "",
          city:
            location.city || (data as any).city || businessLocation.city || "",
          stateName:
            location.state?.name ||
            location.stateName ||
            (data as any).stateName ||
            (data as any).state ||
            businessLocation.state?.name ||
            "",
          country:
            location.country?.name ||
            location.country ||
            (data as any).country ||
            businessLocation.country ||
            "",
          // Business fields
          companyName: isBusinessUser
            ? businessProfile.companyName || (data as any).companyName || ""
            : "",
          industry: isBusinessUser
            ? businessProfile.industry || (data as any).industry || ""
            : "",
          companyType: isBusinessUser
            ? businessProfile.companyType || (data as any).companyType || ""
            : "",
          description: isBusinessUser
            ? businessProfile.description || (data as any).description || ""
            : "",
          addressLine1: isBusinessUser
            ? businessProfile.addressLine1 ||
              businessLocation.addressLine1 ||
              ""
            : "",
          addressLine2: isBusinessUser
            ? businessProfile.addressLine2 ||
              businessLocation.addressLine2 ||
              ""
            : "",
          pincode: isBusinessUser
            ? businessProfile.pincode || businessLocation.pincode || ""
            : "",
          website: isBusinessUser
            ? businessProfile.website || (data as any).website || ""
            : "",
          registrationNumber: isBusinessUser
            ? businessProfile.registrationNumber ||
              (data as any).registrationNumber ||
              ""
            : "",
          companySize: isBusinessUser
            ? businessProfile.companySize || (data as any).companySize || ""
            : "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // Fallback to context data if API fails
        if (userProfile) {
          setProfileData(userProfile);
          const isBusinessUser = (userProfile as any).userType === "business";
          const location = (userProfile as any).location || {};
          const businessProfile = (userProfile as any).businessProfile || {};
          const businessLocation = businessProfile.location || {};

          setEditFormData({
            // Personal fields
            firstName: userProfile.firstName || "",
            lastName: userProfile.lastName || "",
            title:
              (userProfile as any).title || (userProfile as any).jobTitle || "",
            positionDesignation:
              (userProfile as any).positionDesignation ||
              (userProfile as any).position ||
              "",
            currentCompany:
              (userProfile as any).currentCompany ||
              (userProfile as any).company ||
              "",
            about:
              (userProfile as any).about ||
              (userProfile as any).description ||
              (userProfile as any).bio ||
              "",
            gender: (userProfile as any).gender || "",
            dateOfBirth:
              (userProfile as any).dateOfBirth ||
              (userProfile as any).dob ||
              "",
            city:
              location.city ||
              (userProfile as any).city ||
              businessLocation.city ||
              "",
            stateName:
              location.state?.name ||
              location.stateName ||
              (userProfile as any).stateName ||
              (userProfile as any).state ||
              businessLocation.state?.name ||
              "",
            country:
              location.country?.name ||
              location.country ||
              (userProfile as any).country ||
              businessLocation.country ||
              "",
            // Business fields
            companyName: isBusinessUser
              ? businessProfile.companyName ||
                (userProfile as any).companyName ||
                ""
              : "",
            industry: isBusinessUser
              ? businessProfile.industry || (userProfile as any).industry || ""
              : "",
            companyType: isBusinessUser
              ? businessProfile.companyType ||
                (userProfile as any).companyType ||
                ""
              : "",
            description: isBusinessUser
              ? businessProfile.description ||
                (userProfile as any).description ||
                ""
              : "",
            addressLine1: isBusinessUser
              ? businessProfile.addressLine1 ||
                businessLocation.addressLine1 ||
                ""
              : "",
            addressLine2: isBusinessUser
              ? businessProfile.addressLine2 ||
                businessLocation.addressLine2 ||
                ""
              : "",
            pincode: isBusinessUser
              ? businessProfile.pincode || businessLocation.pincode || ""
              : "",
            website: isBusinessUser
              ? businessProfile.website || (userProfile as any).website || ""
              : "",
            registrationNumber: isBusinessUser
              ? businessProfile.registrationNumber ||
                (userProfile as any).registrationNumber ||
                ""
              : "",
            companySize: isBusinessUser
              ? businessProfile.companySize ||
                (userProfile as any).companySize ||
                ""
              : "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, userProfile]);

  // Load Education, Experience, Projects
  const loadEducation = async () => {
    if (!profileData?.uid) return;
    setEducationLoading(true);
    try {
      const educationData = await userApiService.getUserEducation(
        profileData.uid,
      );
      setEducation(educationData || []);
    } catch (error) {
      console.error("Error loading education:", error);
      toast({
        title: "Error",
        description: "Failed to load education data",
        variant: "destructive",
      });
    } finally {
      setEducationLoading(false);
    }
  };

  const loadExperience = async () => {
    if (!profileData?.uid) return;
    setExperienceLoading(true);
    try {
      const experienceData = await userApiService.getUserExperience(
        profileData.uid,
      );
      setExperience(experienceData || []);
    } catch (error) {
      console.error("Error loading experience:", error);
      toast({
        title: "Error",
        description: "Failed to load experience data",
        variant: "destructive",
      });
    } finally {
      setExperienceLoading(false);
    }
  };

  const loadProjects = async () => {
    if (!profileData?.uid) return;
    setProjectsLoading(true);
    try {
      const projectsData = await userApiService.getUserProjects(
        profileData.uid,
      );
      setProjects(projectsData || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects data",
        variant: "destructive",
      });
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadSkills = async () => {
    if (!profileData?.uid) return;
    setSkillsLoading(true);
    try {
      // Load all skills and user skills in parallel
      const [allSkillsData, userSkillsData] = await Promise.all([
        userApiService.getAllSkills(),
        userApiService.getUserSkills(profileData.uid),
      ]);

      // Ensure data is arrays
      const skillsArray = Array.isArray(allSkillsData) ? allSkillsData : [];
      
      setAllSkills(skillsArray);
      
      // Update to handle the new API format
      if (userSkillsData && userSkillsData.skills) {
        // Store the skill names for display
        setUserSkills(userSkillsData.skills.map(skill => skill.name));
        
        // Set selected skills for the modal using all skills data
        const selectedSkillOptions = userSkillsData.skills
          .map((userSkill) => {
            const skill = skillsArray.find((s) => s.id === userSkill.skillId);
            return { value: userSkill.skillId, label: userSkill.name };
          })
          .filter(Boolean);

        setSelectedSkills(selectedSkillOptions);
      } else {
        setUserSkills([]);
        setSelectedSkills([]);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      toast({
        title: "Error",
        description: "Failed to load skills data",
        variant: "destructive",
      });
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSkillsModalOpen = () => {
    setSkillsModalOpen(true);
    if (allSkills.length === 0) {
      loadSkills();
    }
  };

  const handleSkillsSave = async () => {
    if (!profileData?.uid) return;

    setSkillsSaving(true);
    try {
      const skillIds = selectedSkills.map((skill) => skill.value);
      await userApiService.updateUserSkills(profileData.uid, skillIds);

      // Update local state
      setUserSkills(skillIds);
      setSkillsModalOpen(false);

      toast({
        title: "Skills updated",
        description: "Your skills have been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Error",
        description: "Failed to update skills",
        variant: "destructive",
      });
    } finally {
      setSkillsSaving(false);
    }
  };

  useEffect(() => {
    if (profileData?.uid) {
      if ((profileData as any).userType !== "business") {
        loadEducation();
        loadExperience();
        loadSkills();
      }
      loadProjects();
      loadSuggestions();
    }
  }, [profileData?.uid, (profileData as any)?.userType]);

  const loadSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const suggestionsData = await userApiService.getUserSuggestions();
      setSuggestions(suggestionsData || []);
    } catch (error) {
      console.error("Error loading suggestions:", error);
      // Fallback to empty array on error
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Education Handlers
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationFormData({
      degree: "",
      fieldOfStudy: "",
      schoolOrCollege: "",
      startDate: "",
      endDate: "",
      grade: "",
    });
    setShowEducationModal(true);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setEducationFormData({
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      schoolOrCollege: edu.schoolOrCollege,
      startDate: edu.startDate,
      endDate: edu.endDate,
      grade: edu.grade,
    });
    setShowEducationModal(true);
  };

  const handleSaveEducation = async () => {
    if (!profileData?.uid) return;
    setEditFormLoading(true);
    try {
      if (editingEducation?.id) {
        await userApiService.updateEducation(
          profileData.uid,
          editingEducation.id,
          educationFormData,
        );
        toast({
          title: "Success",
          description: "Education updated successfully",
        });
      } else {
        await userApiService.addEducation(profileData.uid, educationFormData);
        toast({
          title: "Success",
          description: "Education added successfully",
        });
      }
      setShowEducationModal(false);
      loadEducation();
    } catch (error) {
      console.error("Error saving education:", error);
      toast({
        title: "Error",
        description: "Failed to save education",
        variant: "destructive",
      });
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    if (!profileData?.uid) return;
    try {
      await userApiService.deleteEducation(profileData.uid, educationId);
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      loadEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: "Failed to delete education",
        variant: "destructive",
      });
    }
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setEditingExperience(null);
    setExperienceFormData({
      companyName: "",
      title: "",
      employmentType: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setShowExperienceModal(true);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceFormData({
      companyName: exp.companyName,
      title: exp.title,
      employmentType: exp.employmentType,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      description: exp.description,
    });
    setShowExperienceModal(true);
  };

  const handleSaveExperience = async () => {
    if (!profileData?.uid) return;
    setEditFormLoading(true);
    try {
      if (editingExperience?.id) {
        await userApiService.updateExperience(
          profileData.uid,
          editingExperience.id,
          experienceFormData,
        );
        toast({
          title: "Success",
          description: "Experience updated successfully",
        });
      } else {
        await userApiService.addExperience(profileData.uid, experienceFormData);
        toast({
          title: "Success",
          description: "Experience added successfully",
        });
      }
      setShowExperienceModal(false);
      loadExperience();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      });
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    if (!profileData?.uid) return;
    try {
      await userApiService.deleteExperience(profileData.uid, experienceId);
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      loadExperience();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  // Projects Handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setProjectFormData({
      title: "",
      description: "",
      location: "",
      tags: [],
    });
    setProjectImages([]);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      location: project.location || "",
      tags: project.tags || [],
    });
    setProjectImages([]);
    setShowProjectModal(true);
  };

  const handleSaveProject = async () => {
    if (!profileData?.uid) return;
    setEditFormLoading(true);
    try {
      if (editingProject?.id) {
        await userApiService.updateProject(
          profileData.uid,
          editingProject.id,
          projectFormData,
        );
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await userApiService.addProject(
          profileData.uid,
          projectFormData,
          projectImages,
        );
        toast({
          title: "Success",
          description: "Project added successfully",
        });
      }
      setShowProjectModal(false);
      loadProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!profileData?.uid) return;
    try {
      await userApiService.deleteProject(profileData.uid, projectId);
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
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

  // Edit Profile Handlers
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData || !user) return;

    setEditFormLoading(true);

    try {
      const isBusinessUser = (profileData as any).userType === "business";
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
              country: editFormData.country,
            },
          },
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
        if (obj === null || typeof obj !== "object") return obj;

        if (Array.isArray(obj))
          return obj
            .map(removeEmptyFields)
            .filter((v) => v !== null && v !== undefined && v !== "");

        return Object.keys(obj).reduce((acc, key) => {
          const value = obj[key];
          if (value !== null && value !== undefined && value !== "") {
            if (typeof value === "object") {
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

      const updatedUser = await userApiService.updateUser(
        profileData.uid,
        updateData,
      );
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
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
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
            <p className="text-cmo-text-secondary">
              Unable to load profile data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cmo-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Mobile-First: Intro Card visible at top on mobile */}
          <div className="lg:hidden mb-4">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Intro</h3>
                <div className="space-y-3">
                  {(profileData as any).userType === "business" ? (
                    <>
                      {/* Business Profile Info */}
                      {(profileData as any).businessProfile?.companyName && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.companyName}
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.industry && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.industry}
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.companySize && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.companySize}{" "}
                            employees
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.registrationNumber && (
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            Reg:{" "}
                            {(profileData as any).businessProfile.registrationNumber}
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-cmo-primary" />
                          <a
                            href={(profileData as any).businessProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cmo-primary hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Personal Profile Info */}
                      {((profileData as any).title ||
                        (profileData as any).positionDesignation) && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).title ||
                              (profileData as any).positionDesignation}
                          </span>
                        </div>
                      )}
                      {((profileData as any).company || (profileData as any).currentCompany) && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).company || (profileData as any).currentCompany}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common Info */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">
                      Joined{" "}
                      {(profileData as any).createdTime
                        ? new Date(
                            (profileData as any).createdTime,
                          ).getFullYear()
                        : new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cmo-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium hover:text-cmo-primary text-sm"
                      onClick={() => setShowContactInfo(!showContactInfo)}
                    >
                      {showContactInfo
                        ? profileData.email
                        : "••••••••@gmail.com"}
                    </Button>
                  </div>
                  {(profileData as any).phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cmo-primary" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-medium hover:text-cmo-primary text-sm"
                        onClick={() => setShowContactInfo(!showContactInfo)}
                      >
                        {showContactInfo
                          ? (profileData as any).phoneNumber
                          : "••••••••••"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Banner and Profile Section */}
            <Card className="mb-4 overflow-hidden">
              <div
                className="h-32 sm:h-40 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  backgroundImage: (profileData as any).bannerUrl
                    ? `url(${(profileData as any).bannerUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <CardContent className="relative p-3 sm:p-4">
                {/* Profile Info Section - Fixed Overlap */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 -mt-10 sm:-mt-12 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={
                          (profileData as any).photoUrl ||
                          (profileData as any).profilePic ||
                          ""
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
                          {(profileData as any).userType === "business"
                            ? (profileData as any).businessProfile?.companyName
                            : (profileData as any).title ||
                              (profileData as any).positionDesignation ||
                              "Professional"}
                        </p>
                        {((profileData as any).city ||
                          (profileData as any).stateName) && (
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-cmo-text-secondary mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {(profileData as any).city || ""}
                              {(profileData as any).stateName
                                ? `, ${(profileData as any).stateName}`
                                : ""}
                              {(profileData as any).country
                                ? `, ${typeof (profileData as any).country === "string" ? (profileData as any).country : (profileData as any).country.name}`
                                : ""}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-cmo-text-secondary">
                          <button className="flex items-center gap-1 hover:text-cmo-primary transition-colors">
                            <Users className="w-4 h-4" />
                            {(profileData as any).followersCount || 0} followers
                          </button>
                          <button className="hover:text-cmo-primary transition-colors">
                            {(profileData as any).followingCount || 0} following
                          </button>
                        </div>
                      </div>


                      {user?.uid === profileData?.uid ? (
                        // Own profile - Show Edit Profile and Share buttons
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEditProfileModal(true)}
                            data-testid="button-edit-profile"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: `${profileData.firstName} ${profileData.lastName}'s Profile`,
                                  url: window.location.href,
                                });
                              } else {
                                navigator.clipboard.writeText(
                                  window.location.href,
                                );
                                toast({
                                  title: "Link copied",
                                  description:
                                    "Profile link copied to clipboard",
                                });
                              }
                            }}
                            data-testid="button-share-profile"
                          >
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      ) : (
                        // Other user's profile - Show Message and Follow buttons
                        <div className="flex items-center gap-2 flex-shrink-0">
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
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">About</h3>
                  <p className="text-sm text-cmo-text-secondary leading-relaxed">
                    {(profileData as any).about ||
                      "Professional with expertise in the construction and civil engineering industry."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section - Show for all users */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5 text-cmo-primary" />
                    Projects
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddProject}
                    data-testid="button-add-project"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {projectsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : projects && projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className="flex gap-3 group">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-4 h-4 text-cmo-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {project.title}
                              </h4>
                              {project.location && (
                                <p className="text-cmo-text-secondary flex items-center gap-1 text-xs">
                                  <MapPin className="w-3 h-3" />
                                  {project.location}
                                </p>
                              )}
                              <p className="text-xs text-cmo-text-secondary mt-2">
                                {project.description}
                              </p>
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs px-2 py-0.5"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                                data-testid={`button-edit-project-${project.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  project.id && handleDeleteProject(project.id)
                                }
                                data-testid={`button-delete-project-${project.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-cmo-text-secondary text-center py-8">
                      No projects added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education and Experience - Only for Personal Users */}
            {(profileData as any).userType !== "business" && (
              <>
                {/* Education Section */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-cmo-primary" />
                        Education
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAddEducation}
                        data-testid="button-add-education"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {educationLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : education && education.length > 0 ? (
                        education.map((edu) => (
                          <div key={edu.id} className="flex gap-3 group">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-4 h-4 text-cmo-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {edu.degree}
                                  </h4>
                                  <p className="text-cmo-primary font-medium text-sm">
                                    {edu.fieldOfStudy}
                                  </p>
                                  <p className="text-cmo-text-secondary text-xs">
                                    {edu.schoolOrCollege}
                                  </p>
                                  <p className="text-xs text-cmo-text-secondary mt-1">
                                    {new Date(edu.startDate).getFullYear()} -{" "}
                                    {new Date(edu.endDate).getFullYear()}
                                    {edu.grade && ` • ${edu.grade}`}
                                  </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditEducation(edu)}
                                    data-testid={`button-edit-education-${edu.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      edu.id && handleDeleteEducation(edu.id)
                                    }
                                    data-testid={`button-delete-education-${edu.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-cmo-text-secondary text-center py-8">
                          No education added yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Experience Section */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-cmo-primary" />
                        Experience
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAddExperience}
                        data-testid="button-add-experience"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {experienceLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : experience && experience.length > 0 ? (
                        experience.map((exp) => (
                          <div key={exp.id} className="flex gap-3 group">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Briefcase className="w-4 h-4 text-cmo-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {exp.title}
                                  </h4>
                                  <p className="text-cmo-primary font-medium text-sm">
                                    {exp.companyName}
                                  </p>
                                  <p className="text-cmo-text-secondary flex items-center gap-1 text-xs">
                                    <MapPin className="w-3 h-3" />
                                    {exp.location}
                                  </p>
                                  <p className="text-xs text-cmo-text-secondary mt-1">
                                    {new Date(exp.startDate).getFullYear()} -{" "}
                                    {exp.isCurrent
                                      ? "Present"
                                      : new Date(exp.endDate).getFullYear()}
                                    {exp.employmentType &&
                                      ` • ${exp.employmentType}`}
                                  </p>
                                  <p className="text-xs text-cmo-text-secondary mt-2">
                                    {exp.description}
                                  </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditExperience(exp)}
                                    data-testid={`button-edit-experience-${exp.id}`}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      exp.id && handleDeleteExperience(exp.id)
                                    }
                                    data-testid={`button-delete-experience-${exp.id}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-cmo-text-secondary text-center py-8">
                          No experience added yet
                        </p>
                      )}
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
                      className={
                        activeFilter === filter ? "bg-cmo-primary" : ""
                      }
                    >
                      {filter}
                    </Button>
                  ))}
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                  {mockActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-b border-cmo-border pb-6 last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              (profileData as any).photoUrl ||
                              (profileData as any).profilePic ||
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
                          <p className="text-cmo-text-secondary mt-3">
                            {activity.content}
                          </p>

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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Thanks ({activity.engagement.thanks})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Insightful ({activity.engagement.insightful})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cmo-text-secondary hover:text-cmo-primary"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Expandable Comment Section */}
                          {expandedComments[activity.id] && (
                            <div className="mt-4 pl-4 border-l-2 border-cmo-border">
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      (profileData as any).photoUrl ||
                                      (profileData as any).profilePic ||
                                      ""
                                    }
                                  />
                                  <AvatarFallback className="text-xs">
                                    {profileData.firstName?.charAt(0) || "U"}
                                    {profileData.lastName?.charAt(0) || ""}
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
                                    className="min-h-[80px] mb-2"
                                  />
                                  <div className="flex justify-end gap-2">
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
            {/* Intro Card - Hidden on mobile since we show it at top */}
            <Card className="mb-6 hidden lg:block">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Intro</h3>
                <div className="space-y-3">
                  {(profileData as any).userType === "business" ? (
                    <>
                      {/* Business Profile Info */}
                      {(profileData as any).businessProfile?.companyName && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.companyName}
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.industry && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.industry}
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.companySize && (
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).businessProfile.companySize}{" "}
                            employees
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile
                        ?.registrationNumber && (
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            Reg:{" "}
                            {
                              (profileData as any).businessProfile
                                .registrationNumber
                            }
                          </span>
                        </div>
                      )}
                      {(profileData as any).businessProfile?.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-cmo-primary" />
                          <a
                            href={(profileData as any).businessProfile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cmo-primary hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Personal Profile Info */}
                      {((profileData as any).title ||
                        (profileData as any).positionDesignation) && (
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).title ||
                              (profileData as any).positionDesignation}
                          </span>
                        </div>
                      )}
                      {(profileData as any).company && (
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-cmo-primary" />
                          <span className="text-sm">
                            {(profileData as any).company}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common Info */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cmo-primary" />
                    <span className="text-sm">
                      Joined{" "}
                      {(profileData as any).createdTime
                        ? new Date(
                            (profileData as any).createdTime,
                          ).getFullYear()
                        : new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cmo-primary" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-medium hover:text-cmo-primary text-sm"
                      onClick={() => setShowContactInfo(!showContactInfo)}
                    >
                      {showContactInfo
                        ? profileData.email
                        : "••••••••@gmail.com"}
                    </Button>
                  </div>
                  {(profileData as any).phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-cmo-primary" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-medium hover:text-cmo-primary text-sm"
                        onClick={() => setShowContactInfo(!showContactInfo)}
                      >
                        {showContactInfo
                          ? (profileData as any).phoneNumber
                          : "••••••••••"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills Expertise - Only for Personal Profiles */}
            {(profileData as any).userType !== "business" && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Skills Expertise</h3>
                    {/* Show Edit button if no skills, + button if has skills - only on own profile */}
                    {profileData?.uid === user?.uid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSkillsModalOpen}
                        disabled={skillsLoading}
                        data-testid={
                          userSkills.length === 0
                            ? "button-add-skills"
                            : "button-edit-skills"
                        }
                        className="text-cmo-primary hover:text-cmo-primary/80"
                      >
                        {skillsLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : userSkills.length === 0 ? (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.length > 0 ? (
                      userSkills.map((skillName: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-cmo-primary/10 text-cmo-primary"
                        >
                          {skillName}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-cmo-text-secondary text-sm">
                        No skills added yet
                      </p>
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
                  {((profileData as any).languages || []).map(
                    (lang: string) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggested for You */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">
                  Suggested for You
                </h3>
                <div className="space-y-3">
                  {suggestionsLoading ? (
                    // Loading state
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-cmo-text-secondary ml-2">
                        Loading suggestions...
                      </span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((person) => (
                      <div key={person.uid} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={person.photoUrl || person.profilePic}
                          />
                          <AvatarFallback className="text-xs">
                            {(person.firstName?.[0] || "") +
                              (person.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-cmo-text-primary truncate">
                            {person.firstName} {person.lastName}
                          </p>
                          <p className="text-xs text-cmo-text-secondary truncate">
                            {person.title ||
                              person.positionDesignation ||
                              "Professional"}
                          </p>
                          <p className="text-xs text-cmo-text-secondary truncate">
                            {person.city || "Location not specified"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="text-xs px-3 py-1 h-6 bg-blue-600 hover:bg-blue-700 text-white"
                          data-testid="button-follow-suggestion"
                        >
                          Follow
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-cmo-text-secondary text-center py-4">
                      No suggestions available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Popular Filters */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-sm">Popular Filters</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-8"
                  >
                    Questions & Answers
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-8"
                  >
                    Articles & Posts
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-8"
                  >
                    Industry Updates
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-8"
                  >
                    Job Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Dialog
        open={showEditProfileModal}
        onOpenChange={setShowEditProfileModal}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditFormSubmit} className="space-y-4">
            {(profileData as any)?.userType === "business" ? (
              // Business Profile Fields
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={editFormData.companyName}
                    onChange={(e) =>
                      handleEditFormChange("companyName", e.target.value)
                    }
                    placeholder="Enter company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <SelectUI
                      value={editFormData.industry}
                      onValueChange={(value) =>
                        handleEditFormChange("industry", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Construction">
                          Construction
                        </SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Architecture">
                          Architecture
                        </SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </SelectUI>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type</Label>
                    <SelectUI
                      value={editFormData.companyType}
                      onValueChange={(value) =>
                        handleEditFormChange("companyType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Limited">
                          Private Limited
                        </SelectItem>
                        <SelectItem value="Public Limited">
                          Public Limited
                        </SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">
                          Sole Proprietorship
                        </SelectItem>
                        <SelectItem value="LLP">LLP</SelectItem>
                      </SelectContent>
                    </SelectUI>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description}
                    onChange={(e) =>
                      handleEditFormChange("description", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleEditFormChange("addressLine1", e.target.value)
                      }
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      value={editFormData.addressLine2}
                      onChange={(e) =>
                        handleEditFormChange("addressLine2", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleEditFormChange("country", e.target.value)
                      }
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateName">State</Label>
                    <Input
                      id="stateName"
                      value={editFormData.stateName}
                      onChange={(e) =>
                        handleEditFormChange("stateName", e.target.value)
                      }
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editFormData.city}
                      onChange={(e) =>
                        handleEditFormChange("city", e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={editFormData.pincode}
                      onChange={(e) =>
                        handleEditFormChange("pincode", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleEditFormChange("website", e.target.value)
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">
                      Registration Number
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={editFormData.registrationNumber}
                      onChange={(e) =>
                        handleEditFormChange(
                          "registrationNumber",
                          e.target.value,
                        )
                      }
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <SelectUI
                    value={editFormData.companySize}
                    onValueChange={(value) =>
                      handleEditFormChange("companySize", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">
                        501-1000 employees
                      </SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </SelectUI>
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
                      onChange={(e) =>
                        handleEditFormChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editFormData.lastName}
                      onChange={(e) =>
                        handleEditFormChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={editFormData.title}
                    onChange={(e) =>
                      handleEditFormChange("title", e.target.value)
                    }
                    placeholder="Enter your job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="positionDesignation">
                    Position/Designation
                  </Label>
                  <Input
                    id="positionDesignation"
                    value={editFormData.positionDesignation}
                    onChange={(e) =>
                      handleEditFormChange(
                        "positionDesignation",
                        e.target.value,
                      )
                    }
                    placeholder="Enter your position or designation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input
                    id="currentCompany"
                    value={editFormData.currentCompany}
                    onChange={(e) =>
                      handleEditFormChange("currentCompany", e.target.value)
                    }
                    placeholder="Enter your current company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={editFormData.about}
                    onChange={(e) =>
                      handleEditFormChange("about", e.target.value)
                    }
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <SelectUI
                      value={editFormData.gender}
                      onValueChange={(value) =>
                        handleEditFormChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </SelectUI>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editFormData.dateOfBirth}
                      onChange={(e) =>
                        handleEditFormChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editFormData.city}
                      onChange={(e) =>
                        handleEditFormChange("city", e.target.value)
                      }
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateName">State</Label>
                    <Input
                      id="stateName"
                      value={editFormData.stateName}
                      onChange={(e) =>
                        handleEditFormChange("stateName", e.target.value)
                      }
                      placeholder="Enter your state"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editFormData.country}
                      onChange={(e) =>
                        handleEditFormChange("country", e.target.value)
                      }
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
                {editFormLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog open={showEducationModal} onOpenChange={setShowEducationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEducation();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={educationFormData.degree}
                  onChange={(e) =>
                    setEducationFormData({
                      ...educationFormData,
                      degree: e.target.value,
                    })
                  }
                  placeholder="e.g., Bachelor's, Master's, MBA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  value={educationFormData.fieldOfStudy}
                  onChange={(e) =>
                    setEducationFormData({
                      ...educationFormData,
                      fieldOfStudy: e.target.value,
                    })
                  }
                  placeholder="e.g., Computer Science, Business"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolOrCollege">School/College</Label>
              <Input
                id="schoolOrCollege"
                value={educationFormData.schoolOrCollege}
                onChange={(e) =>
                  setEducationFormData({
                    ...educationFormData,
                    schoolOrCollege: e.target.value,
                  })
                }
                placeholder="e.g., Harvard University"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={educationFormData.startDate}
                  onChange={(e) =>
                    setEducationFormData({
                      ...educationFormData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={educationFormData.endDate}
                  onChange={(e) =>
                    setEducationFormData({
                      ...educationFormData,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={educationFormData.grade}
                  onChange={(e) =>
                    setEducationFormData({
                      ...educationFormData,
                      grade: e.target.value,
                    })
                  }
                  placeholder="e.g., First Class, 3.8 GPA"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEducationModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editFormLoading}>
                {editFormLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingEducation ? "Update" : "Add"} Education
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Experience Modal */}
      <Dialog open={showExperienceModal} onOpenChange={setShowExperienceModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveExperience();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expCompanyName">Company Name</Label>
                <Input
                  id="expCompanyName"
                  value={experienceFormData.companyName}
                  onChange={(e) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="e.g., Google, Microsoft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expTitle">Job Title</Label>
                <Input
                  id="expTitle"
                  value={experienceFormData.title}
                  onChange={(e) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Software Engineer, Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <SelectUI
                  value={experienceFormData.employmentType}
                  onValueChange={(value) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      employmentType: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </SelectUI>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expLocation">Location</Label>
                <Input
                  id="expLocation"
                  value={experienceFormData.location}
                  onChange={(e) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expStartDate">Start Date</Label>
                <Input
                  id="expStartDate"
                  type="date"
                  value={experienceFormData.startDate}
                  onChange={(e) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expEndDate">End Date</Label>
                <Input
                  id="expEndDate"
                  type="date"
                  value={experienceFormData.endDate}
                  onChange={(e) =>
                    setExperienceFormData({
                      ...experienceFormData,
                      endDate: e.target.value,
                      isCurrent: false,
                    })
                  }
                  disabled={experienceFormData.isCurrent}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={experienceFormData.isCurrent}
                onChange={(e) =>
                  setExperienceFormData({
                    ...experienceFormData,
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? "" : experienceFormData.endDate,
                  })
                }
              />
              <Label htmlFor="isCurrent">I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expDescription">Description</Label>
              <Textarea
                id="expDescription"
                value={experienceFormData.description}
                onChange={(e) =>
                  setExperienceFormData({
                    ...experienceFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your responsibilities and achievements"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowExperienceModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editFormLoading}>
                {editFormLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingExperience ? "Update" : "Add"} Experience
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Projects Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProject();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                value={projectFormData.title}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., E-commerce Website, Mobile App"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                value={projectFormData.description}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the project, technologies used, and your role"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectLocation">Location (Optional)</Label>
              <Input
                id="projectLocation"
                value={projectFormData.location || ""}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    location: e.target.value,
                  })
                }
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTags">Tags (Optional)</Label>
              <Input
                id="projectTags"
                value={(projectFormData.tags || []).join(", ")}
                onChange={(e) =>
                  setProjectFormData({
                    ...projectFormData,
                    tags: e.target.value
                      ? e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag !== "")
                      : [],
                  })
                }
                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
              />
            </div>

            {!editingProject && (
              <div className="space-y-2">
                <Label htmlFor="projectImages">Project Images (Optional)</Label>
                <Input
                  id="projectImages"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setProjectImages(Array.from(e.target.files || []))
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProjectModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editFormLoading}>
                {editFormLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingProject ? "Update" : "Add"} Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Skills Modal */}
      <Dialog open={skillsModalOpen} onOpenChange={setSkillsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Skills</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select your skills</Label>
              <Select
                isMulti
                isSearchable
                options={allSkills.map((skill) => ({
                  value: skill.id,
                  label: skill.name,
                }))}
                value={selectedSkills}
                onChange={(newValue) => setSelectedSkills(newValue as any)}
                className="mt-2"
                placeholder="Search and select skills..."
                noOptionsMessage={() => "No skills found"}
                isLoading={skillsLoading}
                data-testid="select-skills"
                classNames={{
                  control: () =>
                    "border border-gray-300 rounded-md min-h-[40px]",
                  multiValue: () =>
                    "bg-cmo-primary/10 text-cmo-primary rounded-sm",
                  multiValueLabel: () => "text-cmo-primary",
                  multiValueRemove: () => "text-cmo-primary hover:text-red-500",
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSkillsModalOpen(false)}
                disabled={skillsSaving}
                data-testid="button-cancel-skills"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSkillsSave}
                disabled={skillsSaving}
                data-testid="button-save-skills"
              >
                {skillsSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

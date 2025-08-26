import { auth } from "./firebase";

// Direct external API URL - call the backend service directly
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cp-backend-service-test-972540571952.asia-south1.run.app';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  hasBasicInfo: boolean;
  verified?: boolean;
  phoneNumber?: string;
  title?: string;
  positionDesignation?: string;
  currentCompany?: string;
  about?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  state?:
    | string
    | {
        code: string;
        name: string;
      };
  country?:
    | string
    | {
        code: string;
        name: string;
      };
  photoUrl?: string;
  bannerUrl?: string;
  userType?: string;
  organizationName?: string;
  isActive?: boolean;
  createdTime?: string;
  updatedTime?: string;
  // Legacy fields for backward compatibility
  profilePic?: string;
  bannerPic?: string;
  createdAt?: string;
  updatedAt?: string;
  followingCount?: number;
  followersCount?: number;
  followerlist?: string[];
}

export interface UpdateUserData {
  userType?: "personal" | "business";
  phoneNumber?: string;
  title?: string;
  positionDesignation?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  state?: { name: string; code: string };
  country?: { name: string; code: string };
  company?: string;
  companyName?: string;
  industry?: string;
  companyType?: string;
  description?: string;
  address?: string;
  pincode?: string;
  website?: string;
  registrationNumber?: string;
  companySize?: string;
  hasBasicInfo?: boolean;
  profilePic?: File | string;
  bannerPic?: File | string;
}

// Types for Education, Experience, and Projects
export interface Education {
  id?: string;
  degree: string;
  fieldOfStudy: string;
  schoolOrCollege: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Experience {
  id?: string;
  companyName: string;
  title: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  location?: string;
  tags?: string[];
  imageURLs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

class UserApiService {
  private userCache: UserProfile | null = null;
  private cacheTimestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async getAuthHeaders(): Promise<{ Authorization: string }> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken(true); // Force refresh
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private isCacheValid(): boolean {
    return (
      this.userCache !== null &&
      this.cacheTimestamp !== null &&
      Date.now() - this.cacheTimestamp < this.CACHE_DURATION
    );
  }

  async getCurrentUser(forceRefresh: boolean = false): Promise<UserProfile> {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid()) {
      return this.userCache!;
    }

    try {
      const headers = await this.getAuthHeaders();
      console.log("Making request to:", `${API_BASE_URL}/users/me`);
      console.log("With headers:", headers);

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        mode: "cors",
        credentials: "omit",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.status === 401) {
        // Token expired or invalid
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user data: ${response.status} ${response.statusText}`,
        );
      }

      const userData: UserProfile = await response.json();

      // Update cache
      this.userCache = userData;
      this.cacheTimestamp = Date.now();

      return userData;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  async updateUser(
    uid: string,
    userData: UpdateUserData,
  ): Promise<UserProfile> {
    try {
      const headers = await this.getAuthHeaders();

      // Create FormData for multipart request
      const formData = new FormData();

      // Add all fields to FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: "PUT",
        headers, // Don't set Content-Type header - browser will set it with boundary
        body: formData,
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update user: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const updatedUser: UserProfile = await response.json();

      // Update cache with new data
      this.userCache = updatedUser;
      this.cacheTimestamp = Date.now();

      return updatedUser;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error updating user:", error);
      throw new Error("Failed to update user profile");
    }
  }

  clearCache(): void {
    this.userCache = null;
    this.cacheTimestamp = null;
  }

  async getUserByUid(uid: string): Promise<UserProfile> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (response.status === 404) {
        throw new Error("USER_NOT_FOUND");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user: ${response.status} ${response.statusText}`,
        );
      }

      const userData: UserProfile = await response.json();
      return userData;
    } catch (error: any) {
      if (
        error.message === "AUTH_EXPIRED" ||
        error.message === "USER_NOT_FOUND"
      ) {
        throw error;
      }
      console.error("Error fetching user by uid:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  async getChatUserInfo(uid: string): Promise<{
    uid: string;
    firstName: string;
    lastName: string;
    title?: string;
    positionDesignation?: string;
    photoUrl?: string;
    username?: string;
  }> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/chatinfo/${uid}`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (response.status === 404) {
        throw new Error("USER_NOT_FOUND");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch chat user info: ${response.status} ${response.statusText}`,
        );
      }

      const userData = await response.json();
      return userData;
    } catch (error: any) {
      if (
        error.message === "AUTH_EXPIRED" ||
        error.message === "USER_NOT_FOUND"
      ) {
        throw error;
      }
      console.error("Error fetching chat user info:", error);
      throw new Error("Failed to fetch chat user info");
    }
  }

  async searchUsersByUsername(username: string): Promise<UserProfile[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/users/search?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "omit",
        },
      );

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to search users: ${response.status} ${response.statusText}`,
        );
      }

      const users: UserProfile[] = await response.json();
      return users;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error searching users:", error);
      throw new Error("Failed to search users");
    }
  }

  async followUser(targetUid: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/users/follow?targetUid=${targetUid}`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to follow user: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error following user:", error);
      throw new Error("Failed to follow user");
    }
  }

  async unfollowUser(targetUid: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(
        `${API_BASE_URL}/users/unfollow?targetUid=${targetUid}`,
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to unfollow user: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error unfollowing user:", error);
      throw new Error("Failed to unfollow user");
    }
  }

  async getUserFollowers(uid: string): Promise<UserProfile[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/${uid}/followers`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch followers: ${response.status} ${response.statusText}`,
        );
      }

      const followers: UserProfile[] = await response.json();
      return followers;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching followers:", error);
      throw new Error("Failed to fetch followers");
    }
  }

  async getUserFollowing(uid: string): Promise<UserProfile[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/${uid}/following`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch following: ${response.status} ${response.statusText}`,
        );
      }

      const following: UserProfile[] = await response.json();
      return following;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching following:", error);
      throw new Error("Failed to fetch following");
    }
  }

  // Education Methods
  async getUserEducation(uid: string): Promise<Education[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/education`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch education: ${response.status}`);
      }

      const education: Education[] = await response.json();
      return education;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching education:", error);
      throw new Error("Failed to fetch education");
    }
  }

  async addEducation(uid: string, education: Omit<Education, 'id'>): Promise<Education> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/education`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to add education: ${response.status}`);
      }

      const newEducation: Education = await response.json();
      return newEducation;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error adding education:", error);
      throw new Error("Failed to add education");
    }
  }

  async updateEducation(uid: string, docId: string, education: Omit<Education, 'id'>): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/education/${docId}`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to update education: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error updating education:", error);
      throw new Error("Failed to update education");
    }
  }

  async deleteEducation(uid: string, docId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/education/${docId}`, {
        method: "DELETE",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to delete education: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error deleting education:", error);
      throw new Error("Failed to delete education");
    }
  }

  // Experience Methods
  async getUserExperience(uid: string): Promise<Experience[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/experience`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch experience: ${response.status}`);
      }

      const experience: Experience[] = await response.json();
      return experience;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching experience:", error);
      throw new Error("Failed to fetch experience");
    }
  }

  async addExperience(uid: string, experience: Omit<Experience, 'id'>): Promise<Experience> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/experience`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experience),
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to add experience: ${response.status}`);
      }

      const newExperience: Experience = await response.json();
      return newExperience;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error adding experience:", error);
      throw new Error("Failed to add experience");
    }
  }

  async updateExperience(uid: string, docId: string, experience: Omit<Experience, 'id'>): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/experience/${docId}`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experience),
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to update experience: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error updating experience:", error);
      throw new Error("Failed to update experience");
    }
  }

  async deleteExperience(uid: string, docId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/experience/${docId}`, {
        method: "DELETE",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to delete experience: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error deleting experience:", error);
      throw new Error("Failed to delete experience");
    }
  }

  // Projects Methods
  async getUserProjects(uid: string): Promise<Project[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/projects`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const projects: Project[] = await response.json();
      return projects;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  async addProject(uid: string, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'imageURLs'>, images?: File[]): Promise<Project> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Use multipart/form-data for project creation with images
      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('description', project.description);
      if (project.location) formData.append('location', project.location);
      
      if (project.tags) {
        project.tags.forEach(tag => formData.append('tags[]', tag));
      }
      
      if (images) {
        images.forEach(image => formData.append('images', image));
      }

      const response = await fetch(`${API_BASE_URL}/users/${uid}/projects`, {
        method: "POST",
        headers: {
          Authorization: headers.Authorization,
        },
        body: formData,
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to add project: ${response.status}`);
      }

      const newProject: Project = await response.json();
      return newProject;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error adding project:", error);
      throw new Error("Failed to add project");
    }
  }

  async updateProject(uid: string, projectId: string, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/projects/${projectId}`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  }

  async deleteProject(uid: string, projectId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${uid}/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }

  // Skills API methods
  async getAllSkills(): Promise<{ id: string; name: string }[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`,
        );
      }

      const skills = await response.json();
      return skills;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching skills:", error);
      throw new Error("Failed to fetch skills");
    }
  }

  async getUserSkills(uid: string): Promise<{skillIds: string[], skills: {skillId: string, name: string}[]}> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/${uid}/skills`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user skills: ${response.status} ${response.statusText}`,
        );
      }

      const skillsData = await response.json();
      return skillsData;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching user skills:", error);
      throw new Error("Failed to fetch user skills");
    }
  }

  async updateUserSkills(uid: string, skillIds: string[]): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/${uid}/skills`, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
        body: JSON.stringify({ skillIds }),
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to update user skills: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error updating user skills:", error);
      throw new Error("Failed to update user skills");
    }
  }

  async getUserSuggestions(): Promise<UserProfile[]> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/users/suggestions/short`, {
        method: "GET",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (response.status === 401) {
        throw new Error("AUTH_EXPIRED");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user suggestions: ${response.status} ${response.statusText}`,
        );
      }

      const suggestions = await response.json();
      return suggestions;
    } catch (error: any) {
      if (error.message === "AUTH_EXPIRED") {
        throw error;
      }
      console.error("Error fetching user suggestions:", error);
      throw new Error("Failed to fetch user suggestions");
    }
  }
}

export const userApiService = new UserApiService();

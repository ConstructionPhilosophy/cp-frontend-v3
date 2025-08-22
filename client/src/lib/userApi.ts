import { auth } from './firebase';

const API_BASE_URL = 'https://cp-backend-service-test-972540571952.asia-south1.run.app';

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
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  state?: {
    code: string;
    name: string;
  };
  country?: {
    code: string;
    name: string;
  };
  photoUrl?: string;
  bannerUrl?: string;
  userType?: string;
  isActive?: boolean;
  createdTime?: string;
  updatedTime?: string;
  // Legacy fields for backward compatibility
  profilePic?: string;
  bannerPic?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserData {
  userType?: 'personal' | 'business';
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

class UserApiService {
  private userCache: UserProfile | null = null;
  private cacheTimestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async getAuthHeaders(): Promise<{ Authorization: string }> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const token = await user.getIdToken(true); // Force refresh
    return {
      Authorization: `Bearer ${token}`
    };
  }

  private isCacheValid(): boolean {
    return this.userCache !== null && 
           this.cacheTimestamp !== null && 
           Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  async getCurrentUser(forceRefresh: boolean = false): Promise<UserProfile> {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid()) {
      return this.userCache!;
    }

    try {
      const headers = await this.getAuthHeaders();
      console.log('Making request to:', `${API_BASE_URL}/users/me`);
      console.log('With headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors',
        credentials: 'omit',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.status === 401) {
        // Token expired or invalid
        throw new Error('AUTH_EXPIRED');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
      }

      const userData: UserProfile = await response.json();
      
      // Update cache
      this.userCache = userData;
      this.cacheTimestamp = Date.now();
      
      return userData;
    } catch (error: any) {
      if (error.message === 'AUTH_EXPIRED') {
        throw error;
      }
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async updateUser(uid: string, userData: UpdateUserData): Promise<UserProfile> {
    try {
      const headers = await this.getAuthHeaders();
      
      // Create FormData for multipart request
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/users/${uid}`, {
        method: 'PUT',
        headers, // Don't set Content-Type header - browser will set it with boundary
        body: formData,
      });

      if (response.status === 401) {
        throw new Error('AUTH_EXPIRED');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const updatedUser: UserProfile = await response.json();
      
      // Update cache with new data
      this.userCache = updatedUser;
      this.cacheTimestamp = Date.now();
      
      return updatedUser;
    } catch (error: any) {
      if (error.message === 'AUTH_EXPIRED') {
        throw error;
      }
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
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
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (response.status === 401) {
        throw new Error('AUTH_EXPIRED');
      }

      if (response.status === 404) {
        throw new Error('USER_NOT_FOUND');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }

      const userData: UserProfile = await response.json();
      return userData;
    } catch (error: any) {
      if (error.message === 'AUTH_EXPIRED' || error.message === 'USER_NOT_FOUND') {
        throw error;
      }
      console.error('Error fetching user by uid:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async searchUsersByUsername(username: string): Promise<UserProfile[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/users/search?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
      });

      if (response.status === 401) {
        throw new Error('AUTH_EXPIRED');
      }

      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status} ${response.statusText}`);
      }

      const users: UserProfile[] = await response.json();
      return users;
    } catch (error: any) {
      if (error.message === 'AUTH_EXPIRED') {
        throw error;
      }
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
}

export const userApiService = new UserApiService();
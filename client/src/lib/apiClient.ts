// Smart API client that automatically detects backend availability
// and falls back to direct external API calls when needed

// Import external API endpoints - hardcoded here to avoid path issues in client
const API_ENDPOINTS = {
  GEO_COUNTRIES: 'https://geo-api-230500065838.asia-south1.run.app/countries',
  GEO_STATES: 'https://geo-api-230500065838.asia-south1.run.app/states',
  GEO_CITIES: 'https://geo-api-230500065838.asia-south1.run.app/cities',
};

class ApiClient {
  private backendAvailable: boolean | null = null;
  private checkedBackend: boolean = false;

  // Check if backend server is available
  private async checkBackendHealth(): Promise<boolean> {
    if (this.checkedBackend) {
      return this.backendAvailable!;
    }

    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        timeout: 3000, // Quick timeout
      } as any);
      
      this.backendAvailable = response.ok;
      this.checkedBackend = true;
      
      if (this.backendAvailable) {
        console.log('✅ Backend server detected - using local API endpoints');
      } else {
        console.log('⚠️ Backend server not available - using direct external API calls');
      }
      
      return this.backendAvailable;
    } catch (error) {
      console.log('⚠️ Backend server not available - using direct external API calls');
      this.backendAvailable = false;
      this.checkedBackend = true;
      return false;
    }
  }

  // Smart fetch that chooses the right endpoint
  async smartFetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const isBackendAvailable = await this.checkBackendHealth();

    if (isBackendAvailable) {
      // Use local backend API
      return fetch(endpoint, options);
    } else {
      // Use direct external API calls
      const externalUrl = this.mapToExternalUrl(endpoint);
      if (externalUrl) {
        return fetch(externalUrl, options);
      } else {
        throw new Error(`No external URL mapping found for ${endpoint}`);
      }
    }
  }

  // Map local API endpoints to external URLs
  private mapToExternalUrl(endpoint: string): string | null {
    if (endpoint === '/api/countries') {
      return API_ENDPOINTS.GEO_COUNTRIES;
    } else if (endpoint.startsWith('/api/states')) {
      const url = new URL(`http://dummy.com${endpoint}`);
      const countryCode = url.searchParams.get('country_code');
      return `${API_ENDPOINTS.GEO_STATES}?country_code=${countryCode}`;
    } else if (endpoint.startsWith('/api/cities')) {
      const url = new URL(`http://dummy.com${endpoint}`);
      const countryCode = url.searchParams.get('country_code');
      const stateCode = url.searchParams.get('state_code');
      return `${API_ENDPOINTS.GEO_CITIES}?country_code=${countryCode}&state_code=${stateCode}`;
    }
    
    return null;
  }

  // Reset backend check (useful for development)
  resetBackendCheck(): void {
    this.checkedBackend = false;
    this.backendAvailable = null;
  }
}

export const apiClient = new ApiClient();
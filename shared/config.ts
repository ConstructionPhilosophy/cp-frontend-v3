// External API Configuration
// All external API endpoints and constants are centralized here for easy maintenance

export const API_ENDPOINTS = {
  // Geo Location APIs (Custom API)
  GEO_COUNTRIES: 'https://geo-api-230500065838.asia-south1.run.app/countries',
  GEO_STATES: 'https://geo-api-230500065838.asia-south1.run.app/states',
  GEO_CITIES: 'https://geo-api-230500065838.asia-south1.run.app/cities',
  
  // Add other external APIs here as needed
  // EXAMPLE_API: 'https://api.example.com/v1',
} as const;

export const API_HEADERS = {
  COUNTRY_STATE_CITY: {
    'X-CSCAPI-KEY': 'YOUR_API_KEY_HERE', // Replace with actual API key if needed
    'Content-Type': 'application/json',
  },
} as const;

export const CONSTANTS = {
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  
  // Form validation
  MIN_AGE: 13,
  MIN_YEAR: 1950,
  
  // Phone number
  MAX_PHONE_DIGITS: 15,
  
  // API timeouts
  REQUEST_TIMEOUT: 10000, // 10 seconds
  
} as const;

// Helper function to build API URLs
export const buildApiUrl = {
  countries: () => API_ENDPOINTS.GEO_COUNTRIES,
  states: (countryCode: string) => `${API_ENDPOINTS.GEO_STATES}?country_code=${countryCode}`,
  cities: (countryCode: string, stateCode: string) => 
    `${API_ENDPOINTS.GEO_CITIES}?country_code=${countryCode}&state_code=${stateCode}`,
} as const;
// API configuration for different environments
const getApiUrl = () => {
  // Check for environment variable first (works in both dev and production)
  const envApiUrl = process.env.API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envApiUrl) {
    console.log('🌐 Using API URL from environment:', envApiUrl);
    return envApiUrl;
  }
  
  // Fallback to local development URLs if no env var is set
  if (__DEV__) {
    console.log('🛠️ Development mode - using local backend');
    if (Platform.OS === 'android') {
      // Android emulator uses special IP for localhost
      return 'http://10.0.2.2:5000';
    } else if (Platform.OS === 'ios') {
      // For iOS physical device, you need your computer's IP address
      // For iOS simulator, localhost works
      // Your computer's IP address is: 192.168.0.116
      
      // Since you're using a physical iOS device, use your computer's IP
      return 'http://192.168.0.116:5000';
      
      // If you switch back to simulator, uncomment this line instead:
      // return 'http://localhost:5000';
    } else {
      // Web/other platforms
      return 'http://localhost:5000';
    }
  }
  
  // Production fallback (should not reach here if env var is set)
  console.warn('⚠️ No API_BASE_URL found in environment, using production fallback');
  return 'https://kelp-backend.onrender.com';
};

import { Platform } from 'react-native';

export const API_URL = getApiUrl();

// Log the API URL being used for debugging
console.log('🌐 API Configuration Loaded:');
console.log(`📍 API_URL: ${API_URL}`);
console.log(`📱 Platform: ${Platform.OS}`);
console.log(`🛠️ Dev Mode: ${__DEV__}`);
console.log(`🌍 Environment API_BASE_URL:`, process.env.API_BASE_URL);
console.log(`🌍 Environment EXPO_PUBLIC_API_BASE_URL:`, process.env.EXPO_PUBLIC_API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  USER: {
    UPDATE_INTERESTS: '/api/user/interests',
    PROFILE: '/api/user/profile',
  },
} as const;

// HTTP client configuration
export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    
    console.log(`🌐 Making API request to: ${url}`);
    console.log(`📱 Platform: ${Platform.OS}`);
    console.log(`🌐 API_URL: ${API_URL}`);
    console.log(`📤 Request method: ${options.method || 'GET'}`);
    console.log(`📤 Request headers:`, options.headers);
    console.log(`📤 Request body:`, options.body);
    
    try {
      // iOS specific fetch configuration for better network handling
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'React-Native-App/1.0',
        // Add cache control for iOS
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      };
      
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        // Remove timeout for iOS - use AbortController instead
        ...options,
      };
      
      // Remove timeout from options as it's not standard
      delete fetchOptions.timeout;
      
      // Create AbortController for timeout handling (iOS compatible)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30 second timeout for slower connections
      
      fetchOptions.signal = controller.signal;
      
      console.log(`🔄 Fetch options:`, JSON.stringify(fetchOptions, null, 2));
      
      const response = await fetch(url, fetchOptions);
      
      clearTimeout(timeoutId);

      console.log(`📥 Response status: ${response.status} ${response.statusText}`);
      console.log(`📥 Response headers:`, response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        
        // Log full error details for debugging
        if (response.status !== 404) {
          console.error(`❌ API Error (${response.status}):`, errorMessage);
          console.error(`❌ Full error response:`, errorData);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      // Only log network errors, not expected 404s for missing endpoints
      if (!error.message.includes('HTTP 404')) {
        console.error(`❌ API request failed for ${endpoint}:`, error);
        console.error(`❌ Error type: ${error.constructor.name}`);
        console.error(`❌ Error message: ${error.message}`);
      }
      
      // Provide more specific error messages for iOS
      if (error.message === 'Network request failed' || error.name === 'TypeError') {
        throw new Error(`Cannot connect to backend at ${url}. Possible issues:\n1. iOS Network Security - Check Info.plist for NSAllowsArbitraryLoads\n2. Slow internet - Backend may be cold starting on Render.com\n3. Network connectivity - Try switching between WiFi/Cellular\n4. CORS issue - Backend needs proper CORS headers for mobile`);
      } else if (error.name === 'AbortError') {
        throw new Error(`Request timeout - Backend at ${url} is taking too long to respond. This often happens when Render.com is cold starting. Please wait 30 seconds and try again.`);
      }
      
      throw error;
    }
  },

  async get(endpoint: string, token?: string) {
    const options: RequestInit = {
      method: 'GET',
    };
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.request(endpoint, options);
  },

  async post(endpoint: string, data: any, token?: string) {
    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify(data),
    };
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.request(endpoint, options);
  },

  async put(endpoint: string, data: any, token?: string) {
    const options: RequestInit = {
      method: 'PUT',
      body: JSON.stringify(data),
    };
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.request(endpoint, options);
  },

  async delete(endpoint: string, token?: string) {
    const options: RequestInit = {
      method: 'DELETE',
    };
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.request(endpoint, options);
  },
};
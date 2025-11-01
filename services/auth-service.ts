import { apiClient, API_ENDPOINTS } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: boolean;
  supabaseId?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
  requiresVerification?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      this.token = token;
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  }

  private async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔑 Attempting login to backend:', loginData.email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: loginData.email,
        password: loginData.password,
      });

      // Handle Supabase Auth response format
      if (response.data?.session?.access_token && response.data?.user) {
        console.log('🔑 Supabase login successful - processing session');
        
        const supabaseUser = response.data.user;
        const accessToken = response.data.session.access_token;
        
        // Create user object from Supabase user data
        const user = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || 'User', // Use metadata name or default
          email: supabaseUser.email,
          interests: [],
          createdAt: supabaseUser.created_at || new Date().toISOString(),
          updatedAt: supabaseUser.updated_at || new Date().toISOString(),
          emailVerified: supabaseUser.email_confirmed_at ? true : false,
          supabaseId: supabaseUser.id,
        };
        
        await this.saveToken(accessToken);
        await AsyncStorage.setItem('userToken', JSON.stringify(user));
        
        console.log('✅ Login successful:', user.email);
        return {
          success: true,
          user: user,
          token: accessToken,
        };
      }

      // Handle traditional response format (success + token) - fallback
      if (response.success && response.token) {
        // Create user object for login (backend doesn't return user details)
        const user = {
          id: response.userId || Date.now().toString(),
          name: 'User', // Default name since backend doesn't store it
          email: loginData.email,
          interests: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await this.saveToken(response.token);
        await AsyncStorage.setItem('userToken', JSON.stringify(user));
        
        console.log('✅ Login successful:', user.email);
        return {
          success: true,
          user: user,
          token: response.token,
        };
      }

      // If we reach here, the response format is unexpected
      console.log('❌ Unexpected response format:', response);
      return {
        success: false,
        error: response.message || response.error || 'Login failed - unexpected response format',
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Extract meaningful error message for better UX
      let errorMessage = 'Network error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Email not confirmed')) {
          errorMessage = '📧 Please verify your email first! Check your inbox and click the verification link, then try logging in again.';
        } else if (error.message.includes('missing email or phone')) {
          errorMessage = 'Invalid login request format. Please try again.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Login request error. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      console.log('📝 Starting signup with backend API...');
      console.log('📝 Starting signup process for:', signupData.email);

      // Validate password confirmation on client side
      if (signupData.password !== signupData.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match',
        };
      }

      console.log('📝 Attempting signup to backend:', signupData.email);
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, {
        email: signupData.email,
        password: signupData.password,
      });

      console.log('📝 Raw backend response:', response);

      // Handle Supabase Auth response format
      if (response.message && response.message.includes('Verification email sent')) {
        console.log('📧 Supabase verification email sent - handling as success');
        
        // Extract user data from Supabase response
        const supabaseUser = response.data?.user;
        if (supabaseUser) {
          const user = {
            id: supabaseUser.id,
            name: signupData.name, // Use name from form
            email: signupData.email,
            interests: [],
            createdAt: supabaseUser.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: false, // Supabase requires email verification
            supabaseId: supabaseUser.id,
          };
          
          // For Supabase, we don't get a token immediately
          // Store user data and indicate verification is needed
          await AsyncStorage.setItem('userToken', JSON.stringify(user));
          
          console.log('✅ Signup successful - verification email sent:', user.email);
          return {
            success: true,
            user: user,
            message: 'Please check your email and click the verification link to complete signup.',
          };
        }
      }

      // Handle traditional response format (success + token)
      if (response.success && response.token) {
        const user = {
          id: response.userId || Date.now().toString(),
          name: signupData.name,
          email: signupData.email,
          interests: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await this.saveToken(response.token);
        await AsyncStorage.setItem('userToken', JSON.stringify(user));
        
        console.log('✅ Signup successful with token:', user.email);
        return {
          success: true,
          user: user,
          token: response.token,
        };
      }

      // Handle error responses
      const errorMessage = response.error || response.message || 'Signup failed';
      console.log('❌ Signup failed:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } catch (error) {
      console.error('❌ Signup error:', error);
      
      // No fallback - force real backend usage
      console.log('❌ Backend connection failed - please check your backend is running');
      console.log('❌ Make sure your backend is accessible at: https://kelp-backend.onrender.com');
      console.log('❌ And has the auth endpoints: /api/auth/login, /api/auth/signup');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out...');
      
      // Try to notify backend about logout
      if (this.token) {
        try {
          await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, this.token);
        } catch (error) {
          console.warn('Backend logout failed, continuing with local logout:', error);
        }
      }

      // Clear local storage
      await this.removeToken();
      await AsyncStorage.multiRemove(['userToken', 'hasCompletedOnboarding']);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  async updateUserInterests(interests: string[]): Promise<AuthResponse> {
    try {
      console.log('🎯 Updating user interests:', interests);
      
      if (!this.token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await apiClient.put(
        API_ENDPOINTS.USER.UPDATE_INTERESTS,
        { interests },
        this.token
      );

      if (response.user) {
        await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
        console.log('✅ Interests updated successfully');
        return {
          success: true,
          user: response.user,
        };
      }

      return {
        success: false,
        error: response.message || 'Failed to update interests',
      };
    } catch (error) {
      console.error('❌ Update interests error:', error);
      
      // Check if it's a network/backend issue
      if (error instanceof Error && (
        error.message.includes('Network request failed') || 
        error.message.includes('Cannot connect to backend') ||
        error.message.includes('404') ||
        error.message.includes('HTTP 404')
      )) {
        console.log('🔄 Backend not ready, updating interests locally');
        
        // Get current user from storage and update interests locally
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          if (userToken) {
            const user = JSON.parse(userToken);
            const updatedUser = { 
              ...user, 
              interests, 
              updatedAt: new Date().toISOString() 
            };
            
            await AsyncStorage.setItem('userToken', JSON.stringify(updatedUser));
            
            return {
              success: true,
              user: updatedUser,
            };
          }
        } catch (storageError) {
          console.error('❌ Local storage update failed:', storageError);
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  async refreshUserProfile(): Promise<AuthResponse> {
    try {
      if (!this.token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, this.token);

      if (response.user) {
        await AsyncStorage.setItem('userToken', JSON.stringify(response.user));
        return {
          success: true,
          user: response.user,
        };
      }

      return {
        success: false,
        error: 'Failed to refresh profile',
      };
    } catch (error) {
      console.error('❌ Refresh profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
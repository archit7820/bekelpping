import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User } from '@/services/auth-service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    hasCompletedOnboarding: false,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [userToken, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('hasCompletedOnboarding'),
      ]);

      setAuthState({
        user: userToken ? JSON.parse(userToken) : null,
        isAuthenticated: !!userToken,
        isLoading: false,
        hasCompletedOnboarding: onboardingStatus === 'true',
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        hasCompletedOnboarding: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Starting login process for:', email);
      
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        setAuthState(prev => ({
          ...prev,
          user: result.user!,
          isAuthenticated: true,
        }));
        
        console.log('✅ Login successful, user authenticated');
        return { success: true };
      } else {
        console.log('❌ Login failed:', result.error);
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      console.log('📝 Starting signup process for:', email);
      
      const result = await authService.signup({ name, email, password, confirmPassword });
      
      if (result.success) {
        if (result.user) {
          // Update auth state with user info
          setAuthState(prev => ({
            ...prev,
            user: result.user!,
            isAuthenticated: true,
          }));
          
          console.log('✅ Signup successful, user authenticated');
        }
        
        // Return full result including message for verification flows
        return { 
          success: true, 
          message: result.message,
          requiresVerification: result.message?.includes('verification')
        };
      } else {
        console.log('❌ Signup failed:', result.error);
        return { success: false, error: result.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Starting logout process');
      
      await authService.logout();
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      }));
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Force local logout even if backend call fails
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      }));
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      setAuthState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
    } catch (error) {
      console.error('Failed to mark onboarding as complete:', error);
    }
  };

  const updateUserInterests = async (interests: string[]) => {
    try {
      console.log('🎯 Updating user interests:', interests);
      
      const result = await authService.updateUserInterests(interests);
      
      if (result.success && result.user) {
        setAuthState(prev => ({
          ...prev,
          user: result.user!,
        }));
        console.log('✅ User interests updated successfully');
      } else {
        console.error('❌ Failed to update interests:', result.error);
        // Fallback to local update if backend fails
        if (authState.user) {
          const updatedUser = { ...authState.user, interests };
          await AsyncStorage.setItem('userToken', JSON.stringify(updatedUser));
          setAuthState(prev => ({
            ...prev,
            user: updatedUser,
          }));
        }
      }
    } catch (error) {
      console.error('❌ Failed to update user interests:', error);
      // Fallback to local update
      if (authState.user) {
        const updatedUser = { ...authState.user, interests };
        await AsyncStorage.setItem('userToken', JSON.stringify(updatedUser));
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
    }
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    completeOnboarding,
    updateUserInterests,
    checkAuthStatus,
  };
};
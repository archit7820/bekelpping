import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
}

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
      // Simulate API call
      const user: User = {
        id: '1',
        name: 'Sarah Johnson',
        email,
        interests: [],
      };

      await AsyncStorage.setItem('userToken', JSON.stringify(user));
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      const user: User = {
        id: '1',
        name,
        email,
        interests: [],
      };

      await AsyncStorage.setItem('userToken', JSON.stringify(user));
      setAuthState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    } catch (error) {
      console.error('Logout failed:', error);
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
      if (authState.user) {
        const updatedUser = { ...authState.user, interests };
        await AsyncStorage.setItem('userToken', JSON.stringify(updatedUser));
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      console.error('Failed to update user interests:', error);
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
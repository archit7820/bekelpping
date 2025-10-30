import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  useEffect(() => {
    // Block hardware back button for auth pages
    const backAction = () => {
      if (!isAuthenticated || !hasCompletedOnboarding) {
        // Prevent going back during auth flow
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isAuthenticated, hasCompletedOnboarding]);

  if (isLoading) {
    return null; // Show loading or splash screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ 
        headerShown: false, 
        gestureEnabled: false,
        animation: 'none'
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ 
          headerShown: false, 
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => null
        }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="messages-modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="notifications-modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings-modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

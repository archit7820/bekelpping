import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function AuthLayout() {
  useEffect(() => {
    // Block hardware back button for all auth screens
    const backAction = () => {
      return true; // Always prevent back navigation in auth flow
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
        headerBackVisible: false,
        headerLeft: () => null
      }}>
        <Stack.Screen name="onboarding" options={{
          headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => null
        }} />
        <Stack.Screen name="login" options={{
          headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => null
        }} />
        <Stack.Screen name="signup" options={{
          headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => null
        }} />
        <Stack.Screen name="preferences" options={{
          headerShown: false,
          gestureEnabled: false,
          headerBackVisible: false,
          headerLeft: () => null
        }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
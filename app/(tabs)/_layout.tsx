import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Listen for camera state changes
  useEffect(() => {
    const handleCameraState = (active: boolean) => setIsCameraActive(active);
    
    // Subscribe to global camera state
    if (global.cameraStateListeners) {
      global.cameraStateListeners.push(handleCameraState);
    } else {
      global.cameraStateListeners = [handleCameraState];
    }

    return () => {
      if (global.cameraStateListeners) {
        const index = global.cameraStateListeners.indexOf(handleCameraState);
        if (index > -1) {
          global.cameraStateListeners.splice(index, 1);
        }
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // iOS blue
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: isCameraActive ? { display: 'none' } : {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 34 : 8,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            style={StyleSheet.absoluteFill}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
          fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'system-ui',
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="house.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="rectangle.stack.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="camera.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="person.2.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 30 : 26} 
              name="person.circle.fill" 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
    </GestureHandlerRootView>
  );
}

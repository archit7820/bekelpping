import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface SwipeTabWrapperProps {
  children: React.ReactNode;
  currentTabIndex: number;
  tabRoutes: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% of screen width to trigger navigation

export function SwipeTabWrapper({ children, currentTabIndex, tabRoutes }: SwipeTabWrapperProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const navigateToTab = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentTabIndex - 1)
      : Math.min(tabRoutes.length - 1, currentTabIndex + 1);
    
    if (newIndex !== currentTabIndex) {
      // Haptic feedback for iOS-like experience
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      router.replace(`/(tabs)/${tabRoutes[newIndex]}`);
    }
  };

  // Disable swipe gestures to prevent navigation issues
  const panGesture = Gesture.Pan()
    .enabled(false); // Completely disable swipe navigation

  // No animation since swipe is disabled
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1, // Always fully visible
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
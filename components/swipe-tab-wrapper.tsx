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

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Light haptic feedback on gesture start
      if (Platform.OS === 'ios') {
        runOnJS(Haptics.selectionAsync)();
      }
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      
      // Reduce opacity slightly during swipe for visual feedback
      const progress = Math.abs(event.translationX) / SCREEN_WIDTH;
      opacity.value = Math.max(0.85, 1 - progress * 0.15);
    })
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Determine if swipe was significant enough to navigate
      const shouldNavigate = Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500;
      
      if (shouldNavigate) {
        if (translationX > 0 && currentTabIndex > 0) {
          // Swipe right - go to previous tab
          runOnJS(navigateToTab)('left');
        } else if (translationX < 0 && currentTabIndex < tabRoutes.length - 1) {
          // Swipe left - go to next tab
          runOnJS(navigateToTab)('right');
        }
      }
      
      // Reset animation values
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
      opacity.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value * 0.1 }], // Subtle movement
      opacity: opacity.value,
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
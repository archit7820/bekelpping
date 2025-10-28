import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImpactCamera } from '@/components/impact-camera';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'camera', 'communities', 'profile'];

  // Ensure tab bar is restored when leaving camera screen
  React.useEffect(() => {
    return () => {
      // When this component unmounts (user navigates away), restore tab bar
      if (global.cameraStateListeners) {
        global.cameraStateListeners.forEach((listener: (active: boolean) => void) => 
          listener(false)
        );
      }
    };
  }, []);

  return (
    <SwipeTabWrapper currentTabIndex={2} tabRoutes={tabRoutes}>
      <ImpactCamera />
    </SwipeTabWrapper>
  );
}


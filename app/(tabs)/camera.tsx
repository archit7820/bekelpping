import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ImpactCamera } from '@/components/impact-camera';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';
import { useCameraState } from '@/hooks/use-camera-state';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'camera', 'communities', 'profile'];
  const { setCameraActive } = useCameraState();

  // Ensure camera state is set when screen loads
  useEffect(() => {
    setCameraActive(true);
    
    return () => {
      setCameraActive(false);
    };
  }, [setCameraActive]);

  return (
    <SwipeTabWrapper currentTabIndex={2} tabRoutes={tabRoutes}>
      <ImpactCamera />
    </SwipeTabWrapper>
  );
}


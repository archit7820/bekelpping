import { StyleSheet, Platform, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import React, { useState, useRef } from 'react';
import { router } from 'expo-router';

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'communities', 'camera', 'profile'];
  const slideAnim = useSharedValue(0);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [showCamera, setShowCamera] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const cameraRef = useRef<CameraView>(null);

  React.useEffect(() => {
    slideAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const requestPermissions = async () => {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }
    if (!mediaLibraryPermission?.granted) {
      await requestMediaLibraryPermission();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(slideAnim.value),
    transform: [
      {
        translateY: interpolate(slideAnim.value, [0, 1], [50, 0])
      }
    ]
  }));

  const handleCameraPress = async () => {
    await requestPermissions();
    if (cameraPermission?.granted) {
      setShowOptions(false);
      setShowCamera(true);
      // Hide bottom navigation
      if (global.cameraStateListeners) {
        global.cameraStateListeners.forEach(listener => listener(true));
      }
    } else {
      Alert.alert('Permission required', 'Camera permission is required to use this feature.');
    }
  };

  const handleGalleryPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Selected image:', result.assets[0]);
      // Handle selected image here
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo && mediaLibraryPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
          Alert.alert('Success', 'Photo saved to gallery!');
        }
        console.log('Photo taken:', photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const closeCamera = () => {
    setShowCamera(false);
    setShowOptions(true);
    // Show bottom navigation
    if (global.cameraStateListeners) {
      global.cameraStateListeners.forEach(listener => listener(false));
    }
  };

  const CameraButton = ({ onPress, size = 80 }: { onPress: () => void; size?: number }) => {
    const pressAnim = useSharedValue(1);

    const handlePress = () => {
      pressAnim.value = withSpring(0.9, { duration: 100 }, () => {
        pressAnim.value = withSpring(1);
      });
      onPress();
    };

    const pressStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressAnim.value }]
    }));

    return (
      <Animated.View style={pressStyle}>
        <TouchableOpacity 
          style={[styles.cameraButton, { width: size, height: size, borderRadius: size / 2 }]}
          onPress={handlePress}
        >
          <View style={[styles.innerButton, { width: size - 10, height: size - 10, borderRadius: (size - 10) / 2 }]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };


  if (showCamera) {
    return (
      <ThemedView style={styles.fullScreenContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Camera Header */}
          <BlurView intensity={30} style={[styles.cameraHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity style={styles.cameraHeaderButton} onPress={closeCamera}>
              <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText style={styles.cameraHeaderTitle}>Camera</ThemedText>
            <TouchableOpacity style={styles.cameraHeaderButton}>
              <IconSymbol name="bolt" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </BlurView>

          {/* Camera Controls */}
          <View style={[styles.cameraControls, { paddingBottom: insets.bottom + 40 }]}>
            <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryPress}>
              <IconSymbol name="photo.on.rectangle" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            
            <CameraButton onPress={takePicture} size={70} />
            
            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <IconSymbol name="arrow.triangle.2.circlepath.camera" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </ThemedView>
    );
  }

  return (
    <SwipeTabWrapper currentTabIndex={3} tabRoutes={tabRoutes}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.headerButton}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Camera</ThemedText>
          <TouchableOpacity style={styles.headerButton}>
            <IconSymbol name="gear" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </BlurView>

        {/* Camera Options */}
        <ThemedView style={styles.optionsContainer}>
          <Animated.View style={[styles.optionsContent, animatedStyle]}>
            <IconSymbol name="camera" size={120} color="rgba(255,255,255,0.3)" />
            <ThemedText style={styles.optionsTitle}>Choose an option</ThemedText>
            
            <View style={styles.optionButtons}>
              <TouchableOpacity style={styles.optionButton} onPress={handleCameraPress}>
                <IconSymbol name="camera.fill" size={40} color="#FFFFFF" />
                <ThemedText style={styles.optionText}>Open Camera</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.optionButton} onPress={handleGalleryPress}>
                <IconSymbol name="photo.on.rectangle" size={40} color="#FFFFFF" />
                <ThemedText style={styles.optionText}>Choose from Gallery</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ThemedView>
      </ThemedView>
    </SwipeTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cameraHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraHeaderTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  optionsContent: {
    alignItems: 'center',
    width: '100%',
  },
  optionsTitle: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
  },
  optionButtons: {
    width: '100%',
    gap: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 20,
  },
  optionText: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
  },
  cameraButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    backgroundColor: '#FFFFFF',
  },
});
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, ImpactColors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCameraState } from '@/hooks/use-camera-state';
import { useImpactStore } from '@/stores/impact-store';
import { impactService, ImpactAnalysis } from '@/services/impact-service';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CapturedPhoto {
  uri: string;
  width: number;
  height: number;
}

interface PostModalProps {
  isVisible: boolean;
  photo: CapturedPhoto | null;
  analysis: ImpactAnalysis | null;
  isAnalyzing: boolean;
  onClose: () => void;
  onPost: (caption: string, tags: string[]) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  isVisible,
  photo,
  analysis,
  isAnalyzing,
  onClose,
  onPost,
}) => {
  const colorScheme = useColorScheme();
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');

  const handlePost = () => {
    const tagArray = tags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.slice(1));
    
    onPost(caption, tagArray);
    setCaption('');
    setTags('');
  };

  const impactGradient = analysis ? ImpactColors.gradient(analysis.score) : ImpactColors.medium;

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <BlurView intensity={100} style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.modalButton, { color: Colors[colorScheme ?? 'light'].tint }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              New Post
            </Text>
            <TouchableOpacity 
              onPress={handlePost}
              disabled={isAnalyzing || !caption.trim()}
              style={[
                styles.postButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                (!caption.trim() || isAnalyzing) && { opacity: 0.5 }
              ]}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          {/* Photo Preview */}
          {photo && (
            <View style={styles.photoPreview}>
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
              
              {/* Impact Score Overlay */}
              {analysis && !isAnalyzing && (
                <View style={styles.impactOverlay}>
                  <LinearGradient
                    colors={[impactGradient.start, impactGradient.end]}
                    style={styles.impactBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.impactScore}>{Math.round(analysis.score)}</Text>
                    <Text style={styles.impactLabel}>IMPACT</Text>
                  </LinearGradient>
                </View>
              )}

              {isAnalyzing && (
                <View style={styles.analyzingOverlay}>
                  <BlurView intensity={50} style={StyleSheet.absoluteFill} />
                  <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
                  <Text style={[styles.analyzingText, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Analyzing Impact...
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Caption Input */}
          <View style={styles.inputSection}>
            <TextInput
              style={[
                styles.captionInput,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              placeholder="Write a caption..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={280}
            />
            
            <TextInput
              style={[
                styles.tagsInput,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: Colors[colorScheme ?? 'light'].border,
                }
              ]}
              placeholder="Add hashtags (#nature #photography)"
              placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
              value={tags}
              onChangeText={setTags}
            />
          </View>

          {/* Impact Analysis Results */}
          {analysis && !isAnalyzing && (
            <View style={styles.analysisSection}>
              <Text style={[styles.analysisTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Impact Analysis
              </Text>
              
              <View style={styles.factorsContainer}>
                {Object.entries(analysis.factors).map(([factor, score]) => (
                  <View key={factor} style={styles.factorItem}>
                    <Text style={[styles.factorName, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Text>
                    <View style={[styles.factorBar, { backgroundColor: Colors[colorScheme ?? 'light'].separator }]}>
                      <View 
                        style={[
                          styles.factorFill,
                          { 
                            width: `${score}%`,
                            backgroundColor: ImpactColors.gradient(score).start,
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.factorScore, { color: Colors[colorScheme ?? 'light'].icon }]}>
                      {Math.round(score)}
                    </Text>
                  </View>
                ))}
              </View>

              {analysis.suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  <Text style={[styles.suggestionsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                    Suggestions to Improve Impact:
                  </Text>
                  {analysis.suggestions.map((suggestion, index) => (
                    <Text key={index} style={[styles.suggestionText, { color: Colors[colorScheme ?? 'light'].icon }]}>
                      • {suggestion}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export const ImpactCamera: React.FC = () => {
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  
  const { addPost, setLoading } = useImpactStore();
  const { setCameraActive } = useCameraState();
  
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);

  useEffect(() => {
    // Set camera as active when component mounts to hide tab bar
    setCameraActive(true);

    // Cleanup function to restore tab bar when component unmounts
    return () => {
      setCameraActive(false);
    };
  }, [setCameraActive]);

  const animatedCaptureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const animatedFlipStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateValue.value}deg` }],
  }));

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={[styles.permissionText, { color: Colors[colorScheme ?? 'light'].text }]}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity 
          style={[styles.permissionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scaleValue.value = withSpring(0.95, {}, () => {
        scaleValue.value = withSpring(1);
      });

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        setCapturedPhoto(photo);
        setIsModalVisible(true);
        setIsAnalyzing(true);
        
        // Analyze the photo for impact score
        try {
          // Add UI delay for better user experience
          await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
          const analysis = impactService.analyzeImage(photo.uri);
          setImpactAnalysis(analysis);
        } catch (error) {
          console.error('Impact analysis failed:', error);
          Alert.alert('Analysis Error', 'Failed to analyze image impact. Please try again.');
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    Haptics.selectionAsync();
    rotateValue.value = withTiming(180, { duration: 300 }, () => {
      rotateValue.value = 0;
    });
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const photo = {
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
      };
      
      setCapturedPhoto(photo);
      setIsModalVisible(true);
      setIsAnalyzing(true);
      
      try {
        // Add UI delay for better user experience
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        const analysis = impactService.analyzeImage(photo.uri);
        setImpactAnalysis(analysis);
      } catch (error) {
        console.error('Impact analysis failed:', error);
        Alert.alert('Analysis Error', 'Failed to analyze image impact. Please try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handlePost = async (caption: string, tags: string[]) => {
    if (!capturedPhoto || !impactAnalysis) return;

    setLoading(true);
    
    try {
      // Create new post object
      const newPost = {
        id: Date.now().toString(),
        userId: 'current-user', // Replace with actual user ID
        imageUrl: capturedPhoto.uri,
        caption,
        tags,
        impactScore: impactAnalysis.score,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
      };

      addPost(newPost);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Posted Successfully!', 
        `Your post received an Impact Score of ${Math.round(impactAnalysis.score)}!`,
        [{ text: 'OK', onPress: () => setIsModalVisible(false) }]
      );
      
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setLoading(false);
      setCapturedPhoto(null);
      setImpactAnalysis(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => {
          // Restore tab bar visibility before navigating back
          setCameraActive(false);
          router.back();
        }}
      >
        <IconSymbol name="chevron.left" size={28} color="white" />
      </TouchableOpacity>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      />
      
      {/* Camera Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromLibrary}>
          <IconSymbol name="photo.on.rectangle" size={28} color="white" />
        </TouchableOpacity>
        
        <Animated.View style={animatedCaptureStyle}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={animatedFlipStyle}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <IconSymbol name="arrow.triangle.2.circlepath.camera" size={28} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Post Modal */}
      <PostModal
        isVisible={isModalVisible}
        photo={capturedPhoto}
        analysis={impactAnalysis}
        isAnalyzing={isAnalyzing}
        onClose={() => {
          setIsModalVisible(false);
          setCapturedPhoto(null);
          setImpactAnalysis(null);
        }}
        onPost={handlePost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  modalButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  photoPreview: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 4/3,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  impactOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  impactBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  impactScore: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  impactLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.9,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tagsInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  analysisSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  factorsContainer: {
    marginBottom: 20,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorName: {
    fontSize: 14,
    width: 120,
  },
  factorBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  factorFill: {
    height: '100%',
    borderRadius: 3,
  },
  factorScore: {
    fontSize: 14,
    width: 30,
    textAlign: 'right',
  },
  suggestionsContainer: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
  },
});
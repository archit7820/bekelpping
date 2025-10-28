import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Impact',
    subtitle: 'Your journey to positive change starts here',
    description: 'Discover how small actions can create big differences in your community and the world.',
    icon: 'heart.fill',
    colors: ['#FF6B6B', '#FF8E53'],
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: 2,
    title: 'Track Your Impact',
    subtitle: 'See your positive influence grow',
    description: 'Monitor your environmental footprint, community contributions, and personal growth.',
    icon: 'chart.line.uptrend.xyaxis',
    colors: ['#4ECDC4', '#44A08D'],
    image: require('@/assets/images/react-logo.png'),
  },
  {
    id: 3,
    title: 'Connect & Share',
    subtitle: 'Join a community of changemakers',
    description: 'Share your achievements, inspire others, and get inspired by fellow impact creators.',
    icon: 'person.3.fill',
    colors: ['#667eea', '#764ba2'],
    image: require('@/assets/images/react-logo.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const skipOnboarding = () => {
    router.replace('/(auth)/login');
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentSlide.colors}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Skip Button */}
      <TouchableOpacity 
        style={[styles.skipButton, { top: insets.top + 20 }]}
        onPress={skipOnboarding}
      >
        <BlurView intensity={20} tint="light" style={styles.skipButtonBlur}>
          <Text style={styles.skipText}>Skip</Text>
        </BlurView>
      </TouchableOpacity>

      <Animated.View style={[styles.content, animatedStyle]}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={styles.iconBackground}
          >
            <IconSymbol name={currentSlide.icon} size={80} color="white" />
          </LinearGradient>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={currentSlide.image} style={styles.image} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>
      </Animated.View>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 40 }]}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
          <BlurView intensity={20} tint="light" style={styles.nextButtonBlur}>
            <Text style={styles.nextText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <IconSymbol 
              name="arrow.right" 
              size={20} 
              color="white" 
              style={styles.nextIcon}
            />
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  skipButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  skipButtonBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: '100%',
  },
  nextButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nextText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  nextIcon: {
    marginLeft: 4,
  },
});
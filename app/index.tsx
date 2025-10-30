import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAuth } from '@/hooks/use-auth';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth();

  useEffect(() => {
    // Simple fade-in animation
    opacity.value = withTiming(1, { duration: 1000 });

    // Wait for animation and then route based on auth state
    const timer = setTimeout(() => {
      if (isLoading) return; // Wait for auth check to complete
      
      if (isAuthenticated && hasCompletedOnboarding) {
        // User has completed everything, go to main app
        router.replace('/(tabs)');
      } else if (isAuthenticated && !hasCompletedOnboarding) {
        // User is logged in but hasn't completed onboarding
        router.replace('/(auth)/preferences');
      } else {
        // User is not authenticated, start onboarding
        router.replace('/(auth)/onboarding');
      }
    }, 2000); // Reduced time to 2 seconds

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding, isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View style={[styles.content, animatedStyle ]}>
        <Text style={styles.title}>Impact</Text>
        <Text style={styles.subtitle}>Making a difference, one step at a time</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
});

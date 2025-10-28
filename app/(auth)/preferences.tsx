import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const interestCategories = [
  {
    id: 'environment',
    title: 'Environment',
    icon: 'leaf.fill',
    color: '#4ECDC4',
    interests: ['Climate Action', 'Renewable Energy', 'Recycling', 'Wildlife Conservation', 'Ocean Cleanup']
  },
  {
    id: 'community',
    title: 'Community',
    icon: 'person.3.fill',
    color: '#FF6B6B',
    interests: ['Volunteering', 'Local Events', 'Food Banks', 'Community Gardens', 'Mentorship']
  },
  {
    id: 'education',
    title: 'Education',
    icon: 'book.fill',
    color: '#667eea',
    interests: ['STEM Education', 'Literacy Programs', 'Scholarships', 'Online Learning', 'Skill Development']
  },
  {
    id: 'health',
    title: 'Health & Wellness',
    icon: 'heart.fill',
    color: '#FF8E53',
    interests: ['Mental Health', 'Fitness', 'Nutrition', 'Healthcare Access', 'Wellness Programs']
  },
  {
    id: 'technology',
    title: 'Technology',
    icon: 'laptopcomputer',
    color: '#764ba2',
    interests: ['Digital Inclusion', 'Tech for Good', 'AI Ethics', 'Open Source', 'Innovation']
  },
  {
    id: 'arts',
    title: 'Arts & Culture',
    icon: 'paintbrush.fill',
    color: '#f093fb',
    interests: ['Music', 'Visual Arts', 'Theater', 'Cultural Preservation', 'Creative Expression']
  },
];

export default function PreferencesScreen() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();
  
  const contentOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: withSpring(contentOpacity.value === 1 ? 0 : 50) }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length < 3) {
      return;
    }

    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    // Navigate to main app
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
  };

  const InterestCard = ({ interest, categoryColor }: { interest: string, categoryColor: string }) => {
    const isSelected = selectedInterests.includes(interest);
    const scale = useSharedValue(1);

    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      toggleInterest(interest);
    };

    return (
      <Animated.View style={animatedCardStyle}>
        <TouchableOpacity onPress={handlePress}>
          <BlurView 
            intensity={isSelected ? 25 : 15} 
            tint="light" 
            style={[
              styles.interestCard,
              isSelected && { borderColor: categoryColor, borderWidth: 2 }
            ]}
          >
            <Text style={[
              styles.interestText,
              isSelected && { color: 'white', fontWeight: '600' }
            ]}>
              {interest}
            </Text>
            {isSelected && (
              <View style={[styles.checkmark, { backgroundColor: categoryColor }]}>
                <IconSymbol name="checkmark" size={12} color="white" />
              </View>
            )}
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4ECDC4']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BlurView intensity={20} tint="light" style={styles.backButtonBlur}>
            <IconSymbol name="arrow.left" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, animatedContentStyle]}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What interests you?</Text>
          <Text style={styles.subtitle}>
            Choose at least 3 areas you care about to personalize your impact journey
          </Text>
          <Text style={styles.counter}>
            {selectedInterests.length} of {interestCategories.reduce((acc, cat) => acc + cat.interests.length, 0)} selected
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((selectedInterests.length / 3) * 100, 100)}%`,
                }
              ]}
            />
          </View>
        </View>

        {/* Interests List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {interestCategories.map((category, categoryIndex) => {
            const CategoryAnimatedContainer = () => {
              const categoryOpacity = useSharedValue(0);
              const categoryTranslateY = useSharedValue(50);

              React.useEffect(() => {
                categoryOpacity.value = withDelay(categoryIndex * 100, withTiming(1, { duration: 600 }));
                categoryTranslateY.value = withDelay(categoryIndex * 100, withSpring(0, { damping: 15 }));
              }, []);

              const animatedCategoryStyle = useAnimatedStyle(() => ({
                opacity: categoryOpacity.value,
                transform: [{ translateY: categoryTranslateY.value }],
              }));

              return (
                <Animated.View 
                  key={category.id}
                  style={[styles.categoryContainer, animatedCategoryStyle]}
                >
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <IconSymbol name={category.icon} size={24} color="white" />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>

              {/* Category Interests */}
              <View style={styles.interestsGrid}>
                {category.interests.map((interest) => (
                  <InterestCard
                    key={interest}
                    interest={interest}
                    categoryColor={category.color}
                  />
                ))}
              </View>
                </Animated.View>
              );
            };

            return <CategoryAnimatedContainer key={category.id} />;
          })}
        </ScrollView>
      </Animated.View>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { opacity: selectedInterests.length >= 3 ? 1 : 0.5 }
            ]}
            onPress={handleContinue}
            disabled={selectedInterests.length < 3}
          >
            <BlurView intensity={25} tint="light" style={styles.continueButtonBlur}>
              <Text style={styles.continueButtonText}>
                Continue ({selectedInterests.length}/3 minimum)
              </Text>
              <IconSymbol name="arrow.right" size={20} color="white" />
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
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
  header: {
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  counter: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 30,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  interestText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
  },
  continueButton: {
    width: '100%',
  },
  continueButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
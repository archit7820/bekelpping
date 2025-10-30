import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming
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
  const insets = useSafeAreaInsets();

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

    // Navigate to main app
    router.replace('/(tabs)');
  };

  const InterestCard = ({ interest, categoryColor }: { interest: string, categoryColor: string }) => {
    const isSelected = selectedInterests.includes(interest);

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleInterest(interest);
    };

    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#667eea']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
        <Text style={styles.headerTitle}>What interests you?</Text>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.subtitle}>
          Choose at least 3 areas you care about to personalize your impact journey
        </Text>
        <Text style={styles.counter}>
          {selectedInterests.length} of {interestCategories.reduce((acc, cat) => acc + cat.interests.length, 0)} selected
        </Text>
      </View>

      <View style={styles.content}>
        {/* Title Section */}
      

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
                categoryTranslateY.value = withDelay(categoryIndex * 100, withTiming(0, { duration: 400 }));
              }, []);

              // const animatedCategoryStyle = useAnimatedStyle(() => ({
              //   opacity: categoryOpacity.value,
              //   transform: [{ translateY: categoryTranslateY.value }],
              // }));

              return (
                <Animated.View 
                  key={category.id}
                  style={[styles.categoryContainer]}
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
      </View>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
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
            <IconSymbol name="chevron.right" size={20} color="white" />
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  descriptionContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'System',
    fontWeight: '400',
  },
  counter: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    fontFamily: 'System',
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
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'System',
    letterSpacing: -0.3,
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
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'System',
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
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
});
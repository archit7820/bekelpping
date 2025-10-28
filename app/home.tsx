import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const impactStats = [
  { icon: 'leaf.fill', value: '2.4k', label: 'CO₂ Saved (kg)', color: '#4ECDC4' },
  { icon: 'heart.fill', value: '156', label: 'Lives Touched', color: '#FF6B6B' },
  { icon: 'star.fill', value: '89', label: 'Impact Score', color: '#FF8E53' },
  { icon: 'person.3.fill', value: '23', label: 'Communities', color: '#667eea' },
];

const recentActivities = [
  {
    id: 1,
    title: 'Beach Cleanup Drive',
    subtitle: 'Marina Beach, Chennai',
    time: '2 hours ago',
    icon: 'trash.fill',
    color: '#4ECDC4',
    impact: '+50 Impact Points',
  },
  {
    id: 2,
    title: 'Tree Plantation',
    subtitle: 'Green Valley Park',
    time: '1 day ago',
    icon: 'leaf.fill',
    color: '#4ECDC4',
    impact: '+75 Impact Points',
  },
  {
    id: 3,
    title: 'Food Distribution',
    subtitle: 'Local Community Center',
    time: '3 days ago',
    icon: 'heart.fill',
    color: '#FF6B6B',
    impact: '+100 Impact Points',
  },
];

const suggestedActions = [
  {
    id: 1,
    title: 'Join Climate March',
    subtitle: 'This Saturday, 9 AM',
    icon: 'figure.walk',
    color: '#667eea',
    category: 'Environment',
  },
  {
    id: 2,
    title: 'Teach Kids Coding',
    subtitle: 'Weekend workshop',
    icon: 'laptopcomputer',
    color: '#764ba2',
    category: 'Education',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  
  const headerOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const activitiesOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    statsOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    activitiesOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: withSpring(headerOpacity.value === 1 ? 0 : -30) }],
  }));

  const animatedStatsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: withSpring(statsOpacity.value === 1 ? 0 : 30) }],
  }));

  const animatedActivitiesStyle = useAnimatedStyle(() => ({
    opacity: activitiesOpacity.value,
    transform: [{ translateY: withSpring(activitiesOpacity.value === 1 ? 0 : 30) }],
  }));

  const StatCard = ({ stat, index }: { stat: typeof impactStats[0], index: number }) => {
    const scale = useSharedValue(1);
    
    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
    };

    return (
      <Animated.View style={[animatedCardStyle, { flex: 1 }]}>
        <TouchableOpacity onPress={handlePress}>
          <BlurView intensity={20} tint="light" style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <IconSymbol name={stat.icon} size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header */}
      <Animated.View style={[styles.header, { paddingTop: insets.top + 20 }, animatedHeaderStyle]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning! 👋</Text>
            <Text style={styles.username}>Sarah Johnson</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <BlurView intensity={20} tint="light" style={styles.profileButtonBlur}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/40x40/667eea/ffffff?text=SJ' }}
                style={styles.profileImage}
              />
            </BlurView>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Impact Stats */}
        <Animated.View style={[styles.section, animatedStatsStyle]}>
          <Text style={styles.sectionTitle}>Your Impact Today</Text>
          <View style={styles.statsGrid}>
            {impactStats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.section, animatedActivitiesStyle]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <BlurView intensity={20} tint="light" style={styles.quickActionBlur}>
                <IconSymbol name="camera.fill" size={24} color="white" />
                <Text style={styles.quickActionText}>Capture Impact</Text>
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <BlurView intensity={20} tint="light" style={styles.quickActionBlur}>
                <IconSymbol name="person.3.fill" size={24} color="white" />
                <Text style={styles.quickActionText}>Find Events</Text>
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionButton}>
              <BlurView intensity={20} tint="light" style={styles.quickActionBlur}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color="white" />
                <Text style={styles.quickActionText}>View Progress</Text>
              </BlurView>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivities.map((activity, index) => (
            <Animated.View 
              key={activity.id}
              style={[
                styles.activityCard,
                {
                  opacity: withDelay(index * 100, withTiming(1, { duration: 600 })),
                  transform: [
                    { translateX: withDelay(index * 100, withSpring(0, { damping: 15 })) }
                  ],
                }
              ]}
            >
              <TouchableOpacity>
                <BlurView intensity={15} tint="light" style={styles.activityCardBlur}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                    <IconSymbol name={activity.icon} size={20} color="white" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View style={styles.activityImpact}>
                    <Text style={styles.impactText}>{activity.impact}</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Suggested Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          {suggestedActions.map((action, index) => (
            <Animated.View 
              key={action.id}
              style={[
                styles.suggestionCard,
                {
                  opacity: withDelay(index * 150, withTiming(1, { duration: 600 })),
                }
              ]}
            >
              <TouchableOpacity>
                <BlurView intensity={15} tint="light" style={styles.suggestionCardBlur}>
                  <View style={[styles.suggestionIcon, { backgroundColor: action.color }]}>
                    <IconSymbol name={action.icon} size={24} color="white" />
                  </View>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionCategory}>{action.category}</Text>
                    <Text style={styles.suggestionTitle}>{action.title}</Text>
                    <Text style={styles.suggestionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <IconSymbol name="arrow.right" size={20} color="rgba(255,255,255,0.8)" />
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={[styles.fab, { bottom: insets.bottom + 100 }]}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/camera')}>
          <BlurView intensity={25} tint="light" style={styles.fabBlur}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.fabGradient}
            >
              <IconSymbol name="plus" size={28} color="white" />
            </LinearGradient>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  username: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    width: 50,
    height: 50,
  },
  profileButtonBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  seeAllText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  quickActions: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  quickActionButton: {
    marginRight: 12,
  },
  quickActionBlur: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  activityCard: {
    marginBottom: 12,
  },
  activityCardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  activityImpact: {
    alignItems: 'flex-end',
  },
  impactText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  suggestionCard: {
    marginBottom: 12,
  },
  suggestionCardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionContent: {
    flex: 1,
    marginLeft: 16,
  },
  suggestionCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginBottom: 2,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
  },
  fabBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
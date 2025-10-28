import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
// Temporarily comment out victory-native due to compatibility issues
// import { VictoryChart, VictoryLine, VictoryPie, VictoryBar, VictoryLabel } from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useImpactStore } from '@/stores/impact-store';
import { Colors, ImpactColors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: screenWidth } = Dimensions.get('window');

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  style?: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, style }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.card, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }, style]}>
      <Text style={[styles.cardTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

interface ImpactScoreDisplayProps {
  score: number;
  size?: 'small' | 'large';
}

const ImpactScoreDisplay: React.FC<ImpactScoreDisplayProps> = ({ score, size = 'large' }) => {
  const colorScheme = useColorScheme();
  const animatedValue = useSharedValue(0);
  const gradient = ImpactColors.gradient(score);

  useEffect(() => {
    animatedValue.value = withTiming(score / 100, { duration: 1000 });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animatedValue.value, [0, 1], [0.8, 1]);
    return {
      transform: [{ scale: withSpring(scale) }],
    };
  });

  const sizeStyle = size === 'large' ? styles.impactScoreLarge : styles.impactScoreSmall;
  const textSize = size === 'large' ? 48 : 24;

  return (
    <Animated.View style={[animatedStyle]}>
      <LinearGradient
        colors={[gradient.start, gradient.end]}
        style={[sizeStyle, styles.impactScoreContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.impactScoreText, { fontSize: textSize }]}>
          {Math.round(score)}
        </Text>
        <Text style={[styles.impactScoreLabel, { fontSize: size === 'large' ? 14 : 10 }]}>
          IMPACT
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

export const ImpactDashboard: React.FC = () => {
  const colorScheme = useColorScheme();
  const {
    currentUser,
    impactMetrics,
    getTotalImpactScore,
    getAverageImpactScore,
    getTopPerformingPosts,
  } = useImpactStore();

  const totalScore = getTotalImpactScore();
  const averageScore = getAverageImpactScore();
  const topPosts = getTopPerformingPosts();

  // Mock data for demonstration if no real data exists
  const weeklyData = impactMetrics?.weeklyTrend || [
    { date: '2024-01-01', score: 65 },
    { date: '2024-01-02', score: 72 },
    { date: '2024-01-03', score: 68 },
    { date: '2024-01-04', score: 81 },
    { date: '2024-01-05', score: 75 },
    { date: '2024-01-06', score: 89 },
    { date: '2024-01-07', score: 92 },
  ];

  const categoryData = Object.entries(impactMetrics?.categoryPerformance || {
    'Nature': 85,
    'Food': 72,
    'Travel': 68,
    'Art': 91,
  }).map(([category, score]) => ({ category, score }));

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Total Impact Score */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Impact Dashboard
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
          Track your content's impact
        </Text>
      </View>

      {/* Main Impact Score */}
      <DashboardCard title="Total Impact Score">
        <View style={styles.mainScoreContainer}>
          <ImpactScoreDisplay score={averageScore || 75} size="large" />
          <View style={styles.scoreStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {impactMetrics?.totalPosts || 12}
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                Posts
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: ImpactColors.high.start }]}>
                +{impactMetrics?.impactGrowth || 8}%
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                Growth
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                {currentUser?.impactStreak || 5}
              </Text>
              <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                Streak
              </Text>
            </View>
          </View>
        </View>
      </DashboardCard>

      {/* Weekly Trend Chart */}
      <DashboardCard title="Weekly Trend">
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.placeholderText, { color: Colors[colorScheme ?? 'light'].icon }]}>
              Chart visualization coming soon
            </Text>
          </View>
        </View>
      </DashboardCard>

      {/* Category Performance */}
      <DashboardCard title="Category Performance">
        <View style={styles.chartContainer}>
          <View style={styles.chartPlaceholder}>
            <IconSymbol name="chart.pie.fill" size={48} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.placeholderText, { color: Colors[colorScheme ?? 'light'].icon }]}>
              Category analysis coming soon
            </Text>
          </View>
        </View>
      </DashboardCard>

      {/* Top Performing Posts */}
      <DashboardCard title="Top Performing Posts">
        <View style={styles.topPostsContainer}>
          {topPosts.length > 0 ? (
            topPosts.map((post, index) => (
              <TouchableOpacity key={post.id} style={styles.topPostItem}>
                <View style={styles.topPostRank}>
                  <IconSymbol 
                    name={index === 0 ? 'trophy.fill' : 'star.fill'} 
                    size={20} 
                    color={index === 0 ? '#FFD700' : Colors[colorScheme ?? 'light'].tint} 
                  />
                </View>
                <View style={styles.topPostContent}>
                  <Text style={[styles.topPostCaption, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {post.caption || 'Untitled Post'}
                  </Text>
                  <Text style={[styles.topPostDate, { color: Colors[colorScheme ?? 'light'].icon }]}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <ImpactScoreDisplay score={post.impactScore} size="small" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="camera.fill" size={48} color={Colors[colorScheme ?? 'light'].icon} />
              <Text style={[styles.emptyStateText, { color: Colors[colorScheme ?? 'light'].icon }]}>
                Start posting to see your top content!
              </Text>
            </View>
          )}
        </View>
      </DashboardCard>

      {/* Quick Actions */}
      <DashboardCard title="Quick Actions">
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionButton, { borderColor: Colors[colorScheme ?? 'light'].border }]}>
            <IconSymbol name="camera.fill" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              New Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionButton, { borderColor: Colors[colorScheme ?? 'light'].border }]}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Analytics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickActionButton, { borderColor: Colors[colorScheme ?? 'light'].border }]}>
            <IconSymbol name="person.2.fill" size={24} color={Colors[colorScheme ?? 'light'].tint} />
            <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>
      </DashboardCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  mainScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactScoreContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  impactScoreLarge: {
    width: 120,
    height: 120,
  },
  impactScoreSmall: {
    width: 60,
    height: 60,
  },
  impactScoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  impactScoreLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.9,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  scoreStats: {
    flex: 1,
    paddingLeft: 20,
  },
  statItem: {
    marginVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  topPostsContainer: {
    marginTop: 10,
  },
  topPostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  topPostRank: {
    width: 40,
    alignItems: 'center',
  },
  topPostContent: {
    flex: 1,
    marginLeft: 12,
  },
  topPostCaption: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  topPostDate: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? Fonts.ios?.sans : Fonts.default.sans,
  },
});
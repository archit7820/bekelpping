import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const tabRoutes = ['index', 'feeds', 'camera', 'communities', 'profile'];

  return (
    <SwipeTabWrapper currentTabIndex={0} tabRoutes={tabRoutes}>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        {/* Header */}
        <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Welcome Back!
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/messages-modal')}
            >
              <IconSymbol name="message" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/notifications-modal')}
            >
              <IconSymbol name="bell" size={24} color={Colors[colorScheme ?? 'light'].tint} />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
                <LinearGradient
                  colors={['#007AFF', '#5AC8FA']}
                  style={styles.quickActionIcon}
                >
                  <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Take Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
                <LinearGradient
                  colors={['#FF9500', '#FFCC02']}
                  style={styles.quickActionIcon}
                >
                  <IconSymbol name="rectangle.stack.fill" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  View Feed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
                <LinearGradient
                  colors={['#30D158', '#32D74B']}
                  style={styles.quickActionIcon}
                >
                  <IconSymbol name="person.2.fill" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Friends
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
                <LinearGradient
                  colors={['#FF3B30', '#FF6B6B']}
                  style={styles.quickActionIcon}
                >
                  <IconSymbol name="chart.bar.fill" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Messages & Updates
            </Text>
            <TouchableOpacity style={[styles.messageCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
              <View style={[styles.messageIcon, { backgroundColor: '#007AFF' }]}>
                <IconSymbol name="envelope.fill" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.messageContent}>
                <Text style={[styles.messageTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Welcome to Impact!
                </Text>
                <Text style={[styles.messageSubtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Start tracking your social media impact and growth
                </Text>
              </View>
              <View style={styles.messageBadge}>
                <Text style={styles.messageBadgeText}>New</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.messageCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
              <View style={[styles.messageIcon, { backgroundColor: '#FF9500' }]}>
                <IconSymbol name="bell.fill" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.messageContent}>
                <Text style={[styles.messageTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Daily Reminder
                </Text>
                <Text style={[styles.messageSubtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Don't forget to check your impact dashboard today!
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.messageCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
              <View style={[styles.messageIcon, { backgroundColor: '#30D158' }]}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.messageContent}>
                <Text style={[styles.messageTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Impact Growing!
                </Text>
                <Text style={[styles.messageSubtitle, { color: Colors[colorScheme ?? 'light'].icon }]}>
                  Your content reached 1.2K people this week
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* App Usage Tracking - iOS Style */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Time Invested
            </Text>
            <View style={[styles.usageCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
              <View style={styles.usageHeader}>
                <Text style={[styles.usageTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Today's App Usage
                </Text>
                <Text style={[styles.usageTime, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  2h 34m
                </Text>
              </View>
              
              <View style={styles.usageChart}>
                {/* iOS-style usage bars */}
                <View style={styles.usageBars}>
                  {[0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3].map((height, index) => (
                    <View key={index} style={styles.usageBarContainer}>
                      <View 
                        style={[
                          styles.usageBar, 
                          { 
                            height: `${height * 100}%`,
                            backgroundColor: index === 6 ? Colors[colorScheme ?? 'light'].tint : 'rgba(0, 122, 255, 0.3)'
                          }
                        ]} 
                      />
                      <Text style={[styles.usageBarLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.usageStats}>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageStatValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    18h 42m
                  </Text>
                  <Text style={[styles.usageStatLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                    This Week
                  </Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageStatValue, { color: '#30D158' }]}>
                    +12%
                  </Text>
                  <Text style={[styles.usageStatLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                    vs Last Week
                  </Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={[styles.usageStatValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    2.7h
                  </Text>
                  <Text style={[styles.usageStatLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>
                    Daily Avg
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trending */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Trending Now
            </Text>
            <View style={[styles.trendingCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
              <Text style={[styles.trendingText, { color: Colors[colorScheme ?? 'light'].text }]}>
                🔥 #NaturePhotography
              </Text>
              <Text style={[styles.trendingSubtext, { color: Colors[colorScheme ?? 'light'].icon }]}>
                1.2K posts today
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SwipeTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    position: 'relative',
    marginLeft: 16,
    marginBottom: 4,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  content: {
    flex: 1,
    paddingTop: 120,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  messageSubtitle: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  messageBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  usageCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  usageTime: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  usageChart: {
    marginVertical: 20,
  },
  usageBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  usageBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  usageBar: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 8,
  },
  usageBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  usageStat: {
    alignItems: 'center',
    flex: 1,
  },
  usageStatValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  usageStatLabel: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  trendingCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  trendingSubtext: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  bottomSpacer: {
    height: 100,
  },
});

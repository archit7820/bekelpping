import { ScrollView, StyleSheet, Platform, TouchableOpacity, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';
import { ImpactDashboard } from '@/components/impact-dashboard';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import React from 'react';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const tabRoutes = ['index', 'feeds', 'camera', 'communities', 'profile'];
  const slideAnim = useSharedValue(0);

  React.useEffect(() => {
    slideAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(slideAnim.value),
    transform: [
      {
        translateY: interpolate(slideAnim.value, [0, 1], [50, 0])
      }
    ]
  }));

  const handleSettingsPress = () => {
    router.push('/settings-modal');
  };

  return (
    <SwipeTabWrapper currentTabIndex={4} tabRoutes={tabRoutes}>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>Profile & Dashboard</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
            <IconSymbol name="gearshape.fill" size={28} color="#007AFF" />
          </TouchableOpacity>
        </BlurView>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Summary */}
          <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
            <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={[styles.username, { color: Colors[colorScheme ?? 'light'].text }]}>@username</Text>
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>12</Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>543</Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors[colorScheme ?? 'light'].text }]}>189</Text>
                <Text style={[styles.statLabel, { color: Colors[colorScheme ?? 'light'].icon }]}>Following</Text>
              </View>
            </View>
          </View>
          
          {/* Impact Dashboard */}
          <ImpactDashboard />

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
  settingsButton: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  content: {
    flex: 1,
    paddingTop: 120,
  },
  profileCard: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  bottomSpacer: {
    height: 100,
  },
});
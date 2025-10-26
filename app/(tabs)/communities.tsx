import { ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import React from 'react';

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'communities', 'camera', 'profile'];
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

  const CommunityCard = ({ 
    name, 
    members, 
    description, 
    image, 
    isJoined 
  }: {
    name: string;
    members: string;
    description: string;
    image: string;
    isJoined: boolean;
  }) => {
    const scaleAnim = useSharedValue(1);

    const handlePress = () => {
      scaleAnim.value = withSpring(0.95, { duration: 100 }, () => {
        scaleAnim.value = withSpring(1);
      });
    };

    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }]
    }));

    return (
      <Animated.View style={[cardAnimatedStyle, animatedStyle]}>
        <TouchableOpacity style={styles.communityCard} onPress={handlePress}>
          <ThemedView style={styles.communityHeader}>
            <ThemedView style={styles.communityAvatar}>
              <ThemedText style={styles.communityEmoji}>{image}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.communityInfo}>
              <ThemedText type="defaultSemiBold" style={styles.communityName}>
                {name}
              </ThemedText>
              <ThemedText style={styles.memberCount}>{members} members</ThemedText>
            </ThemedView>
            <TouchableOpacity 
              style={[styles.joinButton, isJoined && styles.joinedButton]}
            >
              <ThemedText style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
                {isJoined ? 'Joined' : 'Join'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <ThemedText style={styles.communityDescription}>
            {description}
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SwipeTabWrapper currentTabIndex={2} tabRoutes={tabRoutes}>
      <ThemedView style={styles.container}>
        <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
          <ThemedText type="title" style={styles.headerTitle}>Communities</ThemedText>
          <TouchableOpacity style={styles.searchButton}>
            <IconSymbol name="magnifyingglass" size={24} color="#007AFF" />
          </TouchableOpacity>
        </BlurView>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={animatedStyle}>
            <ThemedView style={styles.featuredSection}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                🌟 Featured Communities
              </ThemedText>
            </ThemedView>
          </Animated.View>

          <CommunityCard
            name="React Native Developers"
            members="12.5K"
            description="A community for React Native developers to share knowledge, tips, and collaborate on projects."
            image="⚛️"
            isJoined={true}
          />

          <CommunityCard
            name="Design Systems"
            members="8.2K"
            description="Exploring modern design systems, UI/UX trends, and creating beautiful user interfaces."
            image="🎨"
            isJoined={false}
          />

          <CommunityCard
            name="Mobile Photography"
            members="15.3K"
            description="Share your best mobile photography, tips, tricks, and editing techniques."
            image="📸"
            isJoined={true}
          />

          <CommunityCard
            name="Tech Startups"
            members="9.7K"
            description="Connect with entrepreneurs, share startup ideas, and discuss the latest in tech innovation."
            image="🚀"
            isJoined={false}
          />

          <CommunityCard
            name="iOS Development"
            members="11.1K"
            description="Native iOS development, Swift programming, and App Store optimization discussions."
            image="📱"
            isJoined={true}
          />

          <ThemedView style={styles.bottomSpacer} />
        </ScrollView>
      </ThemedView>
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
  searchButton: {
    marginBottom: 4,
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  featuredSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginBottom: 8,
  },
  communityCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  communityEmoji: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
  },
  memberCount: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  joinedButton: {
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  joinedButtonText: {
    color: '#007AFF',
  },
  communityDescription: {
    lineHeight: 20,
    opacity: 0.8,
  },
  bottomSpacer: {
    height: 100,
  },
});
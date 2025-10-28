import { ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';

export default function FeedsScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'communities', 'camera', 'profile'];

  const PostItem = ({ username, content, likes, time }: {
    username: string;
    content: string;
    likes: number;
    time: string;
  }) => (
    <ThemedView style={styles.postItem}>
      <ThemedView style={styles.postHeader}>
        <ThemedView style={styles.avatar}>
          <ThemedText style={styles.avatarText}>👤</ThemedText>
        </ThemedView>
        <ThemedView style={styles.postInfo}>
          <ThemedText type="defaultSemiBold">{username}</ThemedText>
          <ThemedText style={styles.timeText}>{time}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedText style={styles.postContent}>{content}</ThemedText>
      
      <ThemedView style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="heart" size={20} color="#FF3B30" />
          <ThemedText style={styles.actionText}>{likes}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="message" size={20} color="#007AFF" />
          <ThemedText style={styles.actionText}>Reply</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol name="paperplane.fill" size={20} color="#34C759" />
          <ThemedText style={styles.actionText}>Share</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  return (
    <SwipeTabWrapper currentTabIndex={1} tabRoutes={tabRoutes}>
      <ThemedView style={styles.container}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>Feeds</ThemedText>
      </BlurView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Posts Section */}
        <ThemedView style={styles.postsSection}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Posts</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.refreshText}>Refresh</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          
          <PostItem 
            username="john_doe"
            content="Just finished building an amazing React Native app with glassmorphism design! 🚀 The iOS-style navigation feels so smooth and modern."
            likes={42}
            time="2h"
          />
          
          <PostItem 
            username="design_lover"
            content="The new iOS design patterns are absolutely gorgeous! Love how clean and minimal everything looks with the blur effects."
            likes={28}
            time="4h"
          />
          
          <PostItem 
            username="mobile_dev"
            content="Expo 51+ features are incredible! The development experience keeps getting better and better. What's your favorite new feature?"
            likes={67}
            time="6h"
          />
          
          <PostItem 
            username="ui_enthusiast"
            content="Glassmorphism + React Native = ❤️ The depth and visual hierarchy you can achieve is amazing!"
            likes={91}
            time="8h"
          />
          
          <PostItem 
            username="tech_explorer"
            content="Building cross-platform apps has never been easier! The developer experience with modern tools is fantastic."
            likes={156}
            time="12h"
          />
          
          <PostItem 
            username="creative_coder"
            content="Working on some exciting new animations with React Native Reanimated. The possibilities are endless! 🎨"
            likes={73}
            time="1d"
          />
          
          <ThemedView style={styles.bottomSpacer} />
        </ThemedView>
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
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  postsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  postItem: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
  },
  postInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  postContent: {
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '500' : 'normal',
  },
  bottomSpacer: {
    height: 100,
  },
});
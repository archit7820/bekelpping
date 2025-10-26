import { ScrollView, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';

export default function FeedsScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'explore', 'profile', 'settings'];

  return (
    <SwipeTabWrapper currentTabIndex={1} tabRoutes={tabRoutes}>
      <ThemedView style={styles.container}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>Feeds</ThemedText>
      </BlurView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.feedItem}>
          <ThemedText type="subtitle">Latest Updates</ThemedText>
          <ThemedText>Stay connected with your friends and discover new content.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.feedItem}>
          <ThemedText type="subtitle">Trending Now</ThemedText>
          <ThemedText>Explore what's popular in your network.</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.feedItem}>
          <ThemedText type="subtitle">For You</ThemedText>
          <ThemedText>Personalized content based on your interests.</ThemedText>
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
  feedItem: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
});
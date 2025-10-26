import { ScrollView, StyleSheet, Platform, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');

  const TrendingItem = ({ hashtag, posts, category }: {
    hashtag: string;
    posts: string;
    category: string;
  }) => (
    <TouchableOpacity style={styles.trendingItem}>
      <ThemedView style={styles.trendingContent}>
        <ThemedText style={styles.category}>{category}</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.hashtag}>#{hashtag}</ThemedText>
        <ThemedText style={styles.posts}>{posts} posts</ThemedText>
      </ThemedView>
      <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
    </TouchableOpacity>
  );

  const SuggestedUser = ({ username, name, avatar }: {
    username: string;
    name: string;
    avatar: string;
  }) => (
    <TouchableOpacity style={styles.userItem}>
      <ThemedView style={styles.userInfo}>
        <ThemedView style={styles.avatar}>
          <ThemedText style={styles.avatarText}>{avatar}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.userDetails}>
          <ThemedText type="defaultSemiBold">{name}</ThemedText>
          <ThemedText style={styles.username}>@{username}</ThemedText>
        </ThemedView>
      </ThemedView>
      <TouchableOpacity style={styles.followButton}>
        <ThemedText style={styles.followText}>Follow</ThemedText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>Explore</ThemedText>
        
        <ThemedView style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, hashtags..."
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </ThemedView>
      </BlurView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Trending Now</ThemedText>
          
          <TrendingItem 
            hashtag="ReactNative"
            posts="12.5K"
            category="Technology"
          />
          <TrendingItem 
            hashtag="iOS17"
            posts="8.9K"
            category="Technology"
          />
          <TrendingItem 
            hashtag="GlassMorphism"
            posts="5.2K"
            category="Design"
          />
          <TrendingItem 
            hashtag="MobileDesign"
            posts="15.7K"
            category="Design"
          />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Suggested for You</ThemedText>
          
          <SuggestedUser 
            username="sarah_designer"
            name="Sarah Wilson"
            avatar="👩‍🎨"
          />
          <SuggestedUser 
            username="tech_guru"
            name="Alex Chen"
            avatar="👨‍💻"
          />
          <SuggestedUser 
            username="ui_master"
            name="Emma Rodriguez"
            avatar="🎨"
          />
          <SuggestedUser 
            username="code_ninja"
            name="David Kim"
            avatar="⚡"
          />
        </ThemedView>

        <ThemedView style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Platform.OS === 'ios' ? '#FFFFFF' : '#000000',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'system-ui',
  },
  content: {
    flex: 1,
    paddingTop: 160,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  trendingContent: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  hashtag: {
    fontSize: 16,
    marginBottom: 2,
  },
  posts: {
    fontSize: 12,
    opacity: 0.6,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  bottomSpacer: {
    height: 100,
  },
});

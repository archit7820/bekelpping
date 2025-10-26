import { ScrollView, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>Profile</ThemedText>
      </BlurView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.profileCard}>
          <ThemedView style={styles.avatar}>
            <ThemedText style={styles.avatarText}>👤</ThemedText>
          </ThemedView>
          <ThemedText type="subtitle" style={styles.username}>@username</ThemedText>
          <ThemedText style={styles.bio}>Your bio goes here. Share something interesting about yourself!</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">1.2K</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">5.4K</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="subtitle">892</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Recent Activity</ThemedText>
          <ThemedText>Your latest posts and interactions will appear here.</ThemedText>
        </ThemedView>
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
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  username: {
    marginBottom: 8,
  },
  bio: {
    textAlign: 'center',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    opacity: 0.6,
    fontSize: 12,
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
});
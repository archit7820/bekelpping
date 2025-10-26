import { StyleSheet, Platform, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';

export default function MessagesModal() {
  const insets = useSafeAreaInsets();

  const conversations = [
    { id: '1', name: 'John Doe', lastMessage: 'Hey! How are you doing?', time: '2m', unread: 2 },
    { id: '2', name: 'Design Team', lastMessage: 'New mockups are ready for review', time: '15m', unread: 0 },
    { id: '3', name: 'Sarah Wilson', lastMessage: 'Thanks for the help today!', time: '1h', unread: 1 },
    { id: '4', name: 'Dev Community', lastMessage: 'Check out this new React Native feature', time: '3h', unread: 0 },
  ];

  const ConversationItem = ({ item }: { item: typeof conversations[0] }) => (
    <View>
      <TouchableOpacity style={styles.conversationItem}>
        <ThemedView style={styles.avatar}>
          <ThemedText style={styles.avatarText}>👤</ThemedText>
        </ThemedView>
        <ThemedView style={styles.conversationInfo}>
          <ThemedView style={styles.conversationHeader}>
            <ThemedText type="defaultSemiBold" style={styles.conversationName}>
              {item.name}
            </ThemedText>
            <ThemedText style={styles.timeText}>{item.time}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.messagePreview}>
            <ThemedText style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </ThemedText>
            {item.unread > 0 && (
              <ThemedView style={styles.unreadBadge}>
                <ThemedText style={styles.unreadText}>{item.unread}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="xmark" size={24} color="#007AFF" />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Messages</ThemedText>
        <TouchableOpacity style={styles.composeButton}>
          <IconSymbol name="square.and.pencil" size={24} color="#007AFF" />
        </TouchableOpacity>
      </BlurView>

      {/* Search Bar */}
      <ThemedView style={[styles.searchContainer, { paddingTop: insets.top + 80 }]}>
        <ThemedView style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="rgba(255,255,255,0.6)" />
          <ThemedText style={styles.searchPlaceholder}>Search messages...</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationItem item={item} />}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
  },
  composeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingTop: 180,
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    opacity: 0.7,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
});
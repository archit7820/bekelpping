import React from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';

interface MessageItemProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  isOnline: boolean;
  unreadCount: number;
  avatar: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  lastMessage,
  time,
  isOnline,
  unreadCount,
  avatar,
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity style={styles.messageItem}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <Text style={styles.avatarText}>{avatar}</Text>
        </View>
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.senderName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {name}
          </Text>
          <Text style={[styles.messageTime, { color: Colors[colorScheme ?? 'light'].icon }]}>
            {time}
          </Text>
        </View>
        <Text 
          style={[
            styles.lastMessage, 
            { color: Colors[colorScheme ?? 'light'].icon },
            unreadCount > 0 && { fontWeight: '600', color: Colors[colorScheme ?? 'light'].text }
          ]}
          numberOfLines={1}
        >
          {lastMessage}
        </Text>
      </View>
      
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function MessagesModal() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const messages: MessageItemProps[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Hey! Love your latest photo 📸',
      time: '2m',
      isOnline: true,
      unreadCount: 2,
      avatar: '👩‍💼',
    },
    {
      id: '2',
      name: 'Photography Club',
      lastMessage: 'New challenge: Golden Hour shots!',
      time: '1h',
      isOnline: false,
      unreadCount: 1,
      avatar: '📷',
    },
    {
      id: '3',
      name: 'Alex Chen',
      lastMessage: 'Thanks for the follow!',
      time: '3h',
      isOnline: true,
      unreadCount: 0,
      avatar: '👨‍💻',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      lastMessage: 'Where was this shot taken?',
      time: '1d',
      isOnline: false,
      unreadCount: 0,
      avatar: '👩‍🎨',
    },
    {
      id: '5',
      name: 'Impact Team',
      lastMessage: 'Welcome to Impact! Start exploring...',
      time: '2d',
      isOnline: false,
      unreadCount: 0,
      avatar: '🚀',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Messages
        </Text>
        <TouchableOpacity style={styles.composeButton}>
          <IconSymbol name="square.and.pencil" size={24} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
      </BlurView>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { paddingTop: insets.top + 80 }]}>
        <View style={[styles.searchBar, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
          <IconSymbol name="magnifyingglass" size={20} color={Colors[colorScheme ?? 'light'].icon} />
          <Text style={[styles.searchPlaceholder, { color: Colors[colorScheme ?? 'light'].icon }]}>
            Search messages...
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
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
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  content: {
    flex: 1,
    paddingTop: 160,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  messageTime: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  bottomSpacer: {
    height: 100,
  },
});
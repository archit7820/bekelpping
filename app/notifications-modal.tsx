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

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  isRead: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  time,
  type,
  isRead,
}) => {
  const colorScheme = useColorScheme();
  
  const getIconAndColor = () => {
    switch (type) {
      case 'like':
        return { icon: 'heart.fill', color: '#FF3B30' };
      case 'comment':
        return { icon: 'bubble.left.fill', color: '#007AFF' };
      case 'follow':
        return { icon: 'person.badge.plus.fill', color: '#30D158' };
      case 'mention':
        return { icon: 'at.badge.plus', color: '#FF9500' };
      default:
        return { icon: 'bell.fill', color: Colors[colorScheme ?? 'light'].tint };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        { backgroundColor: isRead ? 'transparent' : 'rgba(0, 122, 255, 0.05)' }
      ]}
    >
      <View style={[styles.notificationIcon, { backgroundColor: color }]}>
        <IconSymbol name={icon as any} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {title}
        </Text>
        <Text style={[styles.notificationMessage, { color: Colors[colorScheme ?? 'light'].icon }]}>
          {message}
        </Text>
        <Text style={[styles.notificationTime, { color: Colors[colorScheme ?? 'light'].icon }]}>
          {time}
        </Text>
      </View>
      {!isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

export default function NotificationsModal() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const notifications: NotificationItemProps[] = [
    {
      id: '1',
      title: 'Sarah liked your post',
      message: 'Your sunset photo got a new like!',
      time: '2 minutes ago',
      type: 'like',
      isRead: false,
    },
    {
      id: '2',
      title: 'New follower',
      message: 'John started following you',
      time: '1 hour ago',
      type: 'follow',
      isRead: false,
    },
    {
      id: '3',
      title: 'Comment on your post',
      message: 'Emma: "Amazing shot! 📸"',
      time: '3 hours ago',
      type: 'comment',
      isRead: true,
    },
    {
      id: '4',
      title: 'You were mentioned',
      message: 'Alex mentioned you in a comment',
      time: '1 day ago',
      type: 'mention',
      isRead: true,
    },
    {
      id: '5',
      title: 'Weekly Impact Report',
      message: 'Your content reached 2.5K people this week!',
      time: '2 days ago',
      type: 'system',
      isRead: true,
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
          Notifications
        </Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={[styles.markAllText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            Mark All
          </Text>
        </TouchableOpacity>
      </BlurView>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
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
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  content: {
    flex: 1,
    paddingTop: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'System',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginTop: 8,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
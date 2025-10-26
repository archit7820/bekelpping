import { StyleSheet, Platform, TouchableOpacity, ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import React from 'react';

export default function SettingsModal() {
  const insets = useSafeAreaInsets();
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

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Animated.View style={animatedStyle}>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
        {children}
      </ThemedView>
    </Animated.View>
  );

  const SettingsItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress: () => void; 
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <IconSymbol name={icon as any} size={24} color="#007AFF" style={styles.settingsIcon} />
      <ThemedView style={styles.settingsContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {subtitle && <ThemedText style={styles.settingsSubtitle}>{subtitle}</ThemedText>}
      </ThemedView>
      {showChevron && (
        <IconSymbol name="chevron.right" size={16} color="#007AFF" />
      )}
    </TouchableOpacity>
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
        <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
        <TouchableOpacity style={styles.searchButton}>
          <IconSymbol name="magnifyingglass" size={24} color="#007AFF" />
        </TouchableOpacity>
      </BlurView>

      {/* Search Bar */}
      <ThemedView style={[styles.searchContainer, { paddingTop: insets.top + 80 }]}>
        <ThemedView style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={20} color="rgba(255,255,255,0.6)" />
          <ThemedText style={styles.searchPlaceholder}>Search settings...</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20 }}>
        <SettingsSection title="Account">
          <SettingsItem
            icon="person.circle"
            title="Profile"
            subtitle="Manage your profile information"
            onPress={() => console.log('Profile pressed')}
          />
          <SettingsItem
            icon="key"
            title="Privacy & Security"
            subtitle="Control your privacy settings"
            onPress={() => console.log('Privacy pressed')}
          />
          <SettingsItem
            icon="bell"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => console.log('Notifications pressed')}
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            icon="paintbrush"
            title="Appearance"
            subtitle="Dark mode, themes, and display"
            onPress={() => console.log('Appearance pressed')}
          />
          <SettingsItem
            icon="globe"
            title="Language & Region"
            subtitle="Change language and location settings"
            onPress={() => console.log('Language pressed')}
          />
          <SettingsItem
            icon="icloud"
            title="Storage & Backup"
            subtitle="Manage your data and backups"
            onPress={() => console.log('Storage pressed')}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon="questionmark.circle"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => console.log('Help pressed')}
          />
          <SettingsItem
            icon="info.circle"
            title="About"
            subtitle="App version and information"
            onPress={() => console.log('About pressed')}
          />
        </SettingsSection>

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
  searchButton: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});
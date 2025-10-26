import { ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SwipeTabWrapper } from '@/components/swipe-tab-wrapper';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabRoutes = ['index', 'feeds', 'explore', 'profile', 'settings'];
  
  const SettingItem = ({ title, subtitle, icon, onPress }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <IconSymbol name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
      <ThemedView style={styles.settingContent}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        {subtitle && <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>}
      </ThemedView>
      <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
    </TouchableOpacity>
  );
  
  return (
    <SwipeTabWrapper currentTabIndex={4} tabRoutes={tabRoutes}>
      <ThemedView style={styles.container}>
        <BlurView intensity={20} style={[styles.header, { paddingTop: insets.top }]}>
          <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
        </BlurView>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Account</ThemedText>
            <SettingItem 
              title="Profile Settings" 
              subtitle="Edit your profile information"
              icon="person.circle"
            />
            <SettingItem 
              title="Privacy & Security" 
              subtitle="Manage your privacy settings"
              icon="lock.shield"
            />
            <SettingItem 
              title="Notifications" 
              subtitle="Configure notification preferences"
              icon="bell"
            />
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>App Settings</ThemedText>
            <SettingItem 
              title="Appearance" 
              subtitle="Dark mode, themes, and display"
              icon="paintbrush"
            />
            <SettingItem 
              title="Language & Region" 
              subtitle="Change language and region settings"
              icon="globe"
            />
            <SettingItem 
              title="Storage" 
              subtitle="Manage app storage and cache"
              icon="internaldrive"
            />
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Support</ThemedText>
            <SettingItem 
              title="Help Center" 
              subtitle="Get help and find answers"
              icon="questionmark.circle"
            />
            <SettingItem 
              title="Contact Us" 
              subtitle="Send feedback or report issues"
              icon="envelope"
            />
            <SettingItem 
              title="About" 
              subtitle="App version and legal information"
              icon="info.circle"
            />
          </ThemedView>

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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
  bottomSpacer: {
    height: 100,
  },
});

import { StyleSheet, Platform, TouchableOpacity, ScrollView, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsModal() {
  const insets = useSafeAreaInsets();
  const { logout, checkAuthStatus } = useAuth();

  const clearAllStorage = async () => {
    Alert.alert(
      '🗑️ Clear All Storage',
      'This will log you out and reset the app to initial state. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              await AsyncStorage.clear();
              await checkAuthStatus();
              
              Alert.alert(
                'Storage Cleared',
                `Cleared ${keys.length} items. App will reset to onboarding.`,
                [{ text: 'OK', onPress: () => router.replace('/') }]
              );
            } catch (error) {
              Alert.alert('Error', `Failed to clear storage: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const clearAuthOnly = async () => {
    Alert.alert(
      '🔑 Clear Auth Data',
      'This will log you out but preserve other app data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Auth',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'hasCompletedOnboarding']);
              await checkAuthStatus();
              
              Alert.alert(
                'Auth Cleared',
                'Authentication data cleared. Redirecting to onboarding.',
                [{ text: 'OK', onPress: () => router.replace('/') }]
              );
            } catch (error) {
              Alert.alert('Error', `Failed to clear auth: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const viewStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      
      const storageData = items
        .map(([key, value]) => `${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`)
        .join('\n\n');
      
      Alert.alert(
        '👀 Current Storage',
        storageData || 'Storage is empty',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to read storage: ${error.message}`);
    }
  };

  const testBackendConnection = async () => {
    Alert.alert(
      '🔌 Testing Backend Connection',
      'Testing connection to your backend...',
      [{ text: 'OK' }]
    );
    
    try {
      // Import API config to get the URL
      const { API_URL } = await import('@/config/api');
      
      console.log(`🧪 Testing connection to: ${API_URL}`);
      console.log(`📱 Platform: ${Platform.OS}`);
      
      // Test basic connectivity - try root endpoint since we know it exists
      const response = await fetch(`${API_URL}/`, {
        method: 'GET',
        timeout: 8000,
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (response.status === 404) {
        // 404 is expected - means server is reachable!
        Alert.alert(
          '✅ Connection SUCCESS!',
          `Backend is reachable from your phone!\n\nURL: ${API_URL}\nStatus: ${response.status} (Expected)\n\nYour app should now work with the backend. The auth endpoints just need to be implemented.`,
          [{ text: 'Excellent!' }]
        );
      } else if (response.ok) {
        Alert.alert(
          '✅ Connection Success',
          `Backend is reachable!\nURL: ${API_URL}\nStatus: ${response.status}`,
          [{ text: 'Great!' }]
        );
      } else {
        Alert.alert(
          '⚠️ Partial Success',
          `Backend responded but with status: ${response.status}\nURL: ${API_URL}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      
      let message = `Cannot connect to backend from your phone.\n\nURL: ${API_URL}\nError: ${error.message}\n\n`;
      
      if (error.message === 'Network request failed') {
        message += `Troubleshooting for Physical Device:\n\n`;
        message += `1. Make sure computer and phone are on same WiFi\n`;
        message += `2. Check computer's firewall settings\n`;
        message += `3. Try: curl https://kelp-backend.onrender.com from another device\n`;
        message += `4. Ensure backend is listening on 0.0.0.0:5000 not just localhost`;
      }
      
      Alert.alert('❌ Connection Failed', message, [{ text: 'OK' }]);
    }
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
        {children}
      </ThemedView>
    </View>
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

        <SettingsSection title="🧪 Testing Tools">
          <SettingsItem
            icon="wifi"
            title="Test Backend Connection"
            subtitle="Check if backend on port 5000 is reachable"
            onPress={testBackendConnection}
          />
          <SettingsItem
            icon="eye"
            title="View Storage"
            subtitle="See what's stored in AsyncStorage"
            onPress={viewStorage}
          />
          <SettingsItem
            icon="key"
            title="Clear Auth Only"
            subtitle="Clear authentication but keep other data"
            onPress={clearAuthOnly}
          />
          <SettingsItem
            icon="trash"
            title="Clear All Storage"
            subtitle="Reset app to initial state (for testing)"
            onPress={clearAllStorage}
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
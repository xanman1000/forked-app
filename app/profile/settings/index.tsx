import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import {
  User,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  Info,
  ChevronRight,
  Share2,
  LogOut
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Define theme colors
const lightColors = {
  background: '#F9F8F6',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.05)',
  tint: '#B7D6C2',
  red: '#E57373',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  border: 'rgba(255, 255, 255, 0.1)',
  tint: '#B7D6C2',
  red: '#F48FB1',
};

// Function to trigger haptic feedback
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
  if (Platform.OS !== 'web') {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  }
};

export default function SettingsScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Navigation handlers
  const navigateTo = (route: string) => {
    triggerHaptic('light');
    router.push(route as any);
  };
  
  const logout = () => {
    triggerHaptic('warning');
    // In a real app, this would clear authentication tokens and redirect to login
    router.replace('/(auth)/login-signup');
  };
  
  const shareProfile = () => {
    triggerHaptic('medium');
    // In a real app, this would open the share sheet with the profile link
    console.log('Share profile');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Account Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACCOUNT SETTINGS
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Account Information */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => navigateTo('/profile/settings/account')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <User size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Account Information
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Notifications */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => navigateTo('/profile/settings/notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Bell size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Privacy */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => navigateTo('/profile/settings/privacy')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Lock size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Privacy
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Security */}
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => navigateTo('/profile/settings/security')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Lock size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Security
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Support & About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUPPORT & ABOUT
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Help Center */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => navigateTo('/profile/settings/help')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <HelpCircle size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Help Center
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Terms & Policies */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={() => navigateTo('/profile/settings/terms')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <FileText size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Terms & Policies
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* About */}
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => navigateTo('/profile/settings/about')}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Info size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  About
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACTIONS
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Share Profile */}
            <TouchableOpacity 
              style={[styles.settingRow, { borderBottomColor: colors.border }]}
              onPress={shareProfile}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Share2 size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Share Profile
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Logout */}
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={logout}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.red + '20' }]}>
                  <LogOut size={20} color={colors.red} />
                </View>
                <Text style={[styles.settingLogout, { color: colors.red }]}>
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginBottom: 8,
  },
  settingsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  settingLogout: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
}); 
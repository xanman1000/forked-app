import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  useColorScheme,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Lock, Eye, Globe, EyeOff, Shield, Users } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Define theme colors
const lightColors = {
  background: '#F9F8F6',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.05)',
  tint: '#B7D6C2',
  switchTrack: '#E9E9E9',
  switchTrackActive: '#B7D6C2',
  switchThumb: '#FFFFFF',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  border: 'rgba(255, 255, 255, 0.1)',
  tint: '#B7D6C2',
  switchTrack: '#3A3A3A',
  switchTrackActive: '#538D6C',
  switchThumb: '#FFFFFF',
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

export default function PrivacySettingsScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // 'public', 'followers', 'private'
    showRecipeLikes: true,
    showSavedRecipes: true,
    allowDiscovery: true,
    dataPersonalization: true,
    allowDataCollection: true,
  });
  
  // Toggle switch handler
  const toggleSwitch = (key: 'showRecipeLikes' | 'showSavedRecipes' | 'allowDiscovery' | 'dataPersonalization' | 'allowDataCollection') => {
    triggerHaptic('light');
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Change profile visibility
  const setProfileVisibility = (value: 'public' | 'followers' | 'private') => {
    triggerHaptic('medium');
    setPrivacySettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };
  
  // Navigate back
  const goBack = () => {
    triggerHaptic('light');
    router.back();
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
        {/* Profile Visibility Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            PROFILE VISIBILITY
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.settingHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.settingHeaderLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Eye size={20} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Who can see my profile
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Control who can view your profile information
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Public option */}
            <TouchableOpacity 
              style={[styles.radioOption, { borderBottomColor: colors.border }]}
              onPress={() => setProfileVisibility('public')}
              activeOpacity={0.7}
            >
              <View style={styles.radioOptionLeft}>
                <View style={[styles.iconSmall, { backgroundColor: colors.tint + '10' }]}>
                  <Globe size={16} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.radioLabel, { color: colors.text }]}>
                    Public
                  </Text>
                  <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>
                    Anyone can view your profile
                  </Text>
                </View>
              </View>
              <View style={styles.radioIndicator}>
                <View 
                  style={[
                    styles.radioOuter, 
                    { borderColor: privacySettings.profileVisibility === 'public' ? colors.tint : colors.border }
                  ]}
                >
                  {privacySettings.profileVisibility === 'public' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Followers option */}
            <TouchableOpacity 
              style={[styles.radioOption, { borderBottomColor: colors.border }]}
              onPress={() => setProfileVisibility('followers')}
              activeOpacity={0.7}
            >
              <View style={styles.radioOptionLeft}>
                <View style={[styles.iconSmall, { backgroundColor: colors.tint + '10' }]}>
                  <Users size={16} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.radioLabel, { color: colors.text }]}>
                    Followers Only
                  </Text>
                  <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>
                    Only people who follow you can view your profile
                  </Text>
                </View>
              </View>
              <View style={styles.radioIndicator}>
                <View 
                  style={[
                    styles.radioOuter, 
                    { borderColor: privacySettings.profileVisibility === 'followers' ? colors.tint : colors.border }
                  ]}
                >
                  {privacySettings.profileVisibility === 'followers' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Private option */}
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setProfileVisibility('private')}
              activeOpacity={0.7}
            >
              <View style={styles.radioOptionLeft}>
                <View style={[styles.iconSmall, { backgroundColor: colors.tint + '10' }]}>
                  <EyeOff size={16} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.radioLabel, { color: colors.text }]}>
                    Private
                  </Text>
                  <Text style={[styles.radioDescription, { color: colors.textSecondary }]}>
                    Only you can view your profile
                  </Text>
                </View>
              </View>
              <View style={styles.radioIndicator}>
                <View 
                  style={[
                    styles.radioOuter, 
                    { borderColor: privacySettings.profileVisibility === 'private' ? colors.tint : colors.border }
                  ]}
                >
                  {privacySettings.profileVisibility === 'private' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Activity Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACTIVITY PRIVACY
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Show Recipe Likes */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Show Recipe Likes
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Allow others to see which recipes you've liked
                </Text>
              </View>
              <Switch
                value={privacySettings.showRecipeLikes}
                onValueChange={() => toggleSwitch('showRecipeLikes')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Show Saved Recipes */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Show Saved Recipes
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Allow others to see recipes you've saved
                </Text>
              </View>
              <Switch
                value={privacySettings.showSavedRecipes}
                onValueChange={() => toggleSwitch('showSavedRecipes')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
          </View>
        </View>
        
        {/* Discoverability Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DISCOVERABILITY
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Allow Discovery */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Globe size={20} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Allow People to Find Me
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Let others discover your profile through search
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.allowDiscovery}
                onValueChange={() => toggleSwitch('allowDiscovery')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
          </View>
        </View>
        
        {/* Data Privacy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DATA PRIVACY
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Data Personalization */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Shield size={20} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Personalized Recommendations
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Use my activity to personalize my experience
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.dataPersonalization}
                onValueChange={() => toggleSwitch('dataPersonalization')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Data Collection */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Lock size={20} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Analytics Data Collection
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Allow usage data collection to improve the app
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.allowDataCollection}
                onValueChange={() => toggleSwitch('allowDataCollection')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
          </View>
        </View>
        
        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            These privacy settings control how your information is shared within the Forked app. 
            Changes to these settings take effect immediately. You can review our Privacy Policy for more information.
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
  backButton: {
    padding: 8,
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
  settingHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  radioOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioIndicator: {
    marginLeft: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  radioLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  radioDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
}); 
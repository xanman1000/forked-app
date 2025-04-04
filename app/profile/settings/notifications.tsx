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
import { Bell, Heart, MessageCircle, AtSign, Star, ChefHat, Award } from 'lucide-react-native';
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

export default function NotificationsSettingsScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    allNotifications: true,
    likes: true,
    comments: true,
    mentions: true,
    followers: true,
    newRecipes: true,
    achievements: false,
    emailDigest: true,
    pushNotifications: true,
  });
  
  // Toggle switch handler
  const toggleSwitch = (key: keyof typeof notifications) => {
    triggerHaptic('light');
    
    if (key === 'allNotifications') {
      // If toggling master switch, set all switches to the new value
      const newValue = !notifications.allNotifications;
      setNotifications({
        allNotifications: newValue,
        likes: newValue,
        comments: newValue,
        mentions: newValue,
        followers: newValue,
        newRecipes: newValue,
        achievements: newValue,
        emailDigest: notifications.emailDigest, // Keep these unchanged
        pushNotifications: notifications.pushNotifications, // Keep these unchanged
      });
    } else {
      // Toggle individual switch
      setNotifications({
        ...notifications,
        [key]: !notifications[key],
        // Check if all individual notification switches are on
        allNotifications: 
          key === 'likes' ? 
            !notifications[key] && notifications.comments && notifications.mentions && 
            notifications.followers && notifications.newRecipes && notifications.achievements
            : 
            notifications.likes && 
            (key === 'comments' ? !notifications[key] : notifications.comments) && 
            (key === 'mentions' ? !notifications[key] : notifications.mentions) && 
            (key === 'followers' ? !notifications[key] : notifications.followers) && 
            (key === 'newRecipes' ? !notifications[key] : notifications.newRecipes) && 
            (key === 'achievements' ? !notifications[key] : notifications.achievements)
      });
    }
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
        {/* Main Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATION PREFERENCES
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Master Switch */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Bell size={20} color={colors.tint} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    All Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    Enable or disable all notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.allNotifications}
                onValueChange={() => toggleSwitch('allNotifications')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Likes */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Heart size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Likes
                </Text>
              </View>
              <Switch
                value={notifications.likes}
                onValueChange={() => toggleSwitch('likes')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Comments */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <MessageCircle size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Comments
                </Text>
              </View>
              <Switch
                value={notifications.comments}
                onValueChange={() => toggleSwitch('comments')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Mentions */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <AtSign size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Mentions
                </Text>
              </View>
              <Switch
                value={notifications.mentions}
                onValueChange={() => toggleSwitch('mentions')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Followers */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Star size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  New Followers
                </Text>
              </View>
              <Switch
                value={notifications.followers}
                onValueChange={() => toggleSwitch('followers')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* New Recipes */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <ChefHat size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  New Recipes
                </Text>
              </View>
              <Switch
                value={notifications.newRecipes}
                onValueChange={() => toggleSwitch('newRecipes')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Achievements */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Award size={20} color={colors.tint} />
                </View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Achievements
                </Text>
              </View>
              <Switch
                value={notifications.achievements}
                onValueChange={() => toggleSwitch('achievements')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
          </View>
        </View>
        
        {/* Delivery Methods Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DELIVERY METHODS
          </Text>
          
          <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
            {/* Email */}
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Email Digest
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive a weekly summary of activity
                </Text>
              </View>
              <Switch
                value={notifications.emailDigest}
                onValueChange={() => toggleSwitch('emailDigest')}
                trackColor={{ false: colors.switchTrack, true: colors.switchTrackActive }}
                thumbColor={colors.switchThumb}
                ios_backgroundColor={colors.switchTrack}
              />
            </View>
            
            {/* Push Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Push Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={notifications.pushNotifications}
                onValueChange={() => toggleSwitch('pushNotifications')}
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
            You can customize which notifications you receive and how they are delivered. Notifications 
            help you stay updated on activity related to your account, recipes, and social interactions.
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
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
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
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
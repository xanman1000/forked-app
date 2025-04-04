import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  StatusBar,
  useColorScheme,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Heart, Mail, Globe, Twitter, Instagram, ExternalLink } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Define theme colors
const lightColors = {
  background: '#F9F8F6',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.05)',
  tint: '#B7D6C2',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  border: 'rgba(255, 255, 255, 0.1)',
  tint: '#B7D6C2',
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

export default function AboutScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Open URL function
  const openUrl = (url: string) => {
    triggerHaptic('medium');
    Linking.openURL(url).catch((err) => console.error('Error opening URL: ', err));
  };
  
  // Send email function
  const sendEmail = () => {
    triggerHaptic('medium');
    Linking.openURL('mailto:support@forkedapp.io').catch((err) => 
      console.error('Error opening mail client: ', err)
    );
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
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.text }]}>
            Forked
          </Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
            Version 1.0.0 (Build 42)
          </Text>
        </View>
        
        {/* App Description */}
        <View style={styles.section}>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            Forked is your personal recipe companion, helping you discover, 
            save, and share delicious recipes from around the world. Connect with 
            other food enthusiasts and build your culinary creativity.
          </Text>
        </View>
        
        {/* Contact & Social Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            CONNECT WITH US
          </Text>
          
          <View style={[styles.linksContainer, { backgroundColor: colors.card }]}>
            {/* Website */}
            <TouchableOpacity 
              style={[styles.linkRow, { borderBottomColor: colors.border }]}
              onPress={() => openUrl('https://forkedapp.io')}
              activeOpacity={0.7}
            >
              <View style={styles.linkContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Globe size={20} color={colors.tint} />
                </View>
                <Text style={[styles.linkText, { color: colors.text }]}>
                  Website
                </Text>
              </View>
              <ExternalLink size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Email Support */}
            <TouchableOpacity 
              style={[styles.linkRow, { borderBottomColor: colors.border }]}
              onPress={sendEmail}
              activeOpacity={0.7}
            >
              <View style={styles.linkContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Mail size={20} color={colors.tint} />
                </View>
                <Text style={[styles.linkText, { color: colors.text }]}>
                  Email Support
                </Text>
              </View>
              <ExternalLink size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Twitter */}
            <TouchableOpacity 
              style={[styles.linkRow, { borderBottomColor: colors.border }]}
              onPress={() => openUrl('https://twitter.com/forkedapp')}
              activeOpacity={0.7}
            >
              <View style={styles.linkContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Twitter size={20} color={colors.tint} />
                </View>
                <Text style={[styles.linkText, { color: colors.text }]}>
                  Twitter
                </Text>
              </View>
              <ExternalLink size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            
            {/* Instagram */}
            <TouchableOpacity 
              style={styles.linkRow}
              onPress={() => openUrl('https://instagram.com/forkedapp')}
              activeOpacity={0.7}
            >
              <View style={styles.linkContent}>
                <View style={[styles.iconContainer, { backgroundColor: colors.tint + '20' }]}>
                  <Instagram size={20} color={colors.tint} />
                </View>
                <Text style={[styles.linkText, { color: colors.text }]}>
                  Instagram
                </Text>
              </View>
              <ExternalLink size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Credits Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACKNOWLEDGEMENTS
          </Text>
          
          <View style={[styles.creditsContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.creditsText, { color: colors.text }]}>
              Forked is built with love using React Native and Expo.{'\n\n'}
              Special thanks to our early testers and the open source community for 
              making this app possible.
            </Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2023 Forked App. All rights reserved.
          </Text>
          
          <View style={styles.legalLinks}>
            <TouchableOpacity 
              onPress={() => navigateTo('/profile/settings/terms')}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={[styles.legalLink, { color: colors.tint }]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text style={[styles.legalSeparator, { color: colors.textSecondary }]}>•</Text>
            <TouchableOpacity 
              onPress={() => navigateTo('/profile/settings/privacy')}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={[styles.legalLink, { color: colors.tint }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.madeWithLove}>
            <Text style={[styles.madeWithText, { color: colors.textSecondary }]}>
              Made with 
            </Text>
            <Heart size={14} color={colors.tint} fill={colors.tint} />
            <Text style={[styles.madeWithText, { color: colors.textSecondary }]}>
              in California
            </Text>
          </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 12,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginBottom: 8,
  },
  linksContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  creditsContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  creditsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 12,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legalLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  legalSeparator: {
    marginHorizontal: 8,
    fontSize: 10,
  },
  madeWithLove: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  madeWithText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginHorizontal: 4,
  },
});

// Helper function for navigation
const navigateTo = (route: string) => {
  router.push(route as any);
}; 
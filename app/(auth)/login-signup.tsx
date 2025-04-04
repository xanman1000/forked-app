import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, useColorScheme, Alert, KeyboardAvoidingView, Linking as RNLinking } from 'react-native';
import { Stack, router } from 'expo-router';
import { Mail, AlertCircle, X } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { SvgXml } from 'react-native-svg';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

// Colorful Google logo SVG
const googleLogoSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
  <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
  <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.51947C-0.15674 10.0056 -0.15674 14.0004 1.51947 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
  <path d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50267 9.70575C6.45508 6.86173 9.1095 4.74966 12.24 4.74966Z" fill="#EA4335"/>
</svg>`;

// Apple logo SVG
const appleLogoSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.0509 12.4909C17.0567 11.1557 17.6752 9.87594 18.7784 9.06848C17.7199 7.55968 16.0147 6.71993 14.2323 6.75C12.3261 6.54687 10.4686 7.8346 9.49856 7.8346C8.50966 7.8346 6.98856 6.77243 5.37605 6.80618C3.20384 6.87368 1.2584 8.12207 0.260461 10.057C-1.81453 14.0114 0.472461 19.802 2.45652 22.9252C3.4454 24.4533 4.60403 26.1547 6.1261 26.0984C7.6134 26.0359 8.16731 25.159 9.9552 25.159C11.7255 25.159 12.243 26.0984 13.8042 26.0621C15.413 26.0359 16.4019 24.5378 17.3532 23.0035C18.0186 21.9898 18.5247 20.8759 18.8555 19.7033C17.4603 19.1298 16.5564 17.8472 16.5621 16.4242C16.5693 15.0036 17.4747 13.7232 18.8699 13.1478C18.3509 12.886 17.7947 12.7221 17.2286 12.6649C17.17 12.6068 17.0509 12.6068 17.0509 12.4909Z" fill="black"/>
  <path d="M14.2265 4.97841C15.0946 3.93841 15.4771 2.60501 15.3234 1.27161C14.0275 1.44716 12.8461 2.12037 12.0196 3.16037C11.209 4.16669 10.8233 5.46891 10.9742 6.77116C12.2701 6.78937 13.4559 6.13819 14.2265 4.97841Z" fill="black"/>
</svg>`;

// Brand colors
const BRAND_COLORS = {
  background: '#F9F8F6', // Off-White Speckled
  primary: '#2F3A32', // Dark Green/Charcoal
  accent: '#B7D6C2', // Mint/Sage accent
  text: '#333333', // Text standard
};

export default function LoginSignupScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors that match the brand style
  const theme = {
    background: isDark ? '#121212' : BRAND_COLORS.background,
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : BRAND_COLORS.text,
    textSecondary: isDark ? '#AAAAAA' : BRAND_COLORS.primary,
    primary: BRAND_COLORS.primary,
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(47, 58, 50, 0.1)',
    accent: BRAND_COLORS.accent,
    red: isDark ? '#F48FB1' : '#E57373',
  };

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear email input
  const clearEmail = () => {
    setEmail('');
    setAuthError(null);
  };

  // Handle email continue
  const handleEmailContinue = () => {
    if (!email.trim()) {
      setAuthError('Please enter your email');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAuthError('Please enter a valid email');
      return;
    }
    
    router.push({
      pathname: '/(auth)/email-auth',
      params: { email }
    });
  };

  // Handle OAuth (Google, Apple)
  const handleOAuth = async (provider: 'apple' | 'google') => {
    setLoading(true);
    
    // Get redirect URL for OAuth
    const redirectURL = Linking.createURL('auth-callback');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectURL,
          skipBrowserRedirect: false // Allow automatic browser redirect
        }
      });
      
      if (error) throw error;
      
      // For OAuth in a mobile app, we need to open the authorization URL
      if (data?.url) {
        // Open the authentication URL using WebBrowser instead of RNLinking
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectURL
        );
        
        console.log('OAuth browser session result:', result.type);
        
        if (result.type === 'success') {
          // The user was redirected back to our app
          // Supabase auth will handle the token exchange
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error(`OAuth (${provider}) error:`, error.message);
      Alert.alert("authentication error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: theme.text }]}>forked</Text>
          </View>
          
          <Text style={[styles.header, { color: theme.text, textTransform: 'lowercase' }]}>welcome to forked</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { 
              backgroundColor: theme.card, 
              borderColor: authError ? theme.red : theme.border
            }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (authError) setAuthError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && (
                <TouchableOpacity onPress={clearEmail} style={styles.clearButton}>
                  <X size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {authError && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color={theme.red} style={styles.errorIcon} />
                <Text style={[styles.errorText, { color: theme.red }]}>{authError}</Text>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }
            ]} 
            onPress={handleEmailContinue}
            disabled={loading}
          >
            <Text style={[styles.continueButtonText, { textTransform: 'lowercase' }]}>continue</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.separatorText, { color: theme.textSecondary }]}>or</Text>
            <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <TouchableOpacity 
              style={[styles.oauthButton, { borderColor: theme.border }]} 
              onPress={() => handleOAuth('google')}
              disabled={loading}
            >
              <SvgXml xml={googleLogoSvg} width={24} height={24} />
              <Text style={[styles.oauthButtonText, { color: theme.text, textTransform: 'lowercase' }]}>continue with google</Text>
            </TouchableOpacity>
            
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={[styles.oauthButton, { borderColor: theme.border }]} 
                onPress={() => handleOAuth('apple')}
                disabled={loading}
              >
                <SvgXml xml={appleLogoSvg} width={24} height={24} />
                <Text style={[styles.oauthButtonText, { color: theme.text, textTransform: 'lowercase' }]}>continue with apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <View style={styles.brandContainer}>
          <Text style={[styles.footerText, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
            powered by
          </Text>
          <Text style={[styles.footerBrand, { color: theme.text, textTransform: 'lowercase' }]}>
            forked
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  continueButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  oauthContainer: {
    gap: 16,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
    gap: 12,
  },
  oauthButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 24,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerBrand: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
}); 
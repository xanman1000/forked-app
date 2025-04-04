import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform, Alert, useColorScheme, Image,
  KeyboardAvoidingView, ScrollView, Dimensions
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

// Key for tracking if user completed onboarding
const ONBOARDING_COMPLETE_KEY = 'forked_onboarding_complete';

// Brand colors
const BRAND_COLORS = {
  background: '#F9F8F6', // Off-White Speckled
  primary: '#2F3A32', // Dark Green/Charcoal
  accent: '#B7D6C2', // Mint/Sage accent
  text: '#333333', // Text standard
};

// Get screen dimensions for responsive layouts
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EmailAuthScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(params.isSignUp === 'true');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get redirect URL for auth
  const redirectTo = Linking.createURL('auth-callback');
  
  // Set email from params if provided
  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params]);
  
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

  const handleEmailAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      setLoading(false);
      return;
    }
    
    if (isSignUp && !password) {
      setErrorMessage('Please create a password');
      setLoading(false);
      return;
    }
    
    // Get dynamic redirect URL
    const redirectURL = Linking.createURL('auth-callback');
    
    try {
      if (isSignUp) {
        // Sign up flow with Supabase - specifying redirect URL for email verification
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectURL
          }
        });
        
        if (error) throw error;
        
        // For sign-up, we still need to verify email even if technically successful
        setHasSubmitted(true);
      } else {
        // Magic link sign-in (passwordless) with redirect URL
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectURL
          }
        });
        
        if (error) throw error;
        
        // For magic link, we always need to verify
        setHasSubmitted(true);
      }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('Sign in successful');
      // Navigate to main app on successful login
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(null);
  };
  
  if (hasSubmitted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.emailSentContainer}>
          <Text style={[styles.logoText, { color: theme.text }]}>forked</Text>
          
          <Mail size={60} color={theme.primary} style={styles.emailIcon} />
          
          <Text style={[styles.header, { color: theme.text }]}>Check your email</Text>
          
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            We've sent a {isSignUp ? 'verification link' : 'sign-in link'} to
          </Text>
          <Text style={[styles.emailText, { color: theme.text }]}>{email}</Text>
          
          <Text style={[styles.instruction, { color: theme.textSecondary }]}>
            Click the link in your email to {isSignUp ? 'complete your registration' : 'sign in'}.
            The link will expire in 24 hours.
          </Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(auth)/login-signup')}
          >
            <Text style={styles.buttonText}>Return to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          
          <Text style={[styles.logoText, { color: theme.text }]}>forked</Text>
          
          <Text style={[styles.header, { color: theme.text }]}>
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </Text>
          
          <Text style={[styles.subheader, { color: theme.textSecondary }]}>
            {isSignUp 
              ? 'Join our growing community of food lovers'
              : 'Sign in with your email to continue'}
          </Text>
          
          <View style={styles.formContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              placeholder="Enter your email address"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            
            {isSignUp && (
              <>
                <Text style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}>Password</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      backgroundColor: theme.card,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  placeholder="Create a password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </>
            )}
            
            {errorMessage && (
              <Text style={[styles.errorText, { color: theme.red }]}>
                {errorMessage}
              </Text>
            )}
            
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }
              ]}
              onPress={isSignUp ? handleEmailAuth : (!password ? handleEmailAuth : handlePasswordSignIn)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : (!password ? 'Send Magic Link' : 'Sign In')}
              </Text>
            </TouchableOpacity>
            
            {!isSignUp && (
              <TouchableOpacity 
                style={styles.passwordOptionButton}
                onPress={() => password ? setPassword('') : handlePasswordSignIn()}
              >
                <Text style={[styles.passwordOptionText, { color: theme.primary }]}>
                  {password ? 'Use Magic Link Instead' : 'Use Password Instead'}
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.toggleContainer}>
              <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
                {isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={[styles.toggleLink, { color: theme.primary }]}>
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            {!isSignUp && (
              <TouchableOpacity 
                style={styles.otherOptionsButton}
                onPress={() => router.replace('/(auth)/login-signup')}
              >
                <Text style={[styles.otherOptionsText, { color: theme.primary }]}>
                  Use other sign in methods
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: Platform.OS === 'android' ? 20 : 0,
    padding: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  toggleLink: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  passwordOptionButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  passwordOptionText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  otherOptionsButton: {
    marginTop: 24,
    alignItems: 'center',
    paddingVertical: 8,
  },
  otherOptionsText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
  },
  emailSentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emailIcon: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 12,
  },
  emailText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginVertical: 8,
  },
  instruction: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
}); 
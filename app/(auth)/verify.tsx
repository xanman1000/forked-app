import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for tracking if user completed onboarding (copied from _layout.tsx)
const ONBOARDING_COMPLETE_KEY = 'forked_onboarding_complete';

export default function VerifyScreen() {
  const { type, identifier } = useLocalSearchParams<{ type: 'phone' | 'email', identifier: string }>(); // Get params
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!identifier) {
      // Should not happen if navigated correctly
      Alert.alert("Error", "Missing verification identifier. Please go back.");
      router.back();
    }
  }, [identifier]);

  const handleVerify = async () => {
    // Add explicit check for identifier to satisfy TypeScript
    if (!identifier) {
      Alert.alert("Error", "Verification identifier is missing. Cannot verify.");
      return;
    }
    if (!code || code.length !== 6) { // Check code separately
      Alert.alert("Error", "Please enter the 6-digit verification code.");
      return;
    }
    setLoading(true);

    try {
      // Use separate verifyOtp calls based on type to satisfy strict types
      let sessionData: import("@supabase/supabase-js").Session | null = null;
      let errorData: import("@supabase/supabase-js").AuthError | null = null;

      if (type === 'phone') {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: identifier, // Known string
          token: code,
          type: 'sms',
        });
        sessionData = data.session;
        errorData = error;
      } else if (type === 'email') {
        const { data, error } = await supabase.auth.verifyOtp({
          email: identifier, // Known string
          token: code,
          type: 'email',
        });
        sessionData = data.session;
        errorData = error;
      } else {
        // Should not happen with current flow, but good practice
        throw new Error("Invalid verification type provided.");
      }

      if (errorData) throw errorData; // Check for error from the specific call

      if (sessionData) {
        // Verification successful, session created by Supabase
        console.log('Verification successful, session:', sessionData);

        // Check onboarding status
        const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        if (onboardingComplete === 'true') {
          router.replace('/(tabs)'); // Go to main app
        } else {
          router.replace('/(auth)/onboarding'); // Go to onboarding first
        }
      } else {
        // Should not happen if error is null, but handle defensively
        throw new Error("Verification successful but no session returned.");
      }
    } catch (error: any) {
      console.error('Verification error:', error.message);
      Alert.alert("Verification Failed", error.message || "Invalid code or an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!identifier || type !== 'phone') { // Currently only support resend for phone
      Alert.alert("Error", "Cannot resend code for this method.");
      return;
    }
    setResendLoading(true);
    try {
      console.log('Resending OTP to:', identifier);
      const { error } = await supabase.auth.signInWithOtp({
        phone: identifier,
      });
      if (error) throw error;
      Alert.alert("Code Sent", "A new verification code has been sent.");
    } catch (error: any) {
      console.error('Resend OTP error:', error.message);
      Alert.alert("Error", `Failed to resend code: ${error.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Enter Code", headerBackTitle: "Back" }} />

      <Text style={styles.header}>Enter verification code</Text>
      <Text style={styles.infoText}>
        Enter the 6-digit code sent to:
      </Text>
      <Text style={styles.identifierText}>{identifier}</Text>

      <TextInput
        style={styles.codeInput}
        placeholder="######"
        placeholderTextColor="#BBB"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        maxLength={6}
        editable={!loading}
      />

      {loading && <Text style={styles.loadingText}>Verifying...</Text>}
      {!loading && (
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleVerify}
          disabled={loading || code.length !== 6}
        >
          <Text style={styles.primaryButtonText}>Verify</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.textButton}
        onPress={handleResend}
        disabled={resendLoading || type !== 'phone'} // Only allow resend for phone for now
      >
        <Text style={styles.textButtonText}>
          {resendLoading ? 'Sending...' : "Didn't receive a code? Resend"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  identifierText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  codeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#DDD',
    width: '60%', // Adjust width as needed
    marginBottom: 30,
    paddingBottom: 10,
    letterSpacing: 10, // Space out digits
  },
  loadingText: {
    marginTop: 20,
    color: '#888',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%', // Make buttons full width
  },
  primaryButton: {
    backgroundColor: '#000',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  textButtonText: {
    color: '#007AFF', // Standard iOS blue link color
    fontSize: 15,
    fontWeight: '500',
  },
}); 
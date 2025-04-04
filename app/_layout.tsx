import { useEffect, useState } from 'react';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase, setupAuthDeepLinks } from '@/lib/supabase';

// Key for tracking if user completed onboarding
const ONBOARDING_COMPLETE_KEY = 'forked_onboarding_complete';

// Declare global completeOnboarding function
declare global {
  var completeOnboarding: (() => Promise<void>) | undefined;
}

export default function RootLayout() {
  useFrameworkReady();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Set up deep linking for auth
  useEffect(() => {
    const unsubscribe = setupAuthDeepLinks();
    return () => {
      unsubscribe();
    };
  }, []);

  // Check if user has completed onboarding
  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        // Comment out the debug line that forces onboarding
        // await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
        
        const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        
        // If onboarding has been completed before, route to main app
        // Otherwise, route to onboarding flow
        if (onboardingComplete === 'true') {
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
        }
      } catch (error) {
        // If there's an error reading from AsyncStorage, assume first launch
        console.error('Error checking first launch status:', error);
        setIsFirstLaunch(true);
      }
    }

    checkFirstLaunch();
  }, []);

  // Redirect based on first launch status after initial render
  useEffect(() => {
    // Only navigate if we've determined the first launch status
    if (isFirstLaunch !== null) {
      setTimeout(async () => {
        if (isFirstLaunch) {
          // If it's the first launch, always show onboarding
          router.replace('/(auth)/onboarding');
        } else {
          // If onboarding was previously completed, go directly to the main app
          // NOTE: This currently bypasses authentication checks for testing.
          console.log('Onboarding already complete. Navigating directly to main app.');
          router.replace('/(tabs)');
        }
      }, 100); // Small delay to ensure UI is ready
    }
  }, [isFirstLaunch]);

  // Mark onboarding as complete (to be called after onboarding)
  useEffect(() => {
    // Expose function globally to be called from onboarding screen
    global.completeOnboarding = async () => {
      try {
        await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
        setIsFirstLaunch(false);
      } catch (error) {
        console.error('Error saving onboarding status:', error);
      }
    };

    return () => {
      // Clean up
      global.completeOnboarding = undefined;
    };
  }, []);

  // Wait for fonts to load AND the first launch status to be determined
  // AuthProvider handles its own internal loading state
  if (!fontsLoaded || isFirstLaunch === null) {
    // Can return a loading indicator here or just the Slot
    // Using Slot allows Expo Router to manage the splash screen/initial render
    return <Slot />; 
  }

  // Wrap the main app structure with AuthProvider
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
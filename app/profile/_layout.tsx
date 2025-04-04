import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

// Define theme colors for header
const lightColors = {
  background: '#FFFFFF',
  text: '#333333',
};

const darkColors = {
  background: '#121212',
  text: '#F5F5F5',
};

export default function ProfileLayout() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="settings/account"
        options={{
          title: 'Account Information',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/notifications"
        options={{
          title: 'Notifications',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/privacy"
        options={{
          title: 'Privacy',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/security"
        options={{
          title: 'Security',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/help"
        options={{
          title: 'Help Center',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/terms"
        options={{
          title: 'Terms & Policies',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="settings/about"
        options={{
          title: 'About',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 
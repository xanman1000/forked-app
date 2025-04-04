import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function CookbookLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#121212' : '#F9F8F6',
        },
        headerTintColor: isDark ? '#F5F5F5' : '#333333',
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    />
  );
} 
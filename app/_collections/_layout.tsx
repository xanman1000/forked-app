import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function CollectionsLayout() {
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
        contentStyle: {
          backgroundColor: isDark ? '#121212' : '#F9F8F6',
        },
      }}
    />
  );
} 
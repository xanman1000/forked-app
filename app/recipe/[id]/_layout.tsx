import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RecipeLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll handle our own headers in individual screens
        contentStyle: {
          backgroundColor: isDark ? '#121212' : '#F9F8F6',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="comments" 
        options={{
          presentation: 'card',
        }}
      />
    </Stack>
  );
} 
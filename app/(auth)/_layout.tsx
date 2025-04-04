import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login-signup" />
      <Stack.Screen name="email-auth" />
      <Stack.Screen name="verify" />
    </Stack>
  );
} 
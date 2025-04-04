import { Redirect } from 'expo-router';

export default function ProfileIndexPage() {
  // Redirect to the profile tab
  return <Redirect href="/(tabs)/profile" />;
} 
import { Redirect } from 'expo-router';

export default function AppCollectionsRedirect() {
  // Redirect to the collections index page
  return <Redirect href="/_collections/" as any />;
} 
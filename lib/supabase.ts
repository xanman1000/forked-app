import 'react-native-url-polyfill/auto'; // Required for Supabase to work correctly in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const supabaseUrl = "https://zyqtuqfdizphwenmbrcb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cXR1cWZkaXpwaHdlbm1icmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDIzNzUsImV4cCI6MjA1OTI3ODM3NX0.g8YN5bi9DmSfgqd4wwK0iara0rF-UJ7z7bwQKSHmgnE";

// Get base URL for auth redirects - deep linking
const redirectURL = Linking.createURL('auth-callback');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
    flowType: 'pkce', // Use PKCE flow for better security with mobile
  },
});

// Function to handle deep link auth redirects
export const setupAuthDeepLinks = () => {
  // Subscribe to deep links
  const subscription = Linking.addEventListener('url', (event) => {
    // Extract the hash from the URL
    const url = event.url;
    
    // Handle the auth redirect
    if (url && url.includes('auth-callback')) {
      // Let Supabase auth handle the URL
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
      });
    }
  });
  
  return () => {
    // Clean up the subscription
    subscription.remove();
  };
};

// Important OAuth configs for Google and Apple
/*
For Google OAuth:
1. Create a Google OAuth client ID in the Google Cloud Console
2. Configure the client ID in Supabase Auth settings
3. Add redirect URLs in Google Console: ${redirectURL}

For Apple OAuth:
1. Set up Apple Sign In in your Apple Developer account
2. Configure the service ID in Supabase Auth settings
3. Add redirect URLs in Apple Developer console: ${redirectURL}
*/

// Optional: Define Database types (requires generating types from your Supabase schema)
// export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
// export type Database = {
//   public: {
//     Tables: {
//       profiles: {
//         Row: { ... } // Define row structure based on your SQL
//         Insert: { ... } // Define insert structure
//         Update: { ... } // Define update structure
//       }
//       // ... other tables (recipes, articles, etc.)
//     }
//     Views: { ... }
//     Functions: { ... }
//   }
// }

// // Helper type for Supabase query results
// export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
// export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
// export type DbResultErr = PostgrestError 
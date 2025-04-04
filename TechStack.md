# Tech Stack (Forked - Mobile App)

## Mobile Frontend (React Native)
- **Framework:** Expo SDK + React Native
- **Router:** Expo Router for file-based routing <!-- Status: Implemented -->
- **Styling:** Standard React Native StyleSheet <!-- Status: Currently used -->
- **Icons:** `lucide-react-native` <!-- Status: Implemented -->
- **Interactions:** `expo-haptics` for tactile feedback <!-- Status: Implemented -->
- **Device Integration:** `react-native-safe-area-context` for proper device spacing <!-- Status: Implemented -->
- **State Management:** React Context API for theme and other app-wide state <!-- Status: Implemented -->
- **Future State Management:** Zustand (planned)
- **Future UI Enhancement:** Potentially React Native Paper / Tamagui (TBD)

## Content Features
- **Content Types:** 
  - Recipes (with instructions, ingredients, steps)
  - Articles (with read time, excerpts, full content)
- **Content Discovery:**
  - For You / Following tabs
  - Search functionality
  - Collections system
  - Tags system
- **Social Features:**
  - Likes, comments, saves
  - Profiles with user content
  - Notifications

## AI Integration (Planned)
- **Recipe Generation:** 
  - Text-to-recipe generation through prompt input
  - Natural language processing for ingredient parsing
- **Framework:** GPT-4o via OpenAI API for:
  - Recipe parsing + generation
  - Image generation from structured prompts

## Backend (Planned)
- **Framework:** Node.js (Express)
- **File Storage:** Supabase Storage
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Expo-compatible auth library (Clerk or Supabase Auth)
- **Job Queueing:** For handling recipe generation tasks

## Tooling & DevOps
- **Development:** Expo Development Server
- **Building:** EAS Build (Expo Application Services) for app store deployments
- **CI/CD:** GitHub Actions (planned)
- **Error Handling:** Error boundaries and fallback UIs (planned)
- **Testing:** Jest for unit/integration tests (planned)

## User Experience Enhancements
- **Theme Support:** Dark/light mode with context-based theming
- **Haptic Feedback:** Tactile response for all interactive elements
- **Animations:** Subtle animations for interactive components
- **Loading States:** Skeleton UI for loading states

## Future Considerations
- **Offline Support:** Caching recipes and content
- **Push Notifications:** For social interactions
- **Analytics:** Usage tracking for feature improvements
- **Monetization:** Subscription or premium features
- **Accessibility:** Ensuring app is accessible to all users

---
*Note: This Tech Stack document will be updated as the project evolves and new technologies are integrated.* 
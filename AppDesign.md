# App Design (Forked - Mobile)

## App Navigation (Core Screens - Using Expo Router)
- **Authentication Flow (Stack)**
  - Login/Signup Screen (Optional - could use Clerk/Supabase hosted UI initially)
- **Main App Flow (Bottom Tab Navigator)**
  - **Feed Tab (Stack)**
    - Feed Screen (`app/(tabs)/feed.tsx`) (For You/Following toggle)
    - Recipe Detail Screen (`app/recipe/[id]/index.tsx`)
    - Comments Screen (`app/recipe/[id]/comments.tsx`)
    - Article Detail Screen (`app/article/[id].tsx`)
  - **Search Tab**
    - Search Screen (`app/(tabs)/search.tsx`)
  - **Create Tab**
    - Create Recipe Screen (`app/(tabs)/index.tsx`)
    - Manual Recipe Entry (`app/create/index.tsx`)
  - **Notifications Tab**
    - Notifications Screen (`app/(tabs)/notifications.tsx`)
  - **Profile Tab (Stack)**
    - User Profile Screen (`app/(tabs)/profile.tsx`)
    - Settings Screen (future)
  - **Additional Routes**
    - Collections (`app/_collections/index.tsx`, `app/_collections/[id].tsx`, `app/_collections/create.tsx`)
    - Tags (`app/tags/index.tsx`, `app/tags/[id].tsx`)

## Component/Screen Breakdown (React Native Components)
### 1. Feed Screen (`app/(tabs)/feed.tsx`)
- **FeedTabs:** Custom `TouchableOpacity` row for switching between For You/Following.
- **ContentFeed:** Rendering both `RecipeCard` and `ArticleCard` components.
- **RecipeCard:** `View` with `Image`, `Text` (title, author) and interaction buttons (like, comment, save).
- **ArticleCard:** Similar to RecipeCard but with additional read time information.
- **Search Button:** Navigates to dedicated search screen.
- Uses theme context for dark/light mode support.

### 2. Recipe Detail Screen (`app/recipe/[id]/index.tsx`)
- **ParallaxHeader:** Animated header with recipe image that collapses when scrolling.
- **RecipeInfo:** Title, author, preparation time, cooking time, difficulty, and servings.
- **Description:** Recipe description section.
- **Tabs:** Interactive tabs to switch between Ingredients and Instructions.
- **IngredientsList:** List of ingredients with bullet points.
- **InstructionsList:** Numbered list of cooking instructions.
- **ActionButtons:** Like, comment, and share functionality.
- **TagsSection:** Horizontally scrollable list of recipe tags.
- Supports dark/light mode with proper theming.

### 3. Article Detail Screen (`app/article/[id].tsx`)
- **ParallaxHeader:** Similar to recipe detail with article cover image.
- **ArticleInfo:** Title, author, and read time.
- **Content:** Full article content with formatting.
- **ActionButtons:** Like, comment, and share functionality.
- **RelatedContent:** Suggested recipes or related articles.

### 4. Comments Screen (`app/recipe/[id]/comments.tsx`)
- **CommentsList:** `FlatList` showing comments and replies.
- **CommentItem:** Individual comment with author, text, and actions.
- **ReplySystem:** Animated UI for replying to comments.
- **CommentInput:** Text input for adding new comments.
- Supports haptic feedback and theme-aware styling.

### 5. Create Recipe Screen (`app/(tabs)/index.tsx`)
- **PromptInput:** Text input for AI-assisted recipe generation.
- **GenerateButton:** Submits the prompt to generate recipe.
- **ManualCreateButton:** Navigates to manual recipe creation.
- **ImageUploader:** Area to add recipe cover photo.
- **FormInputs:** Title, description, preparation time, cooking time, servings, and difficulty selector.
- **IngredientsEditor:** Dynamic list for adding/removing ingredients.
- **InstructionsEditor:** Step-by-step instruction editor with numbering.
- **TagsManager:** UI for adding and removing tags.
- **SaveButton:** Saves the created recipe.

### 6. Search Screen (`app/(tabs)/search.tsx`)
- **SearchBar:** Enhanced input for searching recipes and articles.
- **FilterOptions:** Options to filter by recipe type, difficulty, cooking time, etc.
- **SearchResults:** Grid view of matching content with infinite scroll.
- **RecentSearches:** List of recent search queries.

### 7. Collections System (`app/_collections/`)
- **CollectionsIndex:** Grid view of recipe collections with search functionality.
- **CollectionDetail:** Shows recipes within a collection.
- **CreateCollection:** Form to create new collections with title and cover image.

### 8. Tags System (`app/tags/`)
- **TagsIndex:** List of available recipe tags for filtering.
- **TagDetail:** Shows recipes associated with a specific tag.

### 9. Notifications Screen (`app/(tabs)/notifications.tsx`)
- **NotificationsList:** List of various notification types.
- **NotificationItem:** Shows type icon, content, and time.
- **RecipePreview:** Mini preview for recipe-related notifications.

### 10. Profile Screen (`app/(tabs)/profile.tsx`)
- **ProfileHeader:** User image, name, username, and bio.
- **StatsRow:** Counts for recipes, followers, and following.
- **TabsSection:** Tabs to switch between posts, likes, etc.
- **CreateRecipeButton:** Button to navigate to recipe creation.
- **SettingsButton:** Opens settings/options menu.
- **ActionSheet:** Bottom sheet for additional profile actions.

## UX Improvements
- **Fast Visual Feedback:** Haptic feedback for all interactive elements.
- **Frictionless Creativity:** AI-assisted recipe generation with option for manual entry.
- **Clean Layout:** Proper spacing and alignment across all screens.
- **Dark Mode Support:** Comprehensive dark mode implementation throughout the app.
- **Bottom Tab Navigation:** Fixed, vertically centered tab bar with consistent spacing.
- **Interaction Metrics:** Like and comment counts visible on recipe cards.
- **Food-Focused Content:** All content relates to food, recipes, and cooking.

## Visual Style
- Clean, modern interface with emphasis on food imagery.
- Consistent spacing and typography.
- Theme-aware color scheme supporting both light and dark modes.
- Primary brand color: `#B7D6C2` (mint green) used for accents and interactive elements.
- Card-based UI for recipe items, article items, and collections.
- Subtle animations for state changes and user interactions. 
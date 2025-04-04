import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  useColorScheme,
  useWindowDimensions,
  StatusBar,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  BookmarkPlus,
  Bookmark,
  Heart,
  Share2,
  MessageCircle,
  Tag,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Recipe interface
interface Recipe {
  id: string;
  title: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  description: string;
  isSaved: boolean;
  isLiked: boolean;
  tags: string[];
  likesCount?: number;
  commentsCount?: number;
}

// Demo data
const RECIPES: { [key: string]: Recipe } = {
  '1': {
    id: '1',
    title: 'Avocado Toast with Poached Eggs',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2880&auto=format&fit=crop',
    author: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '2 eggs',
      '1 tablespoon white vinegar',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      '1 tablespoon olive oil',
      'Fresh herbs for garnish (parsley, cilantro, or chives)',
    ],
    instructions: [
      'Toast the bread slices until golden brown.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a bowl. Mash with a fork and add salt and pepper to taste.',
      'Bring a pot of water to a gentle simmer. Add the vinegar.',
      'Create a whirlpool in the water and crack an egg into the center. Cook for 3-4 minutes for a runny yolk.',
      'Remove the poached egg with a slotted spoon and place on a paper towel to drain.',
      'Spread the mashed avocado on the toast slices.',
      'Top each toast with a poached egg. Season with salt, pepper, and red pepper flakes if desired.',
      'Drizzle with olive oil and garnish with fresh herbs before serving.',
    ],
    description: 'A perfect breakfast or brunch option that combines creamy avocado with perfectly poached eggs on toasted whole grain bread. This recipe is not only delicious but also packed with healthy fats and protein to keep you energized throughout the day.',
    isSaved: true,
    isLiked: false,
    tags: ['breakfast', 'healthy', 'quick', 'vegetarian'],
    likesCount: 242,
    commentsCount: 18,
  },
  '2': {
    id: '2',
    title: 'Berry Protein Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=3280&auto=format&fit=crop',
    author: {
      name: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      '1 cup frozen mixed berries',
      '1 banana (half frozen, half fresh)',
      '1 scoop protein powder (vanilla or unflavored)',
      '1/4 cup Greek yogurt',
      '1/4 cup almond milk (or milk of choice)',
      'Toppings: fresh berries, sliced banana, granola, chia seeds, honey',
    ],
    instructions: [
      'In a blender, combine frozen berries, half frozen banana, protein powder, Greek yogurt, and almond milk.',
      'Blend until smooth but thick. Add more milk if needed, but keep it spoonable rather than drinkable.',
      'Pour into a bowl.',
      'Top with sliced fresh banana, fresh berries, granola, chia seeds, and a drizzle of honey.',
      'Serve immediately and enjoy with a spoon!',
    ],
    description: 'This protein-packed smoothie bowl is perfect for a nutritious breakfast or post-workout meal. The frozen berries provide antioxidants while the protein powder and Greek yogurt help rebuild muscles. Customize with your favorite toppings for added texture and nutrients.',
    isSaved: false,
    isLiked: true,
    tags: ['breakfast', 'healthy', 'vegan-option', 'gluten-free-option', 'high-protein'],
    likesCount: 187,
    commentsCount: 12,
  },
  '3': {
    id: '3',
    title: 'Classic Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=3269&auto=format&fit=crop',
    author: {
      name: 'Marco Rossi',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    ingredients: [
      'For the dough:',
      '3 cups all-purpose flour',
      '1 packet active dry yeast',
      '1 tsp sugar',
      '1 tsp salt',
      '1 tbsp olive oil',
      '1 cup warm water',
      'For the topping:',
      '1 can (14 oz) crushed San Marzano tomatoes',
      '8 oz fresh mozzarella cheese, sliced',
      'Fresh basil leaves',
      '2 cloves garlic, minced',
      '2 tbsp extra virgin olive oil',
      'Salt and pepper to taste',
    ],
    instructions: [
      'In a large bowl, combine flour, yeast, sugar, and salt.',
      'Add warm water and olive oil, mix until a dough forms.',
      'Knead the dough on a floured surface for about 5 minutes until smooth and elastic.',
      'Place in an oiled bowl, cover with a damp cloth, and let rise in a warm place for 1 hour or until doubled in size.',
      'Preheat oven to 475°F (245°C) with a pizza stone if available.',
      'Punch down the dough and divide into 2 equal parts (for 2 pizzas).',
      'Roll each part into a 12-inch circle on a floured surface.',
      'In a small bowl, mix crushed tomatoes with minced garlic, salt, and pepper.',
      'Spread tomato sauce over the dough, leaving a small border for the crust.',
      'Arrange mozzarella slices over the sauce.',
      'Bake for 12-15 minutes until the crust is golden and cheese is bubbly.',
      'Remove from oven, drizzle with olive oil, and sprinkle fresh basil leaves on top.',
      'Let cool for a few minutes before slicing and serving.',
    ],
    description: 'This authentic Margherita pizza features a thin, crispy crust topped with tangy tomato sauce, fresh mozzarella, and fragrant basil. Named after Queen Margherita of Italy, this classic pizza represents the colors of the Italian flag: red (tomatoes), white (mozzarella), and green (basil).',
    isSaved: true,
    isLiked: true,
    tags: ['italian', 'dinner', 'vegetarian', 'baking'],
    likesCount: 356,
    commentsCount: 42,
  },
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const recipeId = Array.isArray(id) ? id[0] : id;
  const recipe = RECIPES[recipeId] || RECIPES['1']; // Fallback to first recipe if not found
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  
  // State for recipe actions
  const [isSaved, setIsSaved] = useState(recipe.isSaved);
  const [isLiked, setIsLiked] = useState(recipe.isLiked);
  
  // Theme colors
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
    iconBackground: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    heartActive: '#FF6B6B',
    tabInactive: isDark ? '#2A2A2A' : '#EAEAEA',
  };
  
  // Window dimensions for parallax effect
  const { width: windowWidth } = useWindowDimensions();
  
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Calculate header height (40% of screen width to maintain aspect ratio)
  const HEADER_HEIGHT = windowWidth * 0.6;
  const HEADER_MIN_HEIGHT = 50;
  
  // Helper function for haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    // Only use haptics on iOS and Android
    if (Platform.OS !== 'web') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  // Toggle save status
  const toggleSave = () => {
    triggerHaptic(isSaved ? 'medium' : 'success');
    setIsSaved(!isSaved);
  };
  
  // Toggle like status
  const toggleLike = () => {
    triggerHaptic(isLiked ? 'medium' : 'success');
    setIsLiked(!isLiked);
  };
  
  // Share recipe
  const shareRecipe = async () => {
    triggerHaptic('medium');
    try {
      await Share.share({
        message: `Check out this amazing ${recipe.title} recipe I found!`,
        url: 'https://example.com/recipe/' + recipe.id,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };
  
  // Navigate to tag screen
  const navigateToTag = (tag: string) => {
    triggerHaptic('light');
    router.push(`/tags/${tag}`);
  };
  
  // Navigate to comments
  const navigateToComments = () => {
    triggerHaptic('light');
    router.push(`/recipe/${recipe.id}/comments`);
  };
  
  // Header animation interpolations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT - 40, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  // Parallax effect for the image
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Custom header with animated height */}
      <Animated.View style={[styles.header, { height: headerHeight, backgroundColor: colors.background }]}>
        <Animated.Image
          source={{ uri: recipe.image }}
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
        />
        
        {/* Header gradient overlay */}
        <Animated.View
          style={[
            styles.headerGradient,
            { opacity: imageOpacity },
          ]}
        />
        
        {/* Back button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.iconBackground }]}
          onPress={() => {
            triggerHaptic('medium');
            router.back();
          }}
        >
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        
        {/* Header title for when scrolled */}
        <Animated.View
          style={[
            styles.headerTitle,
            { opacity: headerTitleOpacity },
          ]}
        >
          <Text
            style={[styles.headerTitleText, { color: colors.text }]}
            numberOfLines={1}
          >
            {recipe.title}
          </Text>
        </Animated.View>
        
        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.iconBackground }]}
          onPress={toggleSave}
        >
          {isSaved ? (
            <Bookmark size={24} color={colors.tint} fill={colors.tint} />
          ) : (
            <BookmarkPlus size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Recipe Title and Author */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.authorImageContainer}>
              {/* Would render actual image in real implementation */}
              <View style={styles.authorImagePlaceholder} />
            </View>
            <Text style={[styles.authorName, { color: colors.textSecondary }]}>
              by {recipe.author.name}
            </Text>
          </View>
        </View>
        
        {/* Recipe Actions */}
        <View style={styles.actionsContainer}>
          {/* Like button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleLike}
          >
            <View style={[styles.actionIconContainer, { 
              backgroundColor: isLiked ? 'rgba(255, 107, 107, 0.1)' : colors.iconBackground 
            }]}>
              <Heart 
                size={18} 
                color={isLiked ? colors.heartActive : colors.textSecondary}
                fill={isLiked ? colors.heartActive : 'transparent'}
              />
            </View>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {recipe.likesCount || 0}
            </Text>
          </TouchableOpacity>
          
          {/* Comment button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={navigateToComments}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: colors.iconBackground }]}>
              <MessageCircle size={18} color={colors.textSecondary} />
            </View>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {recipe.commentsCount || 0}
            </Text>
          </TouchableOpacity>
          
          {/* Share button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={shareRecipe}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: colors.iconBackground }]}>
              <Share2 size={18} color={colors.textSecondary} />
            </View>
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Recipe Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            {/* Prep Time */}
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.tint} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Prep Time</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{recipe.prepTime} min</Text>
              </View>
            </View>
            
            {/* Cook Time */}
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.tint} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Cook Time</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{recipe.cookTime} min</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            {/* Servings */}
            <View style={styles.infoItem}>
              <Users size={18} color={colors.tint} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Servings</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{recipe.servings}</Text>
              </View>
            </View>
            
            {/* Difficulty */}
            <View style={styles.infoItem}>
              <ChefHat size={18} color={colors.tint} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Difficulty</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Recipe Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {recipe.description}
          </Text>
        </View>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScrollContent}
          >
            {recipe.tags.map((tag, index) => (
              <TouchableOpacity
                key={`tag-${index}`}
                style={[styles.tag, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigateToTag(tag)}
              >
                <Tag size={14} color={colors.tint} />
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Ingredients and Instructions Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ingredients' && { borderColor: colors.tint },
              { backgroundColor: activeTab === 'ingredients' ? colors.card : colors.tabInactive }
            ]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('ingredients');
            }}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'ingredients' ? colors.text : colors.textSecondary }
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'instructions' && { borderColor: colors.tint },
              { backgroundColor: activeTab === 'instructions' ? colors.card : colors.tabInactive }
            ]}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('instructions');
            }}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'instructions' ? colors.text : colors.textSecondary }
              ]}
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View style={[styles.tabContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {activeTab === 'ingredients' ? (
            // Ingredients List
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ingredient, index) => (
                <View 
                  key={`ingredient-${index}`} 
                  style={[
                    styles.ingredientItem, 
                    index < recipe.ingredients.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: colors.border 
                    }
                  ]}
                >
                  <View style={[styles.bulletPoint, { backgroundColor: colors.tint }]} />
                  <Text style={[styles.ingredientText, { color: colors.text }]}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            // Instructions List
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View 
                  key={`instruction-${index}`} 
                  style={[
                    styles.instructionItem, 
                    index < recipe.instructions.length - 1 && { 
                      borderBottomWidth: 1, 
                      borderBottomColor: colors.border 
                    }
                  ]}
                >
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.instructionText, { color: colors.text }]}>
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Bottom padding for content */}
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Set header in Stack.Screen */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  saveButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 60,
    right: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginTop: 240, // Space for the header image
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImageContainer: {
    marginRight: 10,
  },
  authorImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DDD',
  },
  authorName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsScrollContent: {
    paddingVertical: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  tabContent: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    minHeight: 300,
  },
  ingredientsList: {},
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  ingredientText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    flex: 1,
  },
  instructionsList: {},
  instructionItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B7D6C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
}); 
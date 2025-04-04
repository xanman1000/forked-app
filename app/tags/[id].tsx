import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Clock, ArrowLeft, ChevronRight, Star, BookmarkIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Demo Recipe interface
interface Recipe {
  id: string;
  title: string;
  image: string;
  author: string;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  description: string;
  isSaved: boolean;
  tags: string[];
}

// Tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
  recipeCount: number;
}

// Demo tags
const TAGS: Tag[] = [
  { id: '1', name: 'breakfast', color: '#FF9800', recipeCount: 8 },
  { id: '2', name: 'vegetarian', color: '#4CAF50', recipeCount: 15 },
  { id: '3', name: 'quick meals', color: '#2196F3', recipeCount: 12 },
  { id: '4', name: 'desserts', color: '#E91E63', recipeCount: 7 },
  { id: '5', name: 'italian', color: '#F44336', recipeCount: 5 },
  { id: '6', name: 'asian', color: '#9C27B0', recipeCount: 9 },
  { id: '7', name: 'healthy', color: '#8BC34A', recipeCount: 11 },
  { id: '8', name: 'comfort food', color: '#795548', recipeCount: 6 },
  { id: '9', name: 'gluten-free', color: '#00BCD4', recipeCount: 4 },
  { id: '10', name: 'party', color: '#673AB7', recipeCount: 3 },
];

// Demo recipes
const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Avocado & Egg Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Emma Johnson',
    prepTime: '15 min',
    difficulty: 'easy',
    ingredients: ['Bread', 'Avocado', 'Eggs', 'Salt', 'Pepper'],
    description: 'A simple yet delicious breakfast option that combines creamy avocado with perfectly cooked eggs on toasted bread.',
    isSaved: true,
    tags: ['1', '2', '7'],
  },
  {
    id: '2',
    title: 'Summer Berry Smoothie',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Michael Chen',
    prepTime: '10 min',
    difficulty: 'easy',
    ingredients: ['Mixed Berries', 'Banana', 'Yogurt', 'Honey', 'Ice'],
    description: 'A refreshing and nutritious smoothie packed with summer berries and creamy yogurt. Perfect for a quick breakfast or snack.',
    isSaved: false,
    tags: ['1', '7', '9'],
  },
  {
    id: '3',
    title: 'Classic Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Sofia Romano',
    prepTime: '30 min',
    difficulty: 'medium',
    ingredients: ['Pizza Dough', 'Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil'],
    description: 'A traditional Italian pizza featuring the colors of the Italian flag: red tomatoes, white mozzarella, and green basil.',
    isSaved: true,
    tags: ['2', '5', '8'],
  },
  {
    id: '4',
    title: 'Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Alex Wong',
    prepTime: '20 min',
    difficulty: 'easy',
    ingredients: ['Mixed Vegetables', 'Tofu', 'Soy Sauce', 'Garlic', 'Ginger'],
    description: 'A quick and healthy stir fry loaded with colorful vegetables and tofu. Customize with your favorite vegetables and sauce.',
    isSaved: false,
    tags: ['2', '3', '6', '7'],
  },
  {
    id: '5',
    title: 'Chocolate Chip Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Jessica Baker',
    prepTime: '45 min',
    difficulty: 'medium',
    ingredients: ['Flour', 'Butter', 'Sugar', 'Eggs', 'Chocolate Chips'],
    description: 'Classic homemade chocolate chip cookies with a soft center and crispy edges. Perfect for dessert or a sweet treat anytime.',
    isSaved: true,
    tags: ['4', '8', '10'],
  },
  {
    id: '6',
    title: 'Authentic Vegetable Stir Fry with Tofu',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: 'Alex Wong',
    prepTime: '25 min',
    difficulty: 'medium',
    ingredients: ['Firm Tofu', 'Broccoli', 'Bell Peppers', 'Carrots', 'Snow Peas', 'Soy Sauce', 'Sesame Oil', 'Garlic', 'Ginger', 'Cornstarch'],
    description: 'This authentic vegetable stir fry combines colorful vegetables and protein-rich tofu in a savory Asian-inspired sauce. The dish comes together quickly and offers a healthy balance of nutrition and flavor with a slight crunch from the vegetables.',
    isSaved: true,
    tags: ['2', '3', '6', '7'],
  },
];

export default function TagDetailScreen() {
  const { id } = useLocalSearchParams();
  const [tag, setTag] = useState<Tag | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // Theme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Colors
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    tint: '#B7D6C2',
    separator: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  };
  
  // Load tag and recipes
  useEffect(() => {
    // Find the tag
    const foundTag = TAGS.find(t => t.id === id);
    if (foundTag) {
      setTag(foundTag);
    }
    
    // Filter recipes by tag
    const filteredRecipes = RECIPES.filter(recipe => recipe.tags.includes(id as string));
    setRecipes(filteredRecipes);
  }, [id]);
  
  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
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
      }
    }
  };
  
  // Toggle save recipe
  const toggleSaveRecipe = (recipeId: string) => {
    triggerHaptic('medium');
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isSaved: !recipe.isSaved } 
          : recipe
      )
    );
  };
  
  // Handle recipe press
  const handleRecipePress = (recipeId: string) => {
    triggerHaptic('light');
    router.push(`/recipe/${recipeId}` as any);
  };
  
  // Recipe card component
  const renderRecipeCard = ({ item: recipe }: { item: Recipe }) => {
    return (
      <TouchableOpacity
        style={[styles.recipeCard, { backgroundColor: colors.card }]}
        onPress={() => handleRecipePress(recipe.id)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: recipe.image }} 
          style={styles.recipeImage}
          resizeMode="cover"
        />
        
        <View style={styles.recipeContent}>
          <Text style={[styles.recipeTitle, { color: colors.text }]}>
            {recipe.title}
          </Text>
          
          <View style={styles.recipeMetaContainer}>
            <View style={styles.recipeMeta}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.recipeMetaText, { color: colors.textSecondary }]}>
                {recipe.prepTime}
              </Text>
            </View>
            
            <View style={styles.recipeDifficulty}>
              <View 
                style={[
                  styles.difficultyDot, 
                  { backgroundColor: recipe.difficulty === 'easy' ? '#4CAF50' : 
                    recipe.difficulty === 'medium' ? '#FFC107' : '#F44336' }
                ]} 
              />
              <Text style={[styles.recipeMetaText, { color: colors.textSecondary }]}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>
          
          <View style={styles.recipeAuthorContainer}>
            <Text 
              style={[styles.recipeAuthor, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              by {recipe.author}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => toggleSaveRecipe(recipe.id)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <BookmarkIcon 
            size={20} 
            color={recipe.isSaved ? colors.tint : colors.textSecondary} 
            fill={recipe.isSaved ? colors.tint : 'none'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  
  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3133/3133051.png' }}
        style={styles.emptyImage}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No recipes found
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {`We couldn't find any recipes with the "${tag?.name}" tag.`}
      </Text>
    </View>
  );
  
  // If tag not found
  if (!tag) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Text style={[styles.errorText, { color: colors.text }]}>Tag not found</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen
        options={{
          title: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                router.back();
              }}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Tag header */}
      <View style={[styles.tagHeader, { backgroundColor: tag.color + '20' }]}>
        <View style={[styles.tagColor, { backgroundColor: tag.color }]} />
        <View style={styles.tagInfo}>
          <Text style={[styles.tagName, { color: colors.text }]}>
            {tag.name}
          </Text>
          <Text style={[styles.tagRecipeCount, { color: colors.textSecondary }]}>
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
          </Text>
        </View>
      </View>
      
      {/* Recipe list */}
      <FlatList
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recipeList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  tagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  tagColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tagInfo: {
    marginLeft: 16,
  },
  tagName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  tagRecipeCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  recipeList: {
    padding: 16,
    paddingTop: 8,
  },
  recipeCard: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 180,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  recipeMetaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  recipeDifficulty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  recipeAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeAuthor: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyImage: {
    width: 96,
    height: 96,
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
}); 
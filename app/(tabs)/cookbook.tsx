import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Animated,
  PanResponder,
  GestureResponderEvent,
  Platform,
  Dimensions,
  useColorScheme
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Filter, ChevronDown, Clock, Flame, User, X, FolderOpen, ChevronRight } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Recipe interface
interface Recipe {
  id: number;
  title: string;
  image: string;
  author: string;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  description: string;
  saved: boolean;
}

// Cookbook screen component
export default function CookbookScreen() {
  // State variables
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [selectedChip, setSelectedChip] = useState('all');
  const [previewingRecipe, setPreviewingRecipe] = useState<Recipe | null>(null);
  const [previewMode, setPreviewMode] = useState<'peek' | 'full' | null>(null);
  const previewY = useRef(new Animated.Value(0)).current;
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const previewScale = useRef(new Animated.Value(0.95)).current;
  
  // Long press timeout ref
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Demo recipes data
  const recipes: Recipe[] = [
    {
      id: 1,
      title: 'spaghetti carbonara',
      image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=800&auto=format&fit=crop',
      author: 'mario rossi',
      prepTime: '25 mins',
      difficulty: 'medium',
      ingredients: [
        'spaghetti',
        'eggs',
        'pancetta',
        'parmesan cheese',
        'black pepper',
        'salt'
      ],
      description: 'A classic Italian pasta dish from Rome made with eggs, hard cheese, cured pork, and black pepper.',
      saved: true
    },
    {
      id: 2,
      title: 'avocado toast',
      image: 'https://images.unsplash.com/photo-1603046891744-556223861dc7?q=80&w=800&auto=format&fit=crop',
      author: 'emma green',
      prepTime: '10 mins',
      difficulty: 'easy',
      ingredients: [
        'bread',
        'avocado',
        'lemon juice',
        'salt',
        'red pepper flakes',
        'eggs (optional)'
      ],
      description: 'Simple and nutritious breakfast option with mashed avocado spread on toasted bread, customizable with various toppings.',
      saved: false
    },
    {
      id: 3,
      title: 'chocolate chip cookies',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
      author: 'sarah baker',
      prepTime: '45 mins',
      difficulty: 'easy',
      ingredients: [
        'butter',
        'white sugar',
        'brown sugar',
        'eggs',
        'vanilla extract',
        'flour',
        'baking soda',
        'salt',
        'chocolate chips'
      ],
      description: 'Classic homemade cookies with a perfect balance of soft center and crispy edges, loaded with chocolate chips.',
      saved: true
    },
    {
      id: 4,
      title: 'chicken curry',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
      author: 'raj patel',
      prepTime: '40 mins',
      difficulty: 'medium',
      ingredients: [
        'chicken thighs',
        'onion',
        'garlic',
        'ginger',
        'curry powder',
        'coconut milk',
        'tomatoes',
        'cilantro'
      ],
      description: 'Aromatic and flavorful curry with tender chicken pieces in a rich, spiced sauce.',
      saved: false
    },
    {
      id: 5,
      title: 'authentic vegetable stir fry with tofu',
      image: 'https://i.ibb.co/Qn5b6sN/tofu-stir-fry-recipe-image.png',
      author: 'li wei',
      prepTime: '30 mins',
      difficulty: 'easy',
      ingredients: [
        '200g firm tofu',
        '1 red pepper',
        '1 carrot',
        '100g broccoli',
        '2 garlic cloves',
        '1 tbsp soy sauce',
        '1 tbsp sesame oil',
        'Spring onion'
      ],
      description: 'A quick and healthy stir fry featuring crispy tofu and fresh vegetables in a savory sauce.',
      saved: true
    }
  ];

  // Theme setup
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Colors
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? '#2C2C2C' : '#EEEEEE',
    tint: '#B7D6C2',
  };

  // Tag integration
  const handleTagPress = (tagId: string) => {
    triggerHaptic('light');
    router.push({ pathname: '/tags/[id]', params: { id: tagId }} as any);
  };

  // Function to trigger haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'success') => {
    if (Platform.OS !== 'web') {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
      }
    }
  };

  // Start preview mode on long press
  const handleLongPress = (recipe: Recipe) => {
    triggerHaptic('medium');
    setPreviewingRecipe(recipe);
    setPreviewMode('peek');
    
    // Animate preview in
    previewY.setValue(100);
    previewOpacity.setValue(0);
    previewScale.setValue(0.95);
    
    Animated.parallel([
      Animated.timing(previewY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(previewScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Handle press-in for long press detection
  const handlePressIn = (recipe: Recipe, e: GestureResponderEvent) => {
    // Clear any existing timeout
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
    
    // Set a timeout for long press
    longPressTimeout.current = setTimeout(() => {
      handleLongPress(recipe);
    }, 500);
  };
  
  // Handle press-out to cancel long press
  const handlePressOut = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };
  
  // Handle recipe press - navigate to recipe detail
  const handleRecipePress = (recipe: Recipe) => {
    triggerHaptic('light');
    router.push(`/recipe/${recipe.id}` as any);
  };
  
  // Close preview
  const closePreview = () => {
    triggerHaptic('light');
    
    // Animate preview out
    Animated.parallel([
      Animated.timing(previewY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(previewScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setPreviewingRecipe(null);
      setPreviewMode(null);
    });
  };

  // Pan responder for swipe gestures on preview
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        // Swipe down - follow finger to a point
        previewY.setValue(gestureState.dy * 0.5);
        previewOpacity.setValue(1 - (gestureState.dy * 0.005));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 80) {
        // If swiped down enough, close modal
        closePreview();
      } else {
        // Otherwise snap back
        Animated.spring(previewY, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }).start();
        
        Animated.spring(previewOpacity, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  // Toggle between empty and filled states (for demo)
  const toggleEmptyState = () => {
    setIsEmptyState(!isEmptyState);
  };

  // Select a filter chip
  const handleChipSelect = (chip: string) => {
    setSelectedChip(chip);
    triggerHaptic('light');
  };

  // Display difficulty badge
  const DifficultBadge = ({ level }: { level: 'easy' | 'medium' | 'hard' }) => {
    let color = '#4CAF50'; // easy - green
    if (level === 'medium') color = '#FF9800'; // medium - orange
    if (level === 'hard') color = '#F44336'; // hard - red

    return (
      <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.badgeText, { color }]}>{level}</Text>
      </View>
    );
  };

  const router = useRouter();

  // Add this mock data near the top of the file, after the recipe data
  const topTags = [
    { id: '1', name: 'breakfast', color: '#FF9800' },
    { id: '2', name: 'vegetarian', color: '#4CAF50' },
    { id: '3', name: 'quick meals', color: '#2196F3' },
    { id: '7', name: 'healthy', color: '#8BC34A' },
    { id: '4', name: 'desserts', color: '#E91E63' },
    { id: '5', name: 'italian', color: '#F44336' },
    { id: '6', name: 'asian', color: '#9C27B0' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>cookbook</Text>
      <Text style={styles.subtitle}>save and organize your favorite recipes</Text>

      {/* Toggle for demo */}
      <View style={styles.demoToggle}>
        <Text style={styles.toggleLabel}>Toggle Demo Empty State</Text>
        <Switch value={isEmptyState} onValueChange={toggleEmptyState} />
      </View>

      {/* Filter section */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Your Recipes</Text>
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.collectionsButton} 
              onPress={() => {
                triggerHaptic('light');
                router.push('/collections' as any);
              }}
            >
              <FolderOpen size={18} color="#666666" />
              <Text style={styles.collectionsButtonText}>Collections</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={18} color="#666666" />
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.chipScrollView}
          contentContainerStyle={styles.chipContainer}
        >
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'all' && styles.selectedChip]}
            onPress={() => handleChipSelect('all')}
          >
            <Text style={[styles.chipText, selectedChip === 'all' && styles.selectedChipText]}>
              all
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'saved' && styles.selectedChip]}
            onPress={() => handleChipSelect('saved')}
          >
            <Text style={[styles.chipText, selectedChip === 'saved' && styles.selectedChipText]}>
              saved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'created' && styles.selectedChip]}
            onPress={() => handleChipSelect('created')}
          >
            <Text style={[styles.chipText, selectedChip === 'created' && styles.selectedChipText]}>
              created
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'recent' && styles.selectedChip]}
            onPress={() => handleChipSelect('recent')}
          >
            <Text style={[styles.chipText, selectedChip === 'recent' && styles.selectedChipText]}>
              recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedChip === 'easy' && styles.selectedChip]}
            onPress={() => handleChipSelect('easy')}
          >
            <Text style={[styles.chipText, selectedChip === 'easy' && styles.selectedChipText]}>
              easy
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isEmptyState ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1830/1830839.png' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No recipes saved yet</Text>
          <Text style={styles.emptyText}>
            Start saving recipes from the feed or create your own to build your cookbook.
          </Text>
          <TouchableOpacity style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>browse recipes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Recipe grid
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.recipesGrid}>
            {recipes.map((recipe) => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard}
                onPress={() => handleRecipePress(recipe)}
                onPressIn={(e) => handlePressIn(recipe, e)}
                onPressOut={handlePressOut}
                delayLongPress={500}
                activeOpacity={0.9}
              >
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.title}</Text>
                  <View style={styles.recipeDetails}>
                    <View style={styles.authorContainer}>
                      <User size={12} color="#666666" />
                      <Text style={styles.recipeAuthor}>{recipe.author}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Clock size={12} color="#666666" />
                      <Text style={styles.recipeTime}>{recipe.prepTime}</Text>
                    </View>
                  </View>
                  <View style={styles.badgeRow}>
                    <DifficultBadge level={recipe.difficulty} />
                    {recipe.saved && (
                      <View style={[styles.badge, { backgroundColor: '#B7D6C220' }]}>
                        <Text style={[styles.badgeText, { color: '#65A382' }]}>saved</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.previewHint}>Long press to preview</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      
      {/* Recipe Preview Overlay */}
      {previewingRecipe && (
        <View style={styles.previewOverlay}>
          <TouchableOpacity 
            style={styles.previewBackdrop}
            activeOpacity={1}
            onPress={closePreview}
          />
          
          <Animated.View
            style={[
              styles.previewContainer,
              {
                transform: [
                  { translateY: previewY },
                  { scale: previewScale }
                ],
                opacity: previewOpacity,
                maxHeight: previewMode === 'full' ? '90%' : '75%',
              }
            ]}
            {...(previewMode === 'peek' ? panResponder.panHandlers : {})}
          >
            {/* Preview Header */}
            <View style={styles.previewHeader}>
              <View style={styles.previewDragHandle} />
              
              <TouchableOpacity 
                style={styles.previewCloseButton}
                onPress={closePreview}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Recipe Content */}
            <ScrollView style={styles.previewScroll}>
              <Image 
                source={{ uri: previewingRecipe.image }} 
                style={styles.previewImage} 
              />
              
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>{previewingRecipe.title}</Text>
                
                <View style={styles.previewMeta}>
                  <View style={styles.previewDetailItem}>
                    <User size={14} color="#666666" />
                    <Text style={styles.previewDetailText}>{previewingRecipe.author}</Text>
                  </View>
                  
                  <View style={styles.previewDetailItem}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.previewDetailText}>{previewingRecipe.prepTime}</Text>
                  </View>
                  
                  <DifficultBadge level={previewingRecipe.difficulty} />
                </View>
                
                <Text style={styles.previewDescription}>{previewingRecipe.description}</Text>
                
                {/* Ingredients Section */}
                <Text style={styles.previewSectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsList}>
                  {previewingRecipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientDot} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Action buttons */}
                <View style={styles.previewActions}>
                  <TouchableOpacity 
                    style={[styles.previewButton, styles.previewPrimaryButton]}
                    onPress={() => {
                      triggerHaptic('success');
                      closePreview();
                    }}
                  >
                    <Text style={styles.previewPrimaryButtonText}>View Full Recipe</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.previewSecondaryButton}
                    onPress={() => {
                      triggerHaptic('medium');
                      // Toggle save state
                    }}
                  >
                    <Text style={styles.previewSecondaryButtonText}>
                      {previewingRecipe.saved ? 'Unsave' : 'Save Recipe'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Bottom space for scrolling */}
                <View style={styles.previewBottomPadding} />
              </View>
            </ScrollView>
            
            {previewMode === 'peek' && (
              <TouchableOpacity 
                style={styles.expandButton}
                onPress={() => {
                  setPreviewMode('full');
                  triggerHaptic('light');
                }}
              >
                <Text style={styles.expandButtonText}>View More</Text>
                <ChevronDown size={16} color="#666" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      )}

      {/* Add tags section to the CookbookScreen render function, just after the search bar and before the sections */}
      <View style={{ marginBottom: 16 }}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
          <TouchableOpacity 
            onPress={() => {
              triggerHaptic('light');
              router.push('/tags/' as any);
            }}
            style={styles.seeAllButton}
          >
            <Text style={[styles.seeAllText, { color: colors.tint }]}>See All</Text>
            <ChevronRight size={16} color={colors.tint} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {topTags.map(tag => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.tagButton,
                { 
                  backgroundColor: tag.color + '20',
                  borderColor: tag.color + '40'
                }
              ]}
              onPress={() => handleTagPress(tag.id)}
            >
              <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
              <Text style={[styles.tagText, { color: colors.text }]}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F6',
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#333333',
    marginTop: 60,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
  },
  demoToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  toggleLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  filterActions: {
    flexDirection: 'row',
  },
  collectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(183, 214, 194, 0.15)',
    marginRight: 8,
  },
  collectionsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#65A382',
    marginLeft: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  chipScrollView: {
    flexGrow: 0,
  },
  chipContainer: {
    paddingRight: 16,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedChip: {
    backgroundColor: '#B7D6C2',
  },
  chipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#B7D6C2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  recipeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  recipeDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeAuthor: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  recipeTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  previewHint: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    fontSize: 8,
    color: '#99999940',
    fontFamily: 'Inter-Regular',
  },
  // Preview Styles
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    width: '100%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    position: 'relative',
  },
  previewDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  previewCloseButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewScroll: {
    maxHeight: '100%',
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  previewContent: {
    padding: 16,
  },
  previewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 12,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  previewDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  previewDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  previewDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 24,
  },
  previewSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  ingredientsList: {
    marginBottom: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B7D6C2',
    marginRight: 8,
  },
  ingredientText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  previewActions: {
    marginTop: 8,
  },
  previewButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  previewPrimaryButton: {
    backgroundColor: '#B7D6C2',
  },
  previewPrimaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  previewSecondaryButton: {
    borderWidth: 1,
    borderColor: '#B7D6C2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewSecondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#65A382',
  },
  previewBottomPadding: {
    height: 50,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
});
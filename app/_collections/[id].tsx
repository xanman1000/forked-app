import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Search, Clock, User, Edit2, MoreVertical, Plus, Heart, List, Grid } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Define interfaces
interface Recipe {
  id: number;
  title: string;
  image: string;
  author: string;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isLiked: boolean;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  isEditable: boolean;
  recipes: Recipe[];
}

export default function CollectionDetailScreen() {
  // Get collection ID from route params
  const { id } = useLocalSearchParams();
  
  // Theme management
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
    placeholder: isDark ? '#666666' : '#AAAAAA',
    searchBg: isDark ? '#2A2A2A' : '#F0F0F0',
    green: '#4CAF50', 
    orange: '#FF9800', 
    red: '#F44336',
    heart: '#F45D7A'
  };
  
  // Local state
  const [collection, setCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Generate mock data for the collection based on ID
  useEffect(() => {
    // In a real app, fetch this data from API
    const mockCollection: Collection = {
      id: id as string,
      name: id === 'default-favorites' ? 'All Saved Recipes' : 
            id === 'quick-meals' ? 'Quick Meals' :
            id === 'italian' ? 'Italian Favorites' :
            id === 'desserts' ? 'Desserts' : 'Collection',
      description: id === 'default-favorites' ? 'All your saved recipes' : 
                  id === 'quick-meals' ? 'Ready in 30 minutes or less' :
                  id === 'italian' ? 'Pasta, pizza and more' :
                  id === 'desserts' ? 'Sweet treats and baking recipes' : 'A collection of recipes',
      image: id === 'default-favorites' ? 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800&auto=format&fit=crop' :
             id === 'quick-meals' ? 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=800&auto=format&fit=crop' :
             id === 'italian' ? 'https://images.unsplash.com/photo-1576401443708-c45d3a4b4259?q=80&w=800&auto=format&fit=crop' :
             id === 'desserts' ? 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop' : 
             'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
      isEditable: id !== 'default-favorites',
      recipes: [
        {
          id: 1,
          title: 'spaghetti carbonara',
          image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?q=80&w=800&auto=format&fit=crop',
          author: 'mario rossi',
          prepTime: '25 mins',
          difficulty: 'medium' as 'easy' | 'medium' | 'hard',
          isLiked: true
        },
        {
          id: 2,
          title: 'authentic vegetable stir fry with tofu',
          image: 'https://i.ibb.co/Qn5b6sN/tofu-stir-fry-recipe-image.png',
          author: 'li wei',
          prepTime: '30 mins',
          difficulty: 'easy' as 'easy' | 'medium' | 'hard',
          isLiked: false
        },
        {
          id: 3,
          title: 'chocolate chip cookies',
          image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
          author: 'sarah baker',
          prepTime: '45 mins',
          difficulty: 'easy' as 'easy' | 'medium' | 'hard',
          isLiked: true
        },
        {
          id: 4,
          title: 'avocado toast',
          image: 'https://images.unsplash.com/photo-1603046891744-556223861dc7?q=80&w=800&auto=format&fit=crop',
          author: 'emma green',
          prepTime: '10 mins',
          difficulty: 'easy' as 'easy' | 'medium' | 'hard',
          isLiked: false
        },
        {
          id: 5,
          title: 'chicken curry',
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
          author: 'raj patel',
          prepTime: '40 mins',
          difficulty: 'medium' as 'easy' | 'medium' | 'hard',
          isLiked: true
        }
      ].filter(recipe => {
        if (id === 'quick-meals') {
          return ['avocado toast', 'authentic vegetable stir fry with tofu'].includes(recipe.title);
        }
        if (id === 'italian') {
          return ['spaghetti carbonara'].includes(recipe.title);
        }
        if (id === 'desserts') {
          return ['chocolate chip cookies'].includes(recipe.title);
        }
        return true; // Return all for default-favorites
      })
    };
    
    setCollection(mockCollection);
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
  
  // Filter recipes based on search query
  const filteredRecipes = collection?.recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Toggle like for a recipe
  const toggleLike = (recipeId: number) => {
    triggerHaptic('medium');
    
    if (collection) {
      setCollection({
        ...collection,
        recipes: collection.recipes.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, isLiked: !recipe.isLiked } 
            : recipe
        )
      });
    }
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    triggerHaptic('light');
    setIsGridView(!isGridView);
  };
  
  // Edit collection
  const handleEditCollection = () => {
    triggerHaptic('medium');
    // In a real app, navigate to edit screen
    Alert.alert('Coming Soon', 'Editing collections will be available in a future update');
  };
  
  // Show more options for collection
  const handleMoreOptions = () => {
    triggerHaptic('medium');
    // In a real app, show action sheet with options
    Alert.alert(
      'Collection Options',
      'What would you like to do?',
      [
        {
          text: 'Delete Collection',
          onPress: () => {
            triggerHaptic('warning');
            Alert.alert(
              'Delete Collection',
              `Are you sure you want to delete "${collection?.name}"? This action cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: () => {
                    triggerHaptic('error');
                    // In a real app, delete the collection and redirect
                    router.back();
                  }
                }
              ]
            );
          },
          style: 'destructive'
        },
        {
          text: 'Rename',
          onPress: handleEditCollection
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };
  
  // Add recipe to collection
  const handleAddRecipe = () => {
    triggerHaptic('medium');
    // In a real app, navigate to recipe selection screen
    Alert.alert('Coming Soon', 'Adding recipes to collections will be available in a future update');
  };
  
  // Handle recipe press
  const handleRecipePress = (recipeId: string) => {
    triggerHaptic('light');
    router.push(`/recipe/${recipeId}` as any);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    triggerHaptic('light');
  };
  
  // Display difficulty badge
  const DifficultBadge = ({ level }: { level: 'easy' | 'medium' | 'hard' }) => {
    let color = colors.green; // easy
    if (level === 'medium') color = colors.orange; // medium
    if (level === 'hard') color = colors.red; // hard

    return (
      <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.badgeText, { color }]}>{level}</Text>
      </View>
    );
  };
  
  // If collection not loaded yet
  if (!collection) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header with image background */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: collection.image }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay} />
        
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                triggerHaptic('light');
                router.back();
              }}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            
            {collection.isEditable && (
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleEditCollection}
                >
                  <Edit2 size={22} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={handleMoreOptions}
                >
                  <MoreVertical size={22} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.headerBottom}>
            <Text style={styles.headerTitle}>{collection.name}</Text>
            <Text style={styles.headerDescription}>{collection.description}</Text>
            <Text style={styles.recipeCount}>
              {collection.recipes.length} {collection.recipes.length === 1 ? 'recipe' : 'recipes'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Search and View Toggle */}
        <View style={styles.actionsRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.searchBg }]}>
            <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search in this collection"
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <ArrowLeft size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.viewButtons}>
            <TouchableOpacity 
              style={[
                styles.viewButton, 
                isGridView ? { backgroundColor: colors.tint + '20' } : null
              ]}
              onPress={() => {
                if (!isGridView) toggleViewMode();
              }}
            >
              <Grid size={20} color={isGridView ? colors.tint : colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.viewButton, 
                !isGridView ? { backgroundColor: colors.tint + '20' } : null
              ]}
              onPress={() => {
                if (isGridView) toggleViewMode();
              }}
            >
              <List size={20} color={!isGridView ? colors.tint : colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Recipe List */}
        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No recipes found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery.length > 0 
                ? 'Try a different search term'
                : 'Start adding recipes to your collection'}
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.tint }]}
              onPress={handleAddRecipe}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Add Recipes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {isGridView ? (
              // Grid View
              <FlatList
                data={filteredRecipes}
                numColumns={2}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.gridRow}
                keyExtractor={(item) => `recipe-${item.id}`}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: recipe }) => (
                  <TouchableOpacity
                    style={[styles.gridCard, { backgroundColor: colors.card }]}
                    onPress={() => handleRecipePress(recipe.id.toString())}
                    activeOpacity={0.8}
                  >
                    <Image 
                      source={{ uri: recipe.image }}
                      style={styles.gridImage}
                    />
                    <TouchableOpacity
                      style={styles.heartButton}
                      onPress={() => toggleLike(recipe.id)}
                    >
                      <Heart 
                        size={18} 
                        color={recipe.isLiked ? colors.heart : 'white'} 
                        fill={recipe.isLiked ? colors.heart : 'transparent'} 
                      />
                    </TouchableOpacity>
                    <View style={styles.gridInfo}>
                      <Text 
                        style={[styles.gridTitle, { color: colors.text }]}
                        numberOfLines={1}
                      >
                        {recipe.title}
                      </Text>
                      <View style={styles.gridMeta}>
                        <View style={styles.authorRow}>
                          <User size={12} color={colors.textSecondary} />
                          <Text style={[styles.authorText, { color: colors.textSecondary }]}>
                            {recipe.author}
                          </Text>
                        </View>
                        <View style={styles.prepRow}>
                          <Clock size={12} color={colors.textSecondary} />
                          <Text style={[styles.prepText, { color: colors.textSecondary }]}>
                            {recipe.prepTime}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.badgeContainer}>
                        <DifficultBadge level={recipe.difficulty} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  <TouchableOpacity 
                    style={[styles.addRecipeCard, { backgroundColor: colors.card + '80' }]}
                    onPress={handleAddRecipe}
                  >
                    <Plus size={24} color={colors.tint} />
                    <Text style={[styles.addRecipeText, { color: colors.text }]}>
                      Add Recipe
                    </Text>
                  </TouchableOpacity>
                }
              />
            ) : (
              // List View
              <FlatList
                data={filteredRecipes}
                contentContainerStyle={styles.listContent}
                keyExtractor={(item) => `recipe-list-${item.id}`}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: recipe }) => (
                  <TouchableOpacity
                    style={[styles.listCard, { backgroundColor: colors.card }]}
                    onPress={() => handleRecipePress(recipe.id.toString())}
                    activeOpacity={0.8}
                  >
                    <Image 
                      source={{ uri: recipe.image }}
                      style={styles.listImage}
                    />
                    <View style={styles.listInfo}>
                      <Text 
                        style={[styles.listTitle, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {recipe.title}
                      </Text>
                      <View style={styles.listMeta}>
                        <Text style={[styles.listAuthor, { color: colors.textSecondary }]}>
                          {recipe.author}
                        </Text>
                        <Text style={[styles.listTime, { color: colors.textSecondary }]}>
                          {recipe.prepTime}
                        </Text>
                      </View>
                      <View style={styles.listBottomRow}>
                        <DifficultBadge level={recipe.difficulty} />
                        <TouchableOpacity
                          style={styles.listHeartButton}
                          onPress={() => toggleLike(recipe.id)}
                        >
                          <Heart 
                            size={20} 
                            color={recipe.isLiked ? colors.heart : colors.textSecondary} 
                            fill={recipe.isLiked ? colors.heart : 'transparent'} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListFooterComponent={
                  <TouchableOpacity 
                    style={[styles.addRecipeRow, { backgroundColor: colors.card + '80' }]}
                    onPress={handleAddRecipe}
                  >
                    <Plus size={20} color={colors.tint} />
                    <Text style={[styles.addRecipeText, { color: colors.text }]}>
                      Add Recipe to Collection
                    </Text>
                  </TouchableOpacity>
                }
              />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  headerContainer: {
    height: 220,
    position: 'relative',
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 48 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  headerBottom: {
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  headerDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  recipeCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 4,
  },
  viewButtons: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  // Grid styles
  gridContent: {
    padding: 16,
    paddingTop: 0,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridInfo: {
    padding: 12,
  },
  gridTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  gridMeta: {
    marginBottom: 6,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  prepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  addRecipeCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(183, 214, 194, 0.3)',
    borderStyle: 'dashed',
  },
  addRecipeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  // List styles
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listImage: {
    width: 100,
    height: 100,
  },
  listInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  listMeta: {
    marginTop: 4,
  },
  listAuthor: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  listTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  listBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  listHeartButton: {
    padding: 4,
  },
  addRecipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(183, 214, 194, 0.3)',
    borderStyle: 'dashed',
  },
}); 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  useColorScheme,
  FlatList,
} from 'react-native';
import { Stack, router, Link } from 'expo-router';
import { PlusCircle, Search, FolderPlus, X, ChevronRight, MoreVertical } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Define collection interface
interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  recipeCount: number;
  isEditable: boolean;
}

export default function CollectionsScreen() {
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
  };
  
  // Collection states
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
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
  
  // Initialize with mock data
  useEffect(() => {
    setCollections([
      {
        id: 'default-favorites',
        name: 'All Saved Recipes',
        description: 'All your saved recipes',
        image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800&auto=format&fit=crop',
        recipeCount: 12,
        isEditable: false
      },
      {
        id: 'quick-meals',
        name: 'Quick Meals',
        description: 'Ready in 30 minutes or less',
        image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=800&auto=format&fit=crop',
        recipeCount: 5,
        isEditable: true
      },
      {
        id: 'italian',
        name: 'Italian Favorites',
        description: 'Pasta, pizza and more',
        image: 'https://images.unsplash.com/photo-1576401443708-c45d3a4b4259?q=80&w=800&auto=format&fit=crop',
        recipeCount: 3,
        isEditable: true
      },
      {
        id: 'desserts',
        name: 'Desserts',
        description: 'Sweet treats and baking recipes',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800&auto=format&fit=crop',
        recipeCount: 2,
        isEditable: true
      },
      {
        id: 'meal-prep',
        name: 'Meal Prep',
        description: 'Make ahead recipes',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop',
        recipeCount: 1,
        isEditable: true
      }
    ]);
  }, []);
  
  // Filter collections based on search query
  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Navigation handlers
  const handleCollectionPress = (collection: Collection) => {
    triggerHaptic('light');
    router.push(`/collections/${collection.id}` as any);
  };
  
  const handleCreateCollection = () => {
    triggerHaptic('medium');
    router.push('/collections/create' as any);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    triggerHaptic('light');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen
        options={{
          title: 'Collections',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleCreateCollection}
              style={styles.headerButton}
            >
              <PlusCircle size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.searchBg }]}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search collections"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Collections List */}
      <View style={styles.contentContainer}>
        {filteredCollections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076432.png' }}
              style={styles.emptyImage}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No collections found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery.length > 0 
                ? 'Try a different search term or create a new collection'
                : 'Create a collection to organize your saved recipes'}
            </Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.tint }]}
              onPress={handleCreateCollection}
            >
              <FolderPlus size={20} color="white" />
              <Text style={styles.createButtonText}>Create Collection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCollections}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: collection }) => (
              <TouchableOpacity
                style={[styles.collectionCard, { backgroundColor: colors.card }]}
                onPress={() => handleCollectionPress(collection)}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: collection.image }}
                  style={styles.collectionImage}
                />
                <View style={styles.collectionInfo}>
                  <View style={styles.collectionHeader}>
                    <Text style={[styles.collectionName, { color: colors.text }]}>
                      {collection.name}
                    </Text>
                    {collection.isEditable && (
                      <TouchableOpacity 
                        style={styles.moreButton}
                        onPress={() => {
                          triggerHaptic('light');
                          // Show options menu
                        }}
                      >
                        <MoreVertical size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  <Text style={[styles.collectionDescription, { color: colors.textSecondary }]}>
                    {collection.description}
                  </Text>
                  
                  <View style={styles.collectionFooter}>
                    <Text style={[styles.recipeCount, { color: colors.textSecondary }]}>
                      {collection.recipeCount} {collection.recipeCount === 1 ? 'recipe' : 'recipes'}
                    </Text>
                    <ChevronRight size={16} color={colors.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  collectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  collectionImage: {
    width: '100%',
    height: 120,
  },
  collectionInfo: {
    padding: 16,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collectionName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  moreButton: {
    padding: 4,
  },
  collectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  collectionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
}); 
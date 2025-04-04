import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  useColorScheme,
  Alert,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { PlusCircle, ChevronRight, Search, X, CheckCircle, Circle, Edit2, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Tag interface
interface Tag {
  id: string;
  name: string;
  color: string;
  recipeCount: number;
}

export default function TagsScreen() {
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
  
  // State variables
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Mock tags data
  useEffect(() => {
    setTags([
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
    ]);
  }, []);
  
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
  
  // Filter tags based on search
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle tag selection in edit mode
  const toggleTagSelection = (tagId: string) => {
    triggerHaptic('light');
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    triggerHaptic('light');
  };
  
  // Create new tag
  const handleCreateTag = () => {
    triggerHaptic('medium');
    // In a real app, navigate to create tag screen
    Alert.alert('Coming Soon', 'Tag creation will be available in a future update');
  };
  
  // Navigate to tag detail/recipes
  const handleTagPress = (tag: Tag) => {
    if (isEditMode) {
      toggleTagSelection(tag.id);
    } else {
      triggerHaptic('light');
      // Navigate to tag detail screen
      router.push({ pathname: '/tags/[id]', params: { id: tag.id }} as any);
    }
  };
  
  // Enter edit mode
  const toggleEditMode = () => {
    triggerHaptic('medium');
    setIsEditMode(!isEditMode);
    setSelectedTags([]);
  };
  
  // Delete selected tags
  const deleteSelectedTags = () => {
    if (selectedTags.length === 0) return;
    
    triggerHaptic('warning');
    
    Alert.alert(
      'Delete Tags',
      `Are you sure you want to delete ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            triggerHaptic('error');
            setTags(prev => prev.filter(tag => !selectedTags.includes(tag.id)));
            setSelectedTags([]);
            setIsEditMode(false);
          }
        }
      ]
    );
  };
  
  // Render item for tag
  const renderTagItem = ({ item: tag }: { item: Tag }) => (
    <TouchableOpacity
      style={[
        styles.tagItem, 
        { backgroundColor: colors.card },
        isEditMode && selectedTags.includes(tag.id) && { backgroundColor: colors.tint + '20' }
      ]}
      onPress={() => handleTagPress(tag)}
      activeOpacity={0.7}
    >
      <View style={styles.tagLeftSection}>
        {isEditMode ? (
          selectedTags.includes(tag.id) ? (
            <CheckCircle size={24} color={colors.tint} />
          ) : (
            <Circle size={24} color={colors.textSecondary} />
          )
        ) : (
          <View style={[styles.tagColor, { backgroundColor: tag.color }]} />
        )}
        <View style={styles.tagDetails}>
          <Text style={[styles.tagName, { color: colors.text }]}>
            {tag.name}
          </Text>
          <Text style={[styles.tagCount, { color: colors.textSecondary }]}>
            {tag.recipeCount} {tag.recipeCount === 1 ? 'recipe' : 'recipes'}
          </Text>
        </View>
      </View>
      
      {!isEditMode && (
        <ChevronRight size={18} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen
        options={{
          title: 'Tags',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isEditMode ? (
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={toggleEditMode}
                >
                  <Text style={[styles.doneText, { color: colors.tint }]}>Done</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={toggleEditMode}
                  >
                    <Edit2 size={22} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={handleCreateTag}
                  >
                    <PlusCircle size={22} color={colors.tint} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />
      
      {/* Search bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.searchBg }]}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tags"
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Tag list */}
      {filteredTags.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3143/3143350.png' }}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No tags found
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery.length > 0 
              ? 'Try a different search term'
              : 'Create tags to organize your recipes'}
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.tint }]}
            onPress={handleCreateTag}
          >
            <PlusCircle size={20} color="white" />
            <Text style={styles.createButtonText}>Create Tag</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Delete button in edit mode */}
      {isEditMode && selectedTags.length > 0 && (
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: '#F44336' }]}
          onPress={deleteSelectedTags}
        >
          <Trash2 size={20} color="white" />
          <Text style={styles.deleteButtonText}>
            Delete ({selectedTags.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  doneText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  tagDetails: {
    marginLeft: 16,
  },
  tagName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  tagCount: {
    fontFamily: 'Inter-Regular',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  deleteButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
}); 
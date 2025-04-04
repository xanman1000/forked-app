import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  Camera, 
  X, 
  Plus, 
  Clock, 
  Users, 
  ChefHat, 
  Tag as TagIcon, 
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Minus,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

export default function CreateRecipeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  // Colors based on theme
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
    error: '#FF6B6B',
    highlight: isDark ? '#2A2A2A' : '#EAEAEA',
  };

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Helper function for haptic feedback
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
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  // Add/remove ingredient fields
  const addIngredient = () => {
    triggerHaptic('light');
    setIngredients([...ingredients, '']);
  };
  
  const removeIngredient = (index: number) => {
    triggerHaptic('medium');
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients.length ? newIngredients : ['']);
  };
  
  const updateIngredient = (text: string, index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };
  
  // Add/remove instruction fields
  const addInstruction = () => {
    triggerHaptic('light');
    setInstructions([...instructions, '']);
  };
  
  const removeInstruction = (index: number) => {
    triggerHaptic('medium');
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions.length ? newInstructions : ['']);
  };
  
  const updateInstruction = (text: string, index: number) => {
    const newInstructions = [...instructions];
    newInstructions[index] = text;
    setInstructions(newInstructions);
  };
  
  // Tags management
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      triggerHaptic('light');
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (index: number) => {
    triggerHaptic('medium');
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  
  // Save recipe handler
  const handleSave = () => {
    triggerHaptic('success');
    // In a real app, this would save the recipe data to a database
    console.log('Recipe saved', {
      title,
      description,
      prepTime,
      cookTime,
      servings,
      difficulty,
      ingredients: ingredients.filter(i => i.trim()),
      instructions: instructions.filter(i => i.trim()),
      tags,
    });
    router.back();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Create Recipe',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.tint }]} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Uploader */}
        <TouchableOpacity 
          style={[styles.imageUploader, { borderColor: colors.border }]}
          onPress={() => triggerHaptic('medium')}
        >
          <Camera size={32} color={colors.textSecondary} />
          <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
            Add Cover Photo
          </Text>
        </TouchableOpacity>
        
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}
            placeholder="Recipe Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.textArea, { 
              color: colors.text, 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }]}
            placeholder="Write a short description of your recipe"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        {/* Recipe Details */}
        <View style={styles.detailsContainer}>
          {/* Prep Time */}
          <View style={styles.detailInput}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={colors.text} />
            </View>
            <TextInput
              style={[styles.detailTextInput, { 
                color: colors.text, 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              placeholder="Prep Time (mins)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
          
          {/* Cook Time */}
          <View style={styles.detailInput}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={colors.text} />
            </View>
            <TextInput
              style={[styles.detailTextInput, { 
                color: colors.text, 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              placeholder="Cook Time (mins)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              value={cookTime}
              onChangeText={setCookTime}
            />
          </View>
          
          {/* Servings */}
          <View style={styles.detailInput}>
            <View style={styles.detailIconContainer}>
              <Users size={20} color={colors.text} />
            </View>
            <TextInput
              style={[styles.detailTextInput, { 
                color: colors.text, 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              placeholder="Servings"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              value={servings}
              onChangeText={setServings}
            />
          </View>
        </View>
        
        {/* Difficulty */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  { 
                    backgroundColor: 
                      difficulty === level ? colors.tint : colors.card,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setDifficulty(level as 'Easy' | 'Medium' | 'Hard');
                }}
              >
                <ChefHat 
                  size={16} 
                  color={difficulty === level ? '#FFFFFF' : colors.textSecondary} 
                />
                <Text 
                  style={[
                    styles.difficultyText,
                    { color: difficulty === level ? '#FFFFFF' : colors.textSecondary }
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Ingredients */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={`ingredient-${index}`} style={styles.listItemContainer}>
              <TextInput
                style={[styles.listItemInput, { 
                  color: colors.text, 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }]}
                placeholder={`Ingredient ${index + 1}`}
                placeholderTextColor={colors.textSecondary}
                value={ingredient}
                onChangeText={(text) => updateIngredient(text, index)}
              />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={() => removeIngredient(index)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={addIngredient}
          >
            <Plus size={16} color={colors.textSecondary} />
            <Text style={[styles.addButtonText, { color: colors.textSecondary }]}>
              Add Ingredient
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Instructions */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={`instruction-${index}`} style={styles.listItemContainer}>
              <View style={styles.instructionNumberContainer}>
                <Text style={[styles.instructionNumber, { color: colors.text }]}>
                  {index + 1}
                </Text>
              </View>
              <TextInput
                style={[styles.instructionInput, { 
                  color: colors.text, 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }]}
                placeholder={`Step ${index + 1}`}
                placeholderTextColor={colors.textSecondary}
                value={instruction}
                onChangeText={(text) => updateInstruction(text, index)}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={() => removeInstruction(index)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={addInstruction}
          >
            <Plus size={16} color={colors.textSecondary} />
            <Text style={[styles.addButtonText, { color: colors.textSecondary }]}>
              Add Step
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tags */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View 
                key={`tag-${index}`} 
                style={[styles.tag, { backgroundColor: colors.tint }]}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => removeTag(index)}
                >
                  <X size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.tagInputContainer}>
            <View style={[styles.tagIconContainer, { backgroundColor: colors.highlight }]}>
              <TagIcon size={16} color={colors.textSecondary} />
            </View>
            <TextInput
              style={[styles.tagTextInput, { 
                color: colors.text, 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }]}
              placeholder="Add tags..."
              placeholderTextColor={colors.textSecondary}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addTagButton, { backgroundColor: colors.tint }]}
              onPress={addTag}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  imageUploader: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailInput: {
    width: '31%',
  },
  detailIconContainer: {
    position: 'absolute',
    left: 10,
    top: 15,
    zIndex: 1,
  },
  detailTextInput: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 36,
    paddingRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    width: '31%',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 10,
  },
  instructionNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B7D6C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  instructionNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  instructionInput: {
    flex: 1,
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 10,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B7D6C2',
    borderRadius: 16,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginRight: 4,
  },
  removeTagButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIconContainer: {
    position: 'absolute',
    left: 10,
    top: 13,
    zIndex: 1,
  },
  tagTextInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 36,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginRight: 10,
  },
  addTagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
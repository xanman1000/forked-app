import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  useColorScheme,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Camera, X, Check, Image as ImageIcon, Save } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function CreateCollectionScreen() {
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
    inputBg: isDark ? '#2A2A2A' : '#F0F0F0',
    error: isDark ? '#FF6B6B' : '#E74C3C',
  };
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCoverImage, setSelectedCoverImage] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Example images for cover selection
  const coverImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop',
  ];
  
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
  
  // Form validation
  const validateForm = () => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Collection name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!selectedCoverImage) {
      triggerHaptic('warning');
      Alert.alert('No Cover Image', 'Please select a cover image for your collection');
      isValid = false;
    }
    
    return isValid;
  };
  
  // Submit form handler
  const handleCreateCollection = () => {
    if (validateForm()) {
      triggerHaptic('success');
      
      // In a real app, this would make an API call to create the collection
      console.log('Creating collection:', {
        name,
        description,
        coverImage: selectedCoverImage,
      });
      
      // Show success message and go back to collections list
      Alert.alert(
        'Collection Created',
        `"${name}" has been created successfully`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      triggerHaptic('error');
    }
  };
  
  // Navigation handlers
  const handleCancel = () => {
    triggerHaptic('light');
    router.back();
  };
  
  // Select cover image
  const handleSelectCoverImage = (imageUrl: string) => {
    triggerHaptic('light');
    setSelectedCoverImage(imageUrl);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen
        options={{
          title: 'Create Collection',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateCollection} style={styles.headerButton}>
              <Check size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            Collection Name
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: nameError ? colors.error : 'transparent'
              }
            ]}
            placeholder="Enter collection name"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          {nameError ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {nameError}
            </Text>
          ) : null}
          
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {name.length}/50
          </Text>
          
          <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>
            Description (Optional)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: colors.inputBg,
                color: colors.text,
              }
            ]}
            placeholder="Describe your collection..."
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {description.length}/200
          </Text>
        </View>
        
        {/* Cover Image Selection */}
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            Cover Image
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
          >
            {/* Custom upload option */}
            <TouchableOpacity 
              style={[
                styles.imageUploadButton, 
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.separator,
                }
              ]}
              onPress={() => {
                triggerHaptic('medium');
                Alert.alert('Feature Coming Soon', 'Custom image upload will be available in a future update');
              }}
            >
              <Camera size={24} color={colors.textSecondary} style={styles.uploadIcon} />
              <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                Upload
              </Text>
            </TouchableOpacity>
            
            {/* Predefined images */}
            {coverImages.map((imageUrl, index) => (
              <TouchableOpacity
                key={`cover-${index}`}
                style={[
                  styles.imageOption,
                  selectedCoverImage === imageUrl && {
                    borderColor: colors.tint,
                    borderWidth: 3,
                  }
                ]}
                onPress={() => handleSelectCoverImage(imageUrl)}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.coverImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.tint }]}
          onPress={handleCreateCollection}
        >
          <Save size={20} color="white" />
          <Text style={styles.createButtonText}>Create Collection</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  imageUploadButton: {
    width: 120,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  imageOption: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 
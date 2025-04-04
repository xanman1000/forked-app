import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  useColorScheme,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Camera, ArrowLeft, Check, Mail, User, Calendar, MapPin, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Define theme colors
const lightColors = {
  background: '#F9F8F6',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  input: '#F5F5F5',
  inputText: '#333333',
  border: 'rgba(0, 0, 0, 0.05)',
  tint: '#B7D6C2',
  iconBackground: '#F0F0F0',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  input: '#2A2A2A',
  inputText: '#F5F5F5',
  border: 'rgba(255, 255, 255, 0.1)',
  tint: '#B7D6C2',
  iconBackground: '#2A2A2A',
};

// Function to trigger haptic feedback
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

export default function AccountSettingsScreen() {
  // Theme management
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  
  // Mock user data - in a real app, this would come from a state management system or API
  const [userData, setUserData] = useState({
    name: 'Jane Cooper',
    username: 'janecooper',
    email: 'jane.cooper@example.com',
    bio: 'Food enthusiast. Love creating healthy recipes and sharing cooking tips.',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    birthdate: '15 June 1992',
  });
  
  // Input states
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [email, setEmail] = useState(userData.email);
  const [bio, setBio] = useState(userData.bio);
  const [location, setLocation] = useState(userData.location);
  const [phone, setPhone] = useState(userData.phone);
  const [birthdate, setBirthdate] = useState(userData.birthdate);
  
  // Navigate back
  const goBack = () => {
    triggerHaptic('light');
    router.back();
  };
  
  // Save changes
  const saveChanges = () => {
    triggerHaptic('success');
    
    // In a real app, this would make an API call to update the user profile
    setUserData({
      name,
      username,
      email,
      bio,
      location,
      phone,
      birthdate,
    });
    
    Alert.alert('Success', 'Your profile has been updated successfully!');
  };
  
  // Change profile picture
  const changeProfilePicture = () => {
    triggerHaptic('medium');
    // In a real app, this would open the image picker or camera
    Alert.alert('Coming Soon', 'Profile picture upload will be available in the next update!');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
              <Check size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Picture Section */}
        <View style={styles.profilePictureContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.profilePicture}
          />
          <TouchableOpacity 
            style={[styles.cameraButton, { backgroundColor: colors.iconBackground }]}
            onPress={changeProfilePicture}
          >
            <Camera size={20} color={colors.tint} />
          </TouchableOpacity>
        </View>
        
        {/* Input Fields */}
        <View style={styles.inputSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            PERSONAL INFORMATION
          </Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
            {/* Name Field */}
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputIcon}>
                <User size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Full Name
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
            
            {/* Username Field */}
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputIcon}>
                <User size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Username
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Your username"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
            
            {/* Email Field */}
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Email
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            {/* Phone Field */}
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputIcon}>
                <Phone size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Phone
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Your phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            
            {/* Location Field */}
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputIcon}>
                <MapPin size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Location
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Your location"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
            
            {/* Birthdate Field */}
            <View style={styles.inputRow}>
              <View style={styles.inputIcon}>
                <Calendar size={20} color={colors.tint} />
              </View>
              <View style={styles.inputField}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Birthdate
                </Text>
                <TextInput
                  style={[styles.input, { color: colors.inputText }]}
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder="Your birthdate"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>
        
        {/* Bio Section */}
        <View style={styles.inputSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ABOUT YOU
          </Text>
          
          <View style={[styles.bioContainer, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.bioInput, { color: colors.inputText }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={[styles.characterCount, { color: colors.textSecondary }]}>
            {bio.length}/160 characters
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputField: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: 4,
  },
  bioContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bioInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    minHeight: 100,
  },
  characterCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
}); 
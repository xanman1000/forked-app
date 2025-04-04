import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  useColorScheme,
  SafeAreaView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChefHat, ChevronRight, Check, AlertCircle } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Brand colors
const BRAND_COLORS = {
  background: '#F9F8F6', // Off-White Speckled
  primary: '#2F3A32', // Dark Green/Charcoal
  accent: '#B7D6C2', // Mint/Sage accent
  text: '#333333', // Text standard
};

const CUISINE_OPTIONS = [
  'Italian', 'Asian', 'Mexican', 'Mediterranean', 
  'American', 'Indian', 'French', 'Middle Eastern',
  'Thai', 'Japanese', 'Korean', 'Greek'
];

const DIET_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
  'Keto', 'Paleo', 'Low-Carb', 'Low-Fat'
];

const SKILL_LEVELS = [
  { label: 'Beginner', value: 'beginner', description: 'I\'m just starting to cook' },
  { label: 'Intermediate', value: 'intermediate', description: 'I can follow most recipes' },
  { label: 'Advanced', value: 'advanced', description: 'I can improvise and create my own recipes' }
];

export default function OnboardingScreen() {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Theme colors
  const theme = {
    background: isDarkMode ? '#121212' : BRAND_COLORS.background,
    text: isDarkMode ? '#F5F5F5' : BRAND_COLORS.text,
    textSecondary: isDarkMode ? '#AAAAAA' : BRAND_COLORS.text,
    accent: BRAND_COLORS.accent,
    primary: BRAND_COLORS.primary,
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    buttonText: '#333333',
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
  
  // Handle next step with animation
  const goToNextStep = () => {
    if (currentStep < 5) {
      triggerHaptic('medium');
      
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Complete onboarding and navigate to main app
      completeOnboarding();
    }
  };
  
  // Handle back step with animation
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      triggerHaptic('light');
      
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };
  
  // Toggle cuisine selection
  const toggleCuisine = (cuisine: string) => {
    triggerHaptic('light');
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine) 
        : [...prev, cuisine]
    );
  };
  
  // Toggle diet selection
  const toggleDiet = (diet: string) => {
    triggerHaptic('light');
    setSelectedDiets(prev => 
      prev.includes(diet) 
        ? prev.filter(d => d !== diet) 
        : [...prev, diet]
    );
  };
  
  // Set skill level
  const selectSkillLevel = (level: string) => {
    triggerHaptic('medium');
    setSkillLevel(level);
  };
  
  // Complete onboarding flow
  const completeOnboarding = () => {
    triggerHaptic('success');
    
    // Navigate to email auth with signup mode
    router.replace({ 
      pathname: '/(auth)/email-auth',
      params: { isSignUp: 'true' }
    });
    
    // Only mark onboarding as complete AFTER successful account creation
    // The global.completeOnboarding call is now handled in the AuthProvider after successful signup
  };
  
  // Skip onboarding
  const skipOnboarding = () => {
    triggerHaptic('medium');
    router.replace('/(auth)/login-signup');
  };
  
  // Determine if the Next button should be enabled for the current step
  const isNextEnabled = () => {
    switch (currentStep) {
      case 0: // Welcome screen
        return true;
      case 1: // Profile screen
        return name.trim().length > 0 && username.trim().length > 0;
      case 2: // Cuisine preferences
        return selectedCuisines.length > 0;
      case 3: // Dietary preferences
        return true; // Optional
      case 4: // Cooking skill
        return skillLevel !== null;
      case 5: // Create account step
        return true;
      default:
        return false;
    }
  };
  
  // Render progress dots
  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3, 4, 5].map((step) => (
          <View 
            key={step}
            style={[
              styles.progressDot, 
              { backgroundColor: step === currentStep ? theme.accent : step < currentStep ? '#C8E4D0' : theme.border }
            ]}
          />
        ))}
      </View>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=1000&auto=format&fit=crop' }}
              style={styles.welcomeImage}
            />
            <Text style={[styles.title, { color: theme.text, textTransform: 'lowercase' }]}>welcome to forked</Text>
            <Text style={[styles.description, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              discover, create, and share delicious recipes with a vibrant community of food lovers.
            </Text>
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <ChefHat size={24} color={theme.accent} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text, textTransform: 'lowercase' }]}>ai-powered recipes</Text>
                  <Text style={[styles.featureDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
                    create custom recipes with the help of ai
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1830/1830839.png' }}
                    style={{ width: 24, height: 24, tintColor: theme.accent }}
                  />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text, textTransform: 'lowercase' }]}>personal cookbook</Text>
                  <Text style={[styles.featureDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
                    save your favorite recipes in one place
                  </Text>
                </View>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3500/3500833.png' }}
                    style={{ width: 24, height: 24, tintColor: theme.accent }}
                  />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: theme.text, textTransform: 'lowercase' }]}>community</Text>
                  <Text style={[styles.featureDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
                    share and discover recipes from others
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text, textTransform: 'lowercase' }]}>tell us about yourself</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              let's create your profile. this helps personalize your experience.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text, textTransform: 'lowercase' }]}>full name</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="enter your name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.text, textTransform: 'lowercase' }]}>username</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="choose a username"
                placeholderTextColor={theme.textSecondary}
                value={username}
                onChangeText={setUsername}
              />
              <Text style={[styles.inputHint, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
                this will be your @handle for sharing recipes
              </Text>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text, textTransform: 'lowercase' }]}>cuisine preferences</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              select cuisines you enjoy cooking or want to explore.
            </Text>
            
            <ScrollView style={styles.optionsScrollView}>
              <View style={styles.optionsGrid}>
                {CUISINE_OPTIONS.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.optionItem,
                      { 
                        backgroundColor: selectedCuisines.includes(cuisine) ? '#C8E4D0' : theme.card,
                        borderColor: selectedCuisines.includes(cuisine) ? theme.accent : theme.border
                      }
                    ]}
                    onPress={() => toggleCuisine(cuisine)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        { color: selectedCuisines.includes(cuisine) ? '#333333' : theme.text, textTransform: 'lowercase' }
                      ]}
                    >
                      {cuisine.toLowerCase()}
                    </Text>
                    {selectedCuisines.includes(cuisine) && (
                      <View style={styles.checkIcon}>
                        <Check size={14} color="#333333" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <Text style={[styles.selectionCount, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              {selectedCuisines.length} cuisines selected
            </Text>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text, textTransform: 'lowercase' }]}>dietary preferences</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              do you have any dietary preferences or restrictions?
            </Text>
            
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              this helps us suggest suitable recipes (optional)
            </Text>
            
            <ScrollView style={styles.optionsScrollView}>
              <View style={styles.optionsGrid}>
                {DIET_OPTIONS.map((diet) => (
                  <TouchableOpacity
                    key={diet}
                    style={[
                      styles.optionItem,
                      { 
                        backgroundColor: selectedDiets.includes(diet) ? '#C8E4D0' : theme.card,
                        borderColor: selectedDiets.includes(diet) ? theme.accent : theme.border
                      }
                    ]}
                    onPress={() => toggleDiet(diet)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        { color: selectedDiets.includes(diet) ? '#333333' : theme.text, textTransform: 'lowercase' }
                      ]}
                    >
                      {diet.toLowerCase()}
                    </Text>
                    {selectedDiets.includes(diet) && (
                      <View style={styles.checkIcon}>
                        <Check size={14} color="#333333" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text, textTransform: 'lowercase' }]}>cooking skill level</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              how would you describe your cooking experience?
            </Text>
            
            <View style={styles.skillLevelsContainer}>
              {SKILL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.skillLevelItem,
                    { 
                      backgroundColor: skillLevel === level.value ? '#C8E4D0' : theme.card,
                      borderColor: skillLevel === level.value ? theme.accent : theme.border
                    }
                  ]}
                  onPress={() => selectSkillLevel(level.value)}
                >
                  <Text 
                    style={[
                      styles.skillLevelTitle,
                      { color: skillLevel === level.value ? '#333333' : theme.text, textTransform: 'lowercase' }
                    ]}
                  >
                    {level.label.toLowerCase()}
                  </Text>
                  <Text 
                    style={[
                      styles.skillLevelDescription,
                      { color: skillLevel === level.value ? '#333333' : theme.textSecondary, textTransform: 'lowercase' }
                    ]}
                  >
                    {level.description.toLowerCase()}
                  </Text>
                  {skillLevel === level.value && (
                    <View style={styles.selectedIndicator}>
                      <Check size={16} color="#333333" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.finalNote}>
              <AlertCircle size={16} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <Text style={[styles.finalNoteText, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
                your profile helps us customize recipe suggestions and difficulty levels
              </Text>
            </View>
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.text, textTransform: 'lowercase' }]}>create your account</Text>
            <Text style={[styles.stepDescription, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
              final step! create an account to save your preferences and access all features.
            </Text>
            
            <View style={styles.createAccountContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2000&auto=format&fit=crop' }}
                style={styles.accountImage}
                resizeMode="cover"
              />
              
              <View style={styles.accountBenefits}>
                <View style={styles.benefitItem}>
                  <Check size={20} color={theme.accent} />
                  <Text style={[styles.benefitText, { color: theme.text, textTransform: 'lowercase' }]}>
                    save personalized recipes
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={20} color={theme.accent} />
                  <Text style={[styles.benefitText, { color: theme.text, textTransform: 'lowercase' }]}>
                    connect with other food lovers
                  </Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={20} color={theme.accent} />
                  <Text style={[styles.benefitText, { color: theme.text, textTransform: 'lowercase' }]}>
                    sync across all your devices
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={goToPreviousStep}
          >
            <Text style={[styles.backButtonText, { color: theme.textSecondary, textTransform: 'lowercase' }]}>back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={skipOnboarding}
        >
          <Text style={[styles.skipButtonText, { color: theme.textSecondary, textTransform: 'lowercase' }]}>
            {currentStep === 5 ? 'skip preferences' : 'skip'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderProgressDots()}
      
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
          {renderStepContent()}
        </Animated.View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {currentStep < 5 && currentStep > 0 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPreviousStep}
          >
            <Text style={[styles.navButtonText, { color: theme.textSecondary, textTransform: 'lowercase' }]}>back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton, 
            { 
              backgroundColor: isNextEnabled() ? theme.primary : '#CCCCCC', 
              opacity: isNextEnabled() ? 1 : 0.7,
              marginLeft: currentStep < 5 ? 10 : 0,
              flex: 1,
              height: currentStep === 5 ? 60 : 56,
            }
          ]}
          onPress={goToNextStep}
          disabled={!isNextEnabled()}
        >
          <Text style={[
            styles.navButtonText, 
            styles.nextButtonText, 
            { 
              color: '#FFFFFF',
              fontSize: currentStep === 5 ? 18 : 16,
              textTransform: 'lowercase'
            }
          ]}>
            {currentStep === 5 ? 'create account' : 'next'}
          </Text>
          <ChevronRight size={currentStep === 5 ? 22 : 20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  animatedContent: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    marginBottom: 20,
  },
  welcomeImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  features: {
    marginTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(183, 214, 194, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  inputHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  optionsScrollView: {
    maxHeight: 350,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionItem: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B7D6C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: -12,
    marginBottom: 24,
  },
  skillLevelsContainer: {
    marginTop: 12,
  },
  skillLevelItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    position: 'relative',
  },
  skillLevelTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  skillLevelDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#B7D6C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(183, 214, 194, 0.1)',
    borderRadius: 12,
  },
  finalNoteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  createAccountContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  accountImage: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: 12,
    marginBottom: 24,
  },
  accountBenefits: {
    width: '100%',
    marginTop: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 
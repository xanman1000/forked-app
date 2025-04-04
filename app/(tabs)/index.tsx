import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Wand as Wand2, PlusCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateScreen() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
  };

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

  const handleGenerate = () => {
    triggerHaptic('medium');
    // TODO: Implement recipe generation
    console.log('Cooking with AI for:', prompt);
  };

  const handleManualCreate = () => {
    triggerHaptic('medium');
    router.push('/create');
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }
    ]}>
      <Text style={[styles.title, { color: colors.text }]}>what are you cooking today?</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>describe your dream dish or create one manually</Text>

      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: isDark ? colors.card : 'white',
            borderColor: colors.border,
            color: colors.text,
          }
        ]}
        placeholder="e.g., spicy mac and cheese with crispy breadcrumbs"
        placeholderTextColor={colors.textSecondary}
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, !prompt && styles.buttonDisabled, { backgroundColor: colors.tint }]}
        onPress={handleGenerate}
        disabled={!prompt}>
        <Wand2 size={24} color={isDark ? "#333333" : "#333333"} />
        <Text style={styles.buttonText}>cook with AI</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manualButton}
        onPress={handleManualCreate}>
        <PlusCircle size={20} color={colors.textSecondary} />
        <Text style={[styles.manualButtonText, { color: colors.textSecondary }]}>create recipe manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginTop: 40,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    padding: 10,
  },
  manualButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
});
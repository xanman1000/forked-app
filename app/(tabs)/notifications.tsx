import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'rating';
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  time: string;
  recipe?: {
    id: string;
    title: string;
    image: string;
  };
  read: boolean;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    content: 'liked your Avocado Toast recipe',
    time: '10 min ago',
    recipe: {
      id: '1',
      title: 'Avocado Toast with Poached Eggs',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2880&auto=format&fit=crop',
    },
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Marco Rossi',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    content: 'commented on your Berry Protein Smoothie Bowl',
    time: '2 hours ago',
    recipe: {
      id: '2',
      title: 'Berry Protein Smoothie Bowl',
      image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?q=80&w=3280&auto=format&fit=crop',
    },
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    user: {
      name: 'Alex Chen',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    content: 'started following you',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    type: 'rating',
    user: {
      name: 'Sophia Kim',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    content: 'gave your Margherita Pizza recipe 5 stars',
    time: '2 days ago',
    recipe: {
      id: '3',
      title: 'Classic Margherita Pizza',
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=3269&auto=format&fit=crop',
    },
    read: true,
  },
  {
    id: '5',
    type: 'mention',
    user: {
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    content: 'mentioned you in a comment',
    time: '3 days ago',
    recipe: {
      id: '1',
      title: 'Avocado Toast with Poached Eggs',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2880&auto=format&fit=crop',
    },
    read: true,
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };
  
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
    >
      <View style={styles.avatar}>
        {/* Would use Image component with source={item.user.avatar} in actual implementation */}
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.user.name}
          </Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
        </View>
        <Text 
          style={[styles.notificationText, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {item.content}
        </Text>
        
        {item.recipe && (
          <Text 
            style={[styles.recipeTitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {item.recipe.title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }
    ]}>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerShadowVisible: false,
        }}
      />
      
      <FlatList
        data={mockNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.notificationsList,
          { paddingBottom: 100 }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDD',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
  },
  timeText: {
    fontSize: 12,
  },
  notificationText: {
    fontSize: 14,
    marginTop: 2,
  },
  recipeTitle: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 
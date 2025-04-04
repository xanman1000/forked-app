import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Emma Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    message: 'That avocado toast recipe was amazing! Thanks for sharing!',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    sender: 'Alex Chen',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    message: 'I tried your smoothie bowl recipe this morning. So refreshing!',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    sender: 'Marco Rossi',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    message: 'Do you have any recommendations for a good pasta sauce?',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    sender: 'Sophia Kim',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    message: 'Just shared your quinoa bowl recipe with my friends!',
    time: '2 days ago',
    unread: false,
  },
];

export default function MessagesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    unreadBadge: '#B7D6C2',
  };
  
  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={[
        styles.messageItem, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
        }
      ]}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {/* Would use Image component with source={item.avatar} in actual implementation */}
        </View>
        {item.unread && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.unreadBadge }]} />
        )}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.senderName, { color: colors.text }]}>{item.sender}</Text>
          <Text style={[styles.messageTime, { color: colors.textSecondary }]}>{item.time}</Text>
        </View>
        <Text 
          style={[
            styles.messageText, 
            { color: colors.textSecondary },
            item.unread && { color: colors.text, fontWeight: '500' }
          ]}
          numberOfLines={1}
        >
          {item.message}
        </Text>
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
          title: 'Messages',
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
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.messagesList,
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
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DDD',
  },
  unreadBadge: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B7D6C2',
    right: 0,
    top: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  senderName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  messageTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 4,
  },
}); 
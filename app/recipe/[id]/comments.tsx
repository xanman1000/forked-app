import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
  Animated,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// Comment types
interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

// Demo comments data
const DEMO_COMMENTS: Comment[] = [
  {
    id: '1',
    authorName: 'Alex Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    text: 'This recipe is amazing! I tried it last weekend for brunch with friends and everyone loved it. The poached eggs came out perfect!',
    date: '2 days ago',
    likes: 12,
    isLiked: false,
  },
  {
    id: '2',
    authorName: 'Sophia Kim',
    authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    text: 'I added some chili flakes for extra heat and it was delicious. Thanks for sharing this recipe!',
    date: '1 week ago',
    likes: 8,
    isLiked: true,
  },
  {
    id: '3',
    authorName: 'Marco Rossi',
    authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    text: 'What brand of bread do you recommend for this? I tried it with sourdough and it was great.',
    date: '2 weeks ago',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '3-1',
        authorName: 'Emma Wilson',
        authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'I usually use whole grain or sourdough, but any good quality bread works great!',
        date: '2 weeks ago',
        likes: 3,
        isLiked: false,
      }
    ]
  },
  {
    id: '4',
    authorName: 'James Wilson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Is there a way to make this dairy-free?',
    date: '3 weeks ago',
    likes: 2,
    isLiked: false,
    replies: [
      {
        id: '4-1',
        authorName: 'Emma Wilson',
        authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'This recipe is already dairy-free! The avocado provides all the creaminess you need without any dairy.',
        date: '3 weeks ago',
        likes: 4,
        isLiked: true,
      }
    ]
  },
  {
    id: '5',
    authorName: 'Olivia Taylor',
    authorAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    text: 'I made this for breakfast today and it was fantastic! So simple yet so delicious.',
    date: '1 month ago',
    likes: 7,
    isLiked: false,
  },
];

export default function RecipeCommentsScreen() {
  const { id } = useLocalSearchParams();
  const recipeId = Array.isArray(id) ? id[0] : id;
  
  // States
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  
  // Theme colors
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
    placeholder: isDark ? '#555555' : '#AAAAAA',
    inputBackground: isDark ? '#2A2A2A' : '#FFFFFF',
    heartActive: '#FF6B6B',
    heartInactive: isDark ? '#555555' : '#DDDDDD',
    reply: isDark ? '#2A2A2A' : '#F0F0F0',
  };
  
  // Animation
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Refs
  const commentInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  
  // Helper function for haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    // Only use haptics on iOS and Android
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
  
  // Navigate back
  const handleBackPress = () => {
    triggerHaptic('light');
    router.back();
  };
  
  // Toggle like on comment
  const toggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    triggerHaptic('light');
    if (isReply && parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            })
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      }));
    }
  };
  
  // Start replying to a comment
  const handleReply = (comment: Comment) => {
    triggerHaptic('light');
    setReplyingTo(comment);
    
    // Animate reply bar entrance
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Focus the input
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 100);
    
    // Scroll to the comment
    const index = comments.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    }
  };
  
  // Cancel replying
  const handleCancelReply = () => {
    triggerHaptic('light');
    
    // Animate reply bar exit
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setReplyingTo(null);
    });
    
    // Clear input and dismiss keyboard
    setCommentText('');
    Keyboard.dismiss();
  };
  
  // Submit a comment or reply
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    triggerHaptic('success');
    
    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: 'You',
      authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: commentText.trim(),
      date: 'Just now',
      likes: 0,
      isLiked: false,
    };
    
    if (replyingTo) {
      // Add reply to existing comment
      setComments(comments.map(comment => {
        if (comment.id === replyingTo.id) {
          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, newComment] : [newComment],
          };
        }
        return comment;
      }));
      
      // Reset replying state and animate out
      handleCancelReply();
    } else {
      // Add new top-level comment
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };
  
  // Render a comment item
  const renderComment = ({ item, isReply = false, parentId = '' }: { item: Comment, isReply?: boolean, parentId?: string }) => (
    <View style={[
      styles.commentContainer,
      isReply && styles.replyContainer,
      isReply && { backgroundColor: colors.reply },
    ]}>
      <View style={styles.commentHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>
        <View style={styles.commentMetaContainer}>
          <Text style={[styles.authorName, { color: colors.text }]}>{item.authorName}</Text>
          <Text style={[styles.commentDate, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
      </View>
      
      <Text style={[styles.commentText, { color: colors.text }]}>{item.text}</Text>
      
      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => toggleLike(item.id, isReply, parentId)}
        >
          <Text style={[
            styles.likeText,
            { color: item.isLiked ? colors.heartActive : colors.textSecondary }
          ]}>
            ♥ {item.likes > 0 ? item.likes : ''}
          </Text>
        </TouchableOpacity>
        
        {!isReply && (
          <TouchableOpacity
            style={styles.replyButton}
            onPress={() => handleReply(item)}
          >
            <Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Render replies */}
      {!isReply && item.replies && item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {item.replies.map(reply => (
            <View key={reply.id}>
              {renderComment({ item: reply, isReply: true, parentId: item.id })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Stack.Screen
        options={{
          title: 'Comments',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={({ item }) => renderComment({ item })}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.commentsListContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      />
      
      {/* Reply to comment bar */}
      {replyingTo && (
        <Animated.View
          style={[
            styles.replyBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              transform: [{ translateY }],
              opacity,
            }
          ]}
        >
          <View style={styles.replyBarContent}>
            <Text style={[styles.replyingToText, { color: colors.textSecondary }]}>
              Replying to <Text style={{ color: colors.text }}>{replyingTo.authorName}</Text>
            </Text>
            <TouchableOpacity onPress={handleCancelReply}>
              <Text style={[styles.cancelReplyText, { color: colors.tint }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      
      {/* Comment input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TextInput
          ref={commentInputRef}
          style={[styles.input, { 
            color: colors.text,
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          }]}
          placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
          placeholderTextColor={colors.placeholder}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: commentText.trim() ? colors.tint : colors.border }
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim()}
        >
          <Send
            size={20}
            color={commentText.trim() ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentsListContent: {
    padding: 16,
    paddingBottom: 80,
  },
  commentContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  replyContainer: {
    marginTop: 8,
    marginLeft: 20,
    marginBottom: 0,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DDD',
  },
  commentMetaContainer: {
    flex: 1,
  },
  authorName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  commentDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  commentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 16,
  },
  likeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  replyButton: {},
  replyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  repliesContainer: {
    marginTop: 8,
  },
  replyBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    borderTopWidth: 1,
    padding: 12,
  },
  replyBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyingToText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  cancelReplyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

type ArticleData = {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
    followers: number;
  };
  publishDate: string;
  readTime: string;
  coverImage: string;
  content: string[];
  tags: string[];
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

// Mock article data
const mockArticles: Record<string, ArticleData> = {
  "1": {
    id: 1,
    title: "The Art of Food Photography: Making Your Dishes Instagram-Worthy",
    author: {
      name: "Jessica Morgan",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      followers: 15600
    },
    publishDate: "May 15, 2023",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800&auto=format&fit=crop",
    content: [
      "Food photography is an art form that combines technical skills with creativity to showcase dishes in their best light. Whether you're a restaurant owner, food blogger, or just someone who loves sharing their culinary creations on social media, mastering the basics of food photography can significantly enhance your visual content.",
      "## Finding the Right Light",
      "Natural light is your best friend when it comes to food photography. Position your dish near a window where soft, diffused light streams in. Avoid direct sunlight, which can create harsh shadows. For the best results, shoot during the golden hours - shortly after sunrise or before sunset - when the light has a warm, flattering quality.",
      "## Composition Matters",
      "Consider the rule of thirds when framing your shot. Position the main elements of your dish at the intersection points of an imaginary grid that divides your frame into thirds, both horizontally and vertically. This creates a more balanced and visually interesting image than simply centering everything.",
      "## Choose the Right Angle",
      "Different dishes look best from different angles. Flat foods like pizzas and pancakes typically photograph well from above (overhead shot), while layered dishes like burgers or cakes often look best from a 45-degree angle or straight on to showcase their structure and layers.",
      "## Styling Your Shot",
      "Pay attention to the details beyond just the food. The right props, backgrounds, and utensils can enhance your photo's story and aesthetic. Include relevant ingredients, appropriate serving ware, and textured surfaces to create depth and context in your images.",
      "## Editing For Impact",
      "A little post-processing can take your food photos from good to great. Adjust brightness, contrast, and saturation to make your food pop, but be careful not to over-edit. The goal is to make the food look appetizing and true to life, not artificially enhanced.",
      "Remember, practice makes perfect. The more you experiment with different techniques and styles, the more you'll develop your unique food photography aesthetic. Happy shooting!",
    ],
    tags: ["Photography", "Food Styling", "Content Creation"],
    likes: 482,
    isLiked: false,
    isSaved: false
  },
  "2": {
    id: 2,
    title: "Seasonal Cooking: Making the Most of Spring Produce",
    author: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      followers: 12300
    },
    publishDate: "April 3, 2023",
    readTime: "7 min read",
    coverImage: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1000&auto=format&fit=crop",
    content: [
      "Cooking with seasonal ingredients isn't just better for the environment – it also ensures you're eating produce at the peak of its flavor and nutritional value. Spring brings a bounty of fresh, vibrant ingredients that can transform your meals after the hearty, often heavy dishes of winter.",
      "## Spring Vegetables to Look For",
      "• Asparagus - The quintessential spring vegetable, asparagus is versatile and nutritious. Try it grilled, roasted, or lightly steamed.",
      "• Peas - Fresh peas are nothing like their frozen counterparts. Sweet and tender, they're perfect in pastas, risottos, or simply sautéed with a little butter and mint.",
      "• Artichokes - While they require some preparation, artichokes reward your efforts with their unique flavor. Steam them whole and serve with lemon butter for dipping.",
      "• Radishes - These peppery gems add crunch and color to salads, but also transform when roasted, becoming surprisingly sweet.",
      "• Ramps - These wild leeks have a short season but intense flavor. Use them anywhere you'd use scallions for a more complex, garlicky taste.",
      "## Simple Spring Recipes",
      "One of the joys of spring cooking is that the ingredients need minimal preparation to shine. Here are a few simple ways to showcase spring produce:",
      "1. **Spring Vegetable Risotto**: Incorporate peas, asparagus, and fresh herbs into a creamy risotto for a dish that celebrates the season.",
      "2. **Radish Toast**: Spread good butter on crusty bread, top with thinly sliced radishes, flaky salt, and fresh herbs for a simple yet sophisticated snack.",
      "3. **Asparagus Frittata**: Mix asparagus with eggs, cheese, and herbs for a quick meal that works for breakfast, lunch, or dinner.",
      "Remember, the beauty of seasonal cooking lies in its simplicity. Let the natural flavors of spring produce take center stage, complementing rather than overwhelming them with other ingredients. Happy spring cooking!",
    ],
    tags: ["Seasonal Cooking", "Spring Recipes", "Fresh Produce"],
    likes: 329,
    isLiked: false,
    isSaved: false
  }
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const articleId = Array.isArray(id) ? id[0] : id;
  const article = mockArticles[articleId] || mockArticles["1"]; // Default to first article if ID not found
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Colors based on theme
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
    yellow: '#FFF84E',
    heart: '#FF6B6B',
  };

  // Handle haptic feedback
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    if (type === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === 'heavy') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (type === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // Render markdown-like text with basic formatting
  const renderText = (text: string) => {
    if (text.startsWith('##')) {
      // It's a heading
      return (
        <Text style={[styles.heading, { color: colors.text }]}>
          {text.replace('##', '').trim()}
        </Text>
      );
    } else if (text.startsWith('•')) {
      // It's a bullet point
      return (
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          {text}
        </Text>
      );
    } else if (text.includes('**')) {
      // It has bold text
      const parts = text.split(/\*\*(.*?)\*\*/g);
      return (
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {parts.map((part, index) => {
            // Even indices are normal text, odd indices are bold
            if (index % 2 === 0) {
              return part;
            } else {
              return <Text key={index} style={styles.bold}>{part}</Text>;
            }
          })}
        </Text>
      );
    } else {
      // Regular paragraph
      return (
        <Text style={[styles.paragraph, { color: colors.text }]}>
          {text}
        </Text>
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: article.coverImage }} style={styles.coverImage} />
        
        {/* Back button */}
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => {
            triggerHaptic('light');
            router.back();
          }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        
        <View style={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}>
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: colors.yellow }]}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {article.title}
          </Text>
          
          {/* Author info */}
          <View style={styles.authorRow}>
            <Image source={{ uri: article.author.avatar }} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>
                {article.author.name}
              </Text>
              <Text style={[styles.articleMeta, { color: colors.textSecondary }]}>
                {article.publishDate} • {article.readTime}
              </Text>
            </View>
          </View>
          
          {/* Action buttons */}
          <View style={[styles.actionRow, { borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                triggerHaptic('medium');
                // Toggle like logic would go here
              }}
            >
              <Heart 
                size={22} 
                color={article.isLiked ? colors.heart : colors.textSecondary} 
                fill={article.isLiked ? colors.heart : 'transparent'} 
              />
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                {article.likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => triggerHaptic('light')}
            >
              <MessageCircle size={22} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                triggerHaptic('medium');
                // Toggle bookmark logic would go here
              }}
            >
              <Bookmark 
                size={22} 
                color={article.isSaved ? colors.tint : colors.textSecondary} 
                fill={article.isSaved ? colors.tint : 'transparent'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => triggerHaptic('light')}
            >
              <Share2 size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {/* Article content */}
          <View style={styles.articleContent}>
            {article.content.map((paragraph, index) => (
              <View key={index} style={styles.contentBlock}>
                {renderText(paragraph)}
              </View>
            ))}
          </View>
          
          {/* Author follow section */}
          <View style={[styles.authorFooter, { backgroundColor: colors.card }]}>
            <View style={styles.authorFooterContent}>
              <Image source={{ uri: article.author.avatar }} style={styles.footerAvatar} />
              <View style={styles.footerInfo}>
                <Text style={[styles.footerName, { color: colors.text }]}>
                  {article.author.name}
                </Text>
                <Text style={[styles.footerFollowers, { color: colors.textSecondary }]}>
                  {article.author.followers.toLocaleString()} followers
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.followButton, { backgroundColor: colors.yellow }]}
                onPress={() => triggerHaptic('medium')}
              >
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
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
    flexGrow: 1,
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  articleMeta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  articleContent: {
    marginBottom: 32,
  },
  contentBlock: {
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginVertical: 16,
  },
  bulletPoint: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    paddingLeft: 8,
    marginBottom: 8,
  },
  bold: {
    fontFamily: 'Inter-Bold',
  },
  authorFooter: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  authorFooterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  footerInfo: {
    flex: 1,
  },
  footerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  footerFollowers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
});

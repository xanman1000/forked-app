import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  FlatList, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent, 
  Animated, 
  Platform,
  useColorScheme,
  StatusBar
} from 'react-native';
import { Heart, Search, MessageCircle, Bookmark, RefreshCw, X, Moon, Sun, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

// Theme context and types
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors | typeof darkColors;
}

// Define colors for each theme
const lightColors = {
  background: '#F9F8F6',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: 'rgba(0, 0, 0, 0.05)',
  searchBg: '#FFFFFF',
  skeletonBg: '#E0E0E0',
  actionButton: '#F9F8F6',
  modalBg: '#F9F8F6',
  heartActive: '#FF6B6B',
  heartBg: '#FFEFEF',
  saveActive: '#B7D6C2',
  commentBg: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.4)',
  tabActive: '#B7D6C2',
  tabInactive: '#F0F0F0',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  border: 'rgba(255, 255, 255, 0.1)',
  searchBg: '#2A2A2A',
  skeletonBg: '#2A2A2A',
  actionButton: '#2A2A2A',
  modalBg: '#1E1E1E',
  heartActive: '#FF6B6B',
  heartBg: 'rgba(255, 107, 107, 0.2)',
  saveActive: '#B7D6C2',
  commentBg: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.7)',
  tabActive: '#B7D6C2',
  tabInactive: '#2A2A2A',
};

// Create theme context
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

// Theme Provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get the device theme preference
  const deviceTheme = useColorScheme() as Theme;
  const [theme, setTheme] = useState<Theme>(deviceTheme || 'light');
  
  // Determine which color set to use
  const colors = theme === 'light' ? lightColors : darkColors;
  
  // Toggle theme function
  const toggleTheme = () => {
    triggerHaptic('medium');
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
const useTheme = () => useContext(ThemeContext);

// Define TypeScript interfaces
interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

// Content type enum
type ContentType = 'recipe' | 'article';

interface RecipeCard {
  id: number;
  type: ContentType;
  title: string;
  author: string;
  image: string;
  images: string[];
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  ingredients: string[];
  instructions: string;
  steps: string[];
}

interface ArticleCard {
  id: number;
  type: ContentType;
  title: string;
  author: string;
  image: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  excerpt: string;
  content: string;
  readTime: string;
}

type ContentCard = RecipeCard | ArticleCard;

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

// Skeleton loading component
const SkeletonCard = () => {
  // Get theme colors
  const { colors } = useTheme();
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  // Start pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim]);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Skeleton image */}
      <Animated.View 
        style={[
          styles.cardImage, 
          { backgroundColor: colors.skeletonBg },
          { opacity: pulseAnim }
        ]} 
      />
      <View style={styles.cardContent}>
        <View style={{ width: '80%' }}>
          {/* Skeleton title */}
          <Animated.View 
            style={[
              styles.skeletonTitle, 
              { backgroundColor: colors.skeletonBg },
              { opacity: pulseAnim }
            ]} 
          />
          {/* Skeleton author */}
          <Animated.View 
            style={[
              styles.skeletonAuthor, 
              { backgroundColor: colors.skeletonBg },
              { opacity: pulseAnim }
            ]} 
          />
        </View>
        {/* Skeleton like button */}
        <Animated.View 
          style={[
            styles.likeButton, 
            { backgroundColor: colors.skeletonBg },
            { opacity: pulseAnim }
          ]} 
        />
      </View>
    </View>
  );
};

// Example Recipe/Article Data (More Realistic)
const initialFeedData: ContentCard[] = [
  {
    id: 1,
    type: 'recipe',
    title: 'creamy tomato pasta',
    author: 'anna jones',
    image: 'https://images.unsplash.com/photo-1565895405137-3ca537389c6f?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565895405137-3ca537389c6f?q=80&w=2000&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1598866591179-a845c488b1a2?q=80&w=2000&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=2000&auto=format&fit=crop'
    ],
    likes: 1250,
    comments: [{ id: 1, author: 'jamie o', text: 'absolutely delicious!', time: '2h' }],
    ingredients: ['pasta', 'canned tomatoes', 'garlic', 'onion', 'cream', 'parmesan'],
    instructions: 'cook pasta. sauté aromatics. add tomatoes and cream. combine and serve with parmesan.',
    steps: ['Boil water and cook pasta according to package directions.', 'While pasta cooks, finely chop onion and garlic.', 'Sauté onion in olive oil until softened.', 'Add garlic and cook for another minute until fragrant.', 'Pour in canned tomatoes, bring to a simmer, and cook for 10 minutes.', 'Stir in heavy cream and parmesan cheese.', 'Drain pasta and add it to the sauce. Toss to coat.', 'Serve immediately, garnished with fresh basil if desired.'],
  },
  {
    id: 2,
    type: 'recipe',
    title: 'spicy chicken tacos',
    author: 'rick bayless',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2000&auto=format&fit=crop',
    ],
    likes: 875,
    comments: [{ id: 1, author: 'chloe m', text: 'perfect weeknight meal!', time: '1d' }],
    ingredients: ['chicken thighs', 'tortillas', 'lime', 'cilantro', 'onion', 'chipotle peppers'],
    instructions: 'marinate chicken. grill or pan-fry. assemble tacos with toppings.',
    steps: ['Cube chicken thighs and marinate with lime juice, chopped chipotle, and spices.', 'Finely dice onion and chop cilantro.', 'Grill or pan-fry chicken until cooked through.', 'Warm tortillas.', 'Assemble tacos with chicken, onion, cilantro, and your favorite salsa or guacamole.'],
  },
  {
    id: 3,
    type: 'recipe',
    title: 'chocolate avocado mousse',
    author: 'minimalist baker',
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=2000&auto=format&fit=crop',
    ],
    likes: 1520,
    comments: [{ id: 1, author: 'david l', text: 'so rich and decadent!', time: '5h' }],
    ingredients: ['avocados', 'cocoa powder', 'maple syrup', 'vanilla extract', 'pinch of salt'],
    instructions: 'blend all ingredients until smooth. chill before serving.',
    steps: ['Combine ripe avocados, cocoa powder, maple syrup, vanilla extract, and salt in a blender or food processor.', 'Blend until completely smooth and creamy, scraping down the sides as needed.', 'Transfer mousse to individual serving dishes or a larger bowl.', 'Chill in the refrigerator for at least 30 minutes before serving.', 'Garnish with berries or shaved chocolate if desired.'],
  },
  // Add more recipe examples as needed
];

export default function FeedScreen() {
  const { theme, toggleTheme, colors } = useTheme(); // Use theme context
  const router = useRouter();

  // State variables
  const [feedData, setFeedData] = useState<ContentCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null);
  const [activeTab, setActiveTab] = useState<'For You' | 'Following'>('For You');
  const [commentInput, setCommentInput] = useState('');
  const [imageIndex, setImageIndex] = useState(0); // For image carousel
  const [searchText, setSearchText] = useState(''); // Added back searchText state

  // Refs for animations and scroll views
  const scrollX = useRef(new Animated.Value(0)).current;
  const imageScrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window'); // Added back width constant

  // Load initial data
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setFeedData(initialFeedData); // Use the new recipe data
      setIsLoading(false);
    }, 1500); // Simulate network delay
  }, []);

  // Refresh function
  const onRefresh = () => {
    triggerHaptic('medium');
    setIsRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      // Prepend new data or shuffle existing data for demo purposes
      const refreshedData = [...initialFeedData].sort(() => Math.random() - 0.5);
      setFeedData(refreshedData);
      setIsRefreshing(false);
    }, 1000);
  };

  // Handle image scroll in carousel
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate the current image index based on scroll position
    if (event.nativeEvent) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / width); // Use width here
      setImageIndex(newIndex);
    }
  };

  // Scroll to specific image
  const scrollToImage = (index: number) => {
    if (imageScrollViewRef.current) {
      imageScrollViewRef.current.scrollTo({ x: index * width, animated: true }); // Use width here
    }
    // Light haptic feedback when changing images
    triggerHaptic('light');
  };

  // Toggle like with haptic feedback
  const toggleLike = (id: number) => {
    setFeedData(feedData.map(item => {
      if (item.id === id) {
        const newLikedState = !item.isLiked;
        triggerHaptic(newLikedState ? 'light' : 'light'); // Simple haptic for like/unlike
        return { ...item, isLiked: newLikedState, likes: newLikedState ? item.likes + 1 : item.likes - 1 };
      }
      return item;
    }));
  };

  // Toggle save with haptic feedback
  const toggleSave = (id: number) => {
    setFeedData(feedData.map(item => {
      if (item.id === id) {
        const newSavedState = !item.isSaved;
        triggerHaptic(newSavedState ? 'medium' : 'light'); // Different haptic for save
        return { ...item, isSaved: newSavedState };
      }
      return item;
    }));
  };

  // Handle adding a comment
  const handleAddComment = () => {
    if (commentInput.trim() && selectedCard) {
      triggerHaptic('success');
      const newComment: Comment = {
        id: Date.now(), // Simple ID generation
        author: 'current_user', // Replace with actual user info
        text: commentInput,
        time: 'now',
      };
      
      // Update the specific card's comments
      const updatedCard = { ...selectedCard, comments: [...selectedCard.comments, newComment] };
      setSelectedCard(updatedCard);
      
      // Update the main feed data as well
      setFeedData(feedData.map(card => card.id === selectedCard.id ? updatedCard : card));
      
      setCommentInput(''); // Clear input
    }
  };

  // Open the details modal
  const handleCardPress = (card: ContentCard) => {
    triggerHaptic('light');
    setSelectedCard(card);
    setModalVisible(true);
    setImageIndex(0); // Reset image index when opening modal
    if (imageScrollViewRef.current) {
      imageScrollViewRef.current.scrollTo({ x: 0, animated: false }); // Reset scroll position too
    }
  };

  // Close the details modal
  const closeModal = () => {
    triggerHaptic('light');
    setModalVisible(false);
    setSelectedCard(null);
  };

  // Change the active feed tab
  const handleTabChange = (tab: 'For You' | 'Following') => {
    triggerHaptic('light');
    setActiveTab(tab);
    // TODO: Add logic to fetch different data based on the tab
  };

  // Filter content based on search and active tab
  const filteredContent = feedData.filter(item => {
    const matchesSearch = searchText ? 
      item.title.toLowerCase().includes(searchText.toLowerCase()) || 
      (item.type === 'recipe' && (item as RecipeCard).ingredients.some(ing => ing.toLowerCase().includes(searchText.toLowerCase()))) ||
      (item.type === 'article' && (item as ArticleCard).excerpt.toLowerCase().includes(searchText.toLowerCase())) ||
      item.author.toLowerCase().includes(searchText.toLowerCase()) 
      : true;
      
    // TODO: Add filtering logic for 'Following' tab
    const matchesTab = activeTab === 'For You' || true; 

    return matchesSearch && matchesTab;
  });

  // Render Recipe Card
  const renderRecipeCard = (card: RecipeCard) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={() => handleCardPress(card)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: card.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
          <Text style={[styles.cardAuthor, { color: colors.textSecondary }]}>by {card.author}</Text>
        </View>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={(e) => {
            e.stopPropagation();
            toggleLike(card.id);
          }}
        >
          <Heart 
            size={20} 
            color={card.isLiked ? colors.heartActive : colors.textSecondary} 
            fill={card.isLiked ? colors.heartActive : 'none'}
          />
          <Text style={[styles.likeCount, { color: colors.textSecondary }]}>{card.likes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render Article Card
  const renderArticleCard = (card: ArticleCard) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={() => handleCardPress(card)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: card.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
          <Text style={[styles.cardAuthor, { color: colors.textSecondary }]}>by {card.author}</Text>
          <View style={styles.articleInfo}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.readTime, { color: colors.textSecondary }]}>{card.readTime}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={(e) => {
            e.stopPropagation();
            toggleLike(card.id);
          }}
        >
          <Heart 
            size={20} 
            color={card.isLiked ? colors.heartActive : colors.textSecondary} 
            fill={card.isLiked ? colors.heartActive : 'none'}
          />
          <Text style={[styles.likeCount, { color: colors.textSecondary }]}>{card.likes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      
      {/* For You/Following Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Following' && styles.activeTab]} 
          onPress={() => handleTabChange('Following')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'Following' ? colors.text : colors.textSecondary }
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'For You' && styles.activeTab]} 
          onPress={() => handleTabChange('For You')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'For You' ? colors.text : colors.textSecondary }
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>
        
        {/* Search Icon */}
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => router.push('/search')}
        >
          <Search size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          // Skeleton loading UI
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          // Actual content
          filteredContent.map((card) => (
            <React.Fragment key={card.id}>
              {card.type === 'recipe' 
                ? renderRecipeCard(card as RecipeCard)
                : renderArticleCard(card as ArticleCard)}
            </React.Fragment>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Wrap the FeedScreen with ThemeProvider
export function FeedScreenWithTheme() {
  return (
    <ThemeProvider>
      <FeedScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#B7D6C2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    position: 'absolute',
    right: 16,
    top: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
    textTransform: 'lowercase',
  },
  cardAuthor: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  likeCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  articleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  readTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  // Skeleton styles
  skeletonTitle: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonAuthor: {
    height: 14,
    borderRadius: 4,
    width: '50%',
  },
});
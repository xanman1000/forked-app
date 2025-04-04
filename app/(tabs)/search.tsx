import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image,
  useColorScheme
} from 'react-native';
import { Stack } from 'expo-router';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type SearchResult = {
  id: number;
  type: 'recipe' | 'article' | 'user';
  title: string;
  image: string;
  subtitle?: string;
}

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'protein recipes', 'vegan dinner', 'quick lunch', 'pasta'
  ]);
  const [popularTags, setPopularTags] = useState<string[]>([
    'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Quick Meals', 
    'Healthy', 'Comfort Food', 'Baking', 'Snacks'
  ]);
  
  // Colors based on theme
  const colors = {
    background: isDark ? '#121212' : '#F9F8F6',
    card: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#333333',
    textSecondary: isDark ? '#AAAAAA' : '#666666',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    tint: '#B7D6C2',
    yellow: '#FFF84E',
  };
  
  // Mock search results - in a real app, this would be an API call
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      // Simulate API call with mock data
      const mockResults: SearchResult[] = [
        {
          id: 1,
          type: 'recipe',
          title: 'Avocado Toast with Poached Eggs',
          image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2880&auto=format&fit=crop',
          subtitle: 'Breakfast • 15 min'
        },
        {
          id: 2,
          type: 'article',
          title: 'The Art of Food Photography',
          image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=800&auto=format&fit=crop',
          subtitle: '5 min read'
        },
        {
          id: 3,
          type: 'user',
          title: 'Emma Wilson',
          image: 'https://randomuser.me/api/portraits/women/44.jpg',
          subtitle: '15k followers'
        },
        {
          id: 4,
          type: 'recipe',
          title: 'Classic Margherita Pizza',
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=3269&auto=format&fit=crop',
          subtitle: 'Dinner • 45 min'
        },
      ];
      
      setResults(mockResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
      ));
    } else {
      setResults([]);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };
  
  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }
  };
  
  const handleResultPress = (item: SearchResult) => {
    // Add to recent searches
    if (!recentSearches.includes(searchQuery.trim()) && searchQuery.trim()) {
      setRecentSearches([searchQuery.trim(), ...recentSearches.slice(0, 4)]);
    }
    
    // Navigate based on result type
    if (item.type === 'recipe') {
      router.push(`/recipe/${item.id}`);
    } else if (item.type === 'article') {
      router.push(`/article/${item.id}` as any);
    } else if (item.type === 'user') {
      router.push(`/profile/${item.id}` as any);
    }
  };
  
  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={[styles.resultItem, { backgroundColor: colors.card }]}
      onPress={() => handleResultPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>{item.title}</Text>
        {item.subtitle && (
          <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      <View style={[styles.resultBadge, { 
        backgroundColor: item.type === 'recipe' ? colors.tint : 
                        item.type === 'article' ? colors.yellow : 
                        isDark ? '#2A2A2A' : '#EFEFEF'
      }]}>
        <Text style={[styles.resultBadgeText, { 
          color: item.type === 'recipe' || item.type === 'article' ? '#000000' : colors.text 
        }]}>
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background,
      paddingTop: insets.top + 10,
    }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>search</Text>
      </View>
      
      <View style={[styles.searchBar, { 
        backgroundColor: isDark ? '#2A2A2A' : '#EFEFEF',
        borderColor: colors.border,
      }]}>
        <SearchIcon size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search recipes, articles, users..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
        />
      ) : (
        <View style={styles.suggestionsContainer}>
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent searches
              </Text>
              <View style={styles.tagContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[styles.tagButton, { borderColor: colors.border }]}
                    onPress={() => handleSearch(search)}
                  >
                    <Text style={[styles.tagText, { color: colors.text }]}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {/* Popular tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Popular searches
            </Text>
            <View style={styles.tagContainer}>
              {popularTags.map((tag, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.tagButton, { borderColor: colors.border }]}
                  onPress={() => handleSearch(tag)}
                >
                  <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 46,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 6,
  },
  suggestionsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  resultBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  ActivityIndicator
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Settings, Edit, Share2, LogOut, User, Heart, MessageCircle, Camera, Bookmark, RefreshCw, Copy, Mail, Link, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.45;

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  
  // Animation values
  const bottomSheetY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
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
  
  // Handle navigation to create recipe
  const navigateToCreateRecipe = () => {
    triggerHaptic('medium');
    router.push('/create');
  };
  
  // Pan responder for bottom sheet drag gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          // Only allow dragging down, not up beyond original position
          bottomSheetY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > BOTTOM_SHEET_HEIGHT / 3) {
          // If dragged down more than 1/3, close the sheet
          closeBottomSheet();
        } else {
          // Otherwise snap back to open position
          Animated.spring(bottomSheetY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  // Fetch profile data when user context is available
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!authLoading) {
      // If auth is done loading and there's still no user, handle appropriately
      // Maybe redirect to login, or show a specific "logged out" state
      setLoadingProfile(false);
      setErrorProfile("User not logged in."); // Or set profileData to null
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    if (!user) return; // Should not happen if called correctly, but safeguard

    setLoadingProfile(true);
    setErrorProfile(null);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) { // 406 = No rows found, which is okay if profile doesn't exist yet
        throw error;
      }

      if (data) {
        setProfileData(data);
      } else {
        // Handle case where profile row doesn't exist yet for the user
        // Maybe prompt to create profile later
        setProfileData(null); // Or set default values
        console.log("No profile found for user, might need creation step.");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      setErrorProfile(error.message || 'Failed to fetch profile.');
      setProfileData(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Show bottom sheet
  const showBottomSheet = () => {
    setBottomSheetVisible(true);
    triggerHaptic('medium');
    
    // Animate bottom sheet up
    Animated.spring(bottomSheetY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
    
    // Fade in backdrop
    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  // Close bottom sheet
  const closeBottomSheet = () => {
    triggerHaptic('light');
    
    // Animate bottom sheet down
    Animated.timing(bottomSheetY, {
      toValue: BOTTOM_SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    // Fade out backdrop
    Animated.timing(backdropOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setBottomSheetVisible(false);
    });
  };
  
  // Handle action selection
  const handleActionSelect = (action: string) => {
    triggerHaptic('success');

    if (action === 'signOut') {
      signOut(); // Call the signOut function from AuthContext
      closeBottomSheet();
    } else {
      setSelectedAction(action);
      // Simulate other actions and close sheet
      setTimeout(() => {
        closeBottomSheet();
        // Reset selected action after a delay
        setTimeout(() => setSelectedAction(null), 300);
      }, 200);
    }
  };

  // Switch between tabs
  const switchTab = (tab: string) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  // Render profile content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'posts':
        return (
          <View style={styles.postsContainer}>
            <Text style={styles.postsEmptyText}>You haven't posted any recipes yet</Text>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={navigateToCreateRecipe}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>Create a Recipe</Text>
            </TouchableOpacity>
          </View>
        );
      case 'replies':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No replies yet</Text>
          </View>
        );
      case 'comments':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No comments yet</Text>
          </View>
        );
      case 'photos':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No photos yet</Text>
          </View>
        );
      case 'likes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No likes yet</Text>
          </View>
        );
      case 'remixes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No remixes yet </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: profileData?.avatar_url || 'https://avatar.vercel.sh/default' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            {loadingProfile ? (
              <ActivityIndicator color="#65A382" />
            ) : errorProfile ? (
              <Text style={styles.errorText}>{errorProfile}</Text>
            ) : profileData ? (
              <>
                <Text style={styles.profileName}>{profileData.username || 'New User'}</Text>
                <Text style={styles.profileUsername}>@{profileData.username || 'username'}</Text>
                <Text style={styles.profileBio}>{profileData.bio || 'No bio yet.'}</Text>
              </>
            ) : (
              <Text style={styles.emptyText}>Profile not found.</Text>
            )}
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>152</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>86</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton]}
            onPress={() => handleActionSelect('edit')}
          >
            <Edit size={16} color="#65A382" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.settingsButton]}
            onPress={showBottomSheet}
          >
            <Settings size={16} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
            onPress={() => switchTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'replies' && styles.activeTab]} 
            onPress={() => switchTab('replies')}
          >
            <Text style={[styles.tabText, activeTab === 'replies' && styles.activeTabText]}>Replies</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'comments' && styles.activeTab]} 
            onPress={() => switchTab('comments')}
          >
            <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]} 
            onPress={() => switchTab('photos')}
          >
            <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]} 
            onPress={() => switchTab('likes')}
          >
            <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>Likes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'remixes' && styles.activeTab]} 
            onPress={() => switchTab('remixes')}
          >
            <Text style={[styles.tabText, activeTab === 'remixes' && styles.activeTabText]}>Remixes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tab content */}
      {renderTabContent()}
      
      {/* Bottom Sheet */}
      {bottomSheetVisible && (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
            onTouchStart={closeBottomSheet}
          />
          
          <Animated.View 
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: bottomSheetY }],
              }
            ]}
          >
            <View style={styles.bottomSheetHeader} {...panResponder.panHandlers}>
              <View style={styles.bottomSheetHandle} />
              <TouchableOpacity
                style={styles.bottomSheetCloseButton}
                onPress={closeBottomSheet}
              >
                <X size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.bottomSheetContent}
              onScroll={() => {}}
            >
              <Text style={styles.bottomSheetTitle}>Profile Actions</Text>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  selectedAction === 'share' && styles.actionButtonSelected
                ]}
                onPress={() => handleActionSelect('share')}
              >
                <View style={styles.actionIcon}>
                  <Share2 size={22} color="#444" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionText}>Share Profile</Text>
                  <Text style={styles.actionSubtext}>Share your profile with friends</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  selectedAction === 'edit' && styles.actionButtonSelected
                ]}
                onPress={() => handleActionSelect('edit')}
              >
                <View style={styles.actionIcon}>
                  <Edit size={22} color="#444" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionText}>Edit Profile</Text>
                  <Text style={styles.actionSubtext}>Update your profile information</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  selectedAction === 'copy' && styles.actionButtonSelected
                ]}
                onPress={() => handleActionSelect('copy')}
              >
                <View style={styles.actionIcon}>
                  <Copy size={22} color="#444" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionText}>Copy Profile Link</Text>
                  <Text style={styles.actionSubtext}>Copy your profile URL to clipboard</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  selectedAction === 'settings' && styles.actionButtonSelected
                ]}
                onPress={() => handleActionSelect('settings')}
              >
                <View style={styles.actionIcon}>
                  <Settings size={22} color="#444" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionText}>Settings</Text>
                  <Text style={styles.actionSubtext}>Manage your account settings</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity 
                style={[
                  styles.actionButton, 
                  styles.logoutButton,
                  selectedAction === 'logout' && styles.actionButtonSelected
                ]}
                onPress={() => handleActionSelect('logout')}
              >
                <View style={styles.actionIcon}>
                  <LogOut size={22} color="#D32F2F" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionText, styles.logoutText]}>Log Out</Text>
                  <Text style={styles.actionSubtext}>Sign out of your account</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  header: {
    padding: 20,
    paddingTop: 80,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  profileUsername: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  profileBio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#EEFAF0',
    flex: 1,
    marginRight: 10,
  },
  settingsButton: {
    backgroundColor: '#F0F0F0',
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#65A382',
    marginLeft: 8,
  },
  tabScroll: {
    backgroundColor: 'white',
    maxHeight: 45,
    marginTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'white',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#65A382',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
  },
  activeTabText: {
    color: '#65A382',
    fontFamily: 'Inter-SemiBold',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  postsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  postsEmptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#B7D6C2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  // Bottom Sheet Styles
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSheetHeader: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    marginTop: 8,
  },
  bottomSheetCloseButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  actionButtonSelected: {
    backgroundColor: '#F5F5F5',
  },
  actionIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 2,
  },
  actionSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutText: {
    color: '#D32F2F',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  signOutButton: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  signOutText: {
    color: '#FF3B30',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
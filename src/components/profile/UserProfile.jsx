import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { userApi, postApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthErrorScreen from '../common/AuthErrorScreen';
import UserProfileSkeleton from '../skeleton/UserProfileSkeleton';
import PostGridSkeleton from '../skeleton/PostGridSkeleton';


const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;

const UserProfile = ({ userId: propUserId, navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get auth state from store
  const loggedInUser = useUserAuthStore(state => state.user);
  const token = useUserAuthStore(state => state.token);
  const isAuthenticated = !!token;
  
  // If no user ID is provided, use the logged-in user's ID
  const userId = propUserId || loggedInUser?.id;
  const isOwnProfile = loggedInUser?.id === userId;
  
  // State variables
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [authError, setAuthError] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    card: isDark ? '#1E1E1E' : '#F5F5F5',
    primary: '#0095F6',
    accent: '#E1306C',
    error: '#FF3B30',
  };

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthError(true);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!isAuthenticated || !userId) {
        console.log("Cannot fetch profile: Not authenticated or missing userId");
        return null;
      }
      
      console.log("Fetching profile for user ID:", userId);
      const profileData = await userApi.getUserProfile(userId);
      console.log("User profile data:", profileData);
      
      if (profileData && profileData.data) {
        setUserProfile(profileData.data);
        return profileData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        setAuthError(true);
      }
      
      return null;
    }
  }, [userId, isAuthenticated]);

  // Fetch user posts with pagination
  const fetchUserPosts = useCallback(async (page = 1, shouldAppend = false) => {
    try {
      if (!isAuthenticated || !userId) {
        console.log("Cannot fetch posts: Not authenticated or missing userId");
        return null;
      }
      
      setIsLoadingMore(page > 1);
      console.log(`Fetching posts for user ID: ${userId}, page: ${page}`);
      const postsData = await postApi.getPostByUserId(userId, page, 9);
      console.log(`User posts (Page ${page}):`, postsData);
      
      // Update pagination state
      if (postsData && postsData.pagination) {
        setHasNextPage(postsData.pagination.hasNextPage);
        setTotalPosts(postsData.pagination.totalPosts || 0);
      }
      
      // Update posts state (either append or replace)
      if (shouldAppend && page > 1 && postsData && postsData.post) {
        setPosts(prev => [...prev, ...postsData.post]);
      } else if (postsData && postsData.post) {
        setPosts(postsData.post);
      } else {
        setPosts([]);
      }
      
      return postsData;
    } catch (error) {
      console.error(`Error fetching user posts (page ${page}):`, error);
      
      // Check if it's an auth error
      if (error.response && error.response.status === 401) {
        setAuthError(true);
      }
      
      return null;
    } finally {
      setIsLoadingMore(false);
    }
  }, [userId, isAuthenticated]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        await fetchUserProfile();
        await fetchUserPosts(1, false);
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchUserProfile, fetchUserPosts, isAuthenticated]);

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    if (!isAuthenticated) return;
    
    setIsRefreshing(true);
    setCurrentPage(1);
    
    try {
      await fetchUserProfile();
      await fetchUserPosts(1, false);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle load more (pagination)
  const handleLoadMore = async () => {
    if (hasNextPage && !isLoadingMore && isAuthenticated) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchUserPosts(nextPage, true);
    }
  };

  // Edit profile handler
  const handleEditProfile = () => {
    console.log("Navigate to edit profile screen");
    if (navigation) {
      navigation.navigate('EditProfile');
    }
  };

  // Navigate to post detail
  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', { postId });
  };

  // Render header (Profile Info)
  const renderHeader = () => {
    if (!userProfile) return null;
    
    // Get gender-based color
    const getGenderColor = () => {
      if (!userProfile.gender) return colors.subtext;
      
      switch(userProfile.gender.toLowerCase()) {
        case 'male':
          return '#3498db'; // Blue for male
        case 'female':
          return '#e84393'; // Pink for female
        case 'other':
          return '#9b59b6'; // Light purple for other
        case 'prefer not to say':
          return '#95a5a6'; // Neutral gray for prefer not to say
        default:
          return colors.subtext; // Default fallback
      }
    };
    
    // Format gender display text
    const formatGenderText = (gender) => {
      if (!gender) return '';
      
      // For "prefer not to say", just show "Private"
      if (gender.toLowerCase() === 'prefer not to say') {
        return 'Private';
      }
      
      // For other genders, capitalize first letter
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    };
    
    return (
      <View style={{ backgroundColor: colors.background }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {userProfile.avatar ? (
              <View style={styles.avatarWrapper}>
                <Image 
                  source={{ uri: userProfile.avatar }} 
                  style={styles.avatar} 
                />
              </View>
            ) : (
              <View style={styles.avatarWrapper}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
                  <Text style={[styles.avatarText, { color: colors.text }]}>
                    {userProfile.username?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {/* User Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statCount, { color: colors.text }]}>{totalPosts}</Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
            </View>
            
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statCount, { color: colors.text }]}>
                {userProfile.followerCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statCount, { color: colors.text }]}>
                {userProfile.followingCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Username and Bio */}
        <View style={styles.bioSection}>
          <View style={styles.usernameRow}>
            <Text style={[styles.username, { color: colors.text }]}>
              {userProfile.username}
            </Text>
            
            {/* Add verification badge next to username */}
            {userProfile.verifiedBadge && (
              <MaterialCommunityIcons 
                name="check-decagram" 
                size={18} 
                color={colors.primary} 
                style={{ marginLeft: 4 }}
              />
            )}
            
            {/* Display gender with color indicator */}
            {userProfile.gender && (
              <View style={[styles.genderIndicator, { backgroundColor: getGenderColor() }]}>
                <Text style={styles.genderText}>
                  {formatGenderText(userProfile.gender)}
                </Text>
              </View>
            )}
          </View>
          
          {userProfile.bio && (
            <Text style={[styles.bio, { color: colors.text }]}>
              {userProfile.bio}
            </Text>
          )}
          
          {/* College Info with Logo */}
          {userProfile.collegeName && (
            <View style={styles.collegeInfo}>
              {userProfile.collegeLogo && userProfile.collegeLogo.length > 0 ? (
                <Image 
                  source={{ uri: userProfile.collegeLogo[0].url }} 
                  style={styles.collegeLogo}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="school-outline" size={16} color={colors.subtext} />
              )}
              <Text style={[styles.collegeText, { color: colors.subtext }]}>
                {userProfile.collegeName}
                {userProfile.collegeLocation ? `, ${userProfile.collegeLocation}` : ''}
              </Text>
            </View>
          )}
        </View>
        
        {/* Action Button (Edit Profile or Follow) */}
        <View style={styles.actionContainer}>
          {isOwnProfile ? (
            <TouchableOpacity 
              style={[styles.editButton, { borderColor: colors.border }]}
              onPress={handleEditProfile}
            >
              <Text style={[styles.editButtonText, { color: colors.text }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.followButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* View Selector (Grid/List) */}
        <View style={[styles.viewSelector, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.viewOption, 
              viewMode === 'grid' && { borderBottomColor: colors.text, borderBottomWidth: 2 }
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons 
              name="grid-outline" 
              size={24} 
              color={viewMode === 'grid' ? colors.text : colors.subtext} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.viewOption, 
              viewMode === 'list' && { borderBottomColor: colors.text, borderBottomWidth: 2 }
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons 
              name="list-outline" 
              size={24} 
              color={viewMode === 'list' ? colors.text : colors.subtext} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render empty state for posts
  const renderEmptyPosts = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={50} color={colors.subtext} />
        <Text style={[styles.emptyText, { color: colors.text }]}>No Posts Yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
          When posts are added, they'll appear here.
        </Text>
      </View>
    );
  };

  // Render footer for loading more
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // Render grid item
  const renderGridItem = ({ item }) => {
    const hasMedia = item.media && item.media.length > 0;
    const mediaUrl = hasMedia ? item.media[0].url : null;
    const hasMultipleMedia = item.media && item.media.length > 1;
    
    return (
      <TouchableOpacity 
        style={styles.gridItem}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.8}
      >
        {mediaUrl ? (
          <Image 
            source={{ uri: mediaUrl }} 
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.textOnlyPost, { backgroundColor: colors.card }]}>
            <Text 
              style={[styles.textOnlyContent, { color: colors.text }]} 
              numberOfLines={4}
            >
              {item.content}
            </Text>
          </View>
        )}
        
        {hasMultipleMedia && (
          <View style={styles.multipleIndicator}>
            <Ionicons name="layers" size={14} color="#FFFFFF" />
          </View>
        )}
        
        {item.mediaType === 'video' && (
          <View style={styles.videoIndicator}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render list item
  const renderListItem = ({ item }) => {
    const hasMedia = item.media && item.media.length > 0;
    const mediaUrl = hasMedia ? item.media[0].url : null;
    
    return (
      <TouchableOpacity 
        style={[styles.listItem, { backgroundColor: colors.card }]}
        onPress={() => handlePostPress(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.listItemHeader}>
          <Text style={[styles.listItemDate, { color: colors.subtext }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        {item.content && (
          <Text 
            style={[styles.listItemContent, { color: colors.text }]} 
            numberOfLines={hasMedia ? 3 : 10}
          >
            {item.content}
          </Text>
        )}
        
        {hasMedia && (
          <Image 
            source={{ uri: mediaUrl }} 
            style={styles.listItemMedia}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.listItemFooter}>
          <View style={styles.listItemStat}>
            <Ionicons name="heart-outline" size={16} color={colors.subtext} />
            <Text style={[styles.listItemStatText, { color: colors.subtext }]}>
              {item.likesCount || 0}
            </Text>
          </View>
          
          <View style={styles.listItemStat}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.subtext} />
            <Text style={[styles.listItemStatText, { color: colors.subtext }]}>
              {item.commentsCount || 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Show login prompt
  if (authError) {
    return (
      <AuthErrorScreen 
        navigation={navigation} 
        errorType="auth"
        onLogin={() => {
          console.log("User is navigating to login from profile");
        }}
      />
    );
  }

  // Show loading indicator
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <UserProfileSkeleton />
        <PostGridSkeleton count={9} />
      </View>
    );
  }

  // Show not found message if profile not loaded
  if (!userProfile && !isLoading) {
    return (
      <AuthErrorScreen 
        navigation={navigation} 
        errorType="profile"
        onLogin={() => {
          console.log("User is navigating to login from not found profile");
        }}
      />
    );
  }

  // Main render - use FlatList with header instead of ScrollView
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={viewMode === 'grid' ? posts : posts}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 3 : 1}
        key={viewMode === 'grid' ? 'grid' : 'list'} // Force remount when view mode changes
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyPosts}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={
          viewMode === 'list' ? styles.listContainer : null
        }
        initialNumToRender={viewMode === 'grid' ? 9 : 5}
        maxToRenderPerBatch={viewMode === 'grid' ? 9 : 5}
        windowSize={viewMode === 'grid' ? 9 : 7}
        removeClippedSubviews={true}
      />
    </View>
  );
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return 'just now';
  }
  
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}m ago`;
  }
  
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h ago`;
  }
  
  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d ago`;
  }
  
  // Otherwise, show the date
  return date.toLocaleDateString();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatarWrapper: {
    position: 'relative',
    width: 86,
    height: 86,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationBadgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  collegeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  collegeLogo: {
    width: 22,
    height: 22,
    marginRight: 6,
    borderRadius: 4,
  },
  collegeText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '400',
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  editButtonText: {
    fontWeight: '500',
    fontSize: 15,
  },
  followButton: {
    borderRadius: 4,
    paddingVertical: 7,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  viewSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 1,
  },
  viewOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  
  // Grid styles
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    position: 'relative',
    margin: 0.5,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  textOnlyPost: {
    width: '100%',
    height: '100%',
    padding: 8,
    justifyContent: 'center',
  },
  textOnlyContent: {
    fontSize: 12,
  },
  multipleIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 4,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // List styles
  listContainer: {
    paddingHorizontal: 8,
  },
  listItem: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  listItemDate: {
    fontSize: 12,
  },
  listItemContent: {
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  listItemMedia: {
    width: '100%',
    height: 240,
  },
  listItemFooter: {
    flexDirection: 'row',
    padding: 12,
  },
  listItemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemStatText: {
    marginLeft: 4,
    fontSize: 12,
  },
  
  // Loading and empty states
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  genderIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default UserProfile;
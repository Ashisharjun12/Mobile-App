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
} from 'react-native';
import { userApi, postApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';
import { useFollowStore } from '../../store/follow-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PostGrid from './PostGrid';
import UserProfileSkeleton from '../skeleton/UserProfileSkeleton';
import FollowCard from '../follow/FollowCard';

const { width } = Dimensions.get('window');

const UserProfile = ({ userId, navigation, isVisitingProfile = false }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get current logged-in user
  const currentUser = useUserAuthStore(state => state.user);
  
  // Get follow state from store
  const toggleFollow = useFollowStore(state => state.toggleFollow);
  const isFollowing = useFollowStore(state => state.following[userId] || false);

  // Determine if this is the current user's profile
  const isOwnProfile = currentUser?.id === userId;
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    primary: '#0095F6',
    highlight: isDark ? '#FFFFFF' : '#000000',
    card: isDark ? '#1E1E1E' : '#F5F5F5',
  };
  
  // State management
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!userId) return null;
      
      console.log(`Fetching profile for user ID: ${userId}`);
      const response = await userApi.getUserProfile(userId);
      
      if (response && response.data) {
        setUserProfile(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, [userId]);
  
  // Fetch user posts
  const fetchUserPosts = useCallback(async (page = 1, shouldAppend = false) => {
    try {
      if (!userId) return;
      
      setIsLoadingMore(page > 1);
      console.log(`Fetching posts for user ID: ${userId}, page: ${page}`);
      
      const response = await postApi.getPostByUserId(userId, page, 9);
      
      // Update pagination info
      if (response && response.pagination) {
        setHasNextPage(response.pagination.hasNextPage);
        setTotalPosts(response.pagination.totalPosts || 0);
        setCurrentPage(page);
      }
      
      // Update posts
      if (response) {
        const postsData = response.post || [];
        
        if (shouldAppend && page > 1) {
          setPosts(prev => [...prev, ...postsData]);
        } else {
          setPosts(postsData);
        }
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [userId]);
  
  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchUserProfile();
        await fetchUserPosts(1, false);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId, fetchUserProfile, fetchUserPosts]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserProfile();
      await fetchUserPosts(1, false);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle loading more posts
  const handleLoadMore = async () => {
    if (hasNextPage && !isLoadingMore) {
      const nextPage = currentPage + 1;
      await fetchUserPosts(nextPage, true);
    }
  };
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      await toggleFollow(userId);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };
  
  // Navigation handlers
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };
  
  const handleFollowersPress = () => {
    navigation.navigate('Followers', { userId });
  };
  
  const handleFollowingPress = () => {
    navigation.navigate('Following', { userId });
  };
  
  const handleMessagePress = () => {
    navigation.navigate('Messages', { recipientId: userId });
  };
  
  // Show loading state
  if (isLoading) {
    return <UserProfileSkeleton />;
  }
  
  // Show error/not found state
  if (!userProfile && !isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="person-outline" size={60} color={colors.subtext} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            User not found
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Use the common FollowCard */}
      <FollowCard
        userProfile={userProfile}
        navigation={navigation}
        totalPosts={totalPosts}
        onEditPress={handleEditProfile}
        onFollowersPress={handleFollowersPress}
        onFollowingPress={handleFollowingPress}
        onMessagePress={handleMessagePress}
      />
      
      {/* View Selector */}
      <View style={[styles.viewSelector, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.viewOption, 
            viewMode === 'grid' && [
              styles.activeViewOption,
              { borderBottomColor: colors.text }
            ]
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
            viewMode === 'list' && [
              styles.activeViewOption,
              { borderBottomColor: colors.text }
            ]
          ]}
          onPress={() => setViewMode('list')}
        >
          <Feather 
            name="list" 
            size={24} 
            color={viewMode === 'list' ? colors.text : colors.subtext} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Posts Grid/List */}
      <PostGrid
        posts={posts}
        viewMode={viewMode}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        userId={userId}
        isLoading={isLoading}
        navigation={navigation}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        isVisitingProfile={isVisitingProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  viewOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeViewOption: {
    borderBottomWidth: 2,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
});

export default UserProfile;
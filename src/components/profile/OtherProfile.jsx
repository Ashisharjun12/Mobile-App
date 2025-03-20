import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { userApi, postApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';
import { useFollowStore } from '../../store/follow-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PostGrid from './PostGrid';
import UserProfileSkeleton from '../skeleton/UserProfileSkeleton';
import OtherProfileActionModel from './OtherProfileActionModel';

const OtherProfile = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get params
  const { userId, username } = route.params || {};
  
  // Get current logged-in user
  const currentUser = useUserAuthStore(state => state.user);
  
  // Get follow store functions
  const toggleFollow = useFollowStore(state => state.toggleFollow);
  const isFollowing = useFollowStore(state => state.following[userId] || false);
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    primary: '#0095F6',
    highlight: isDark ? '#FFFFFF' : '#000000',
  };
  
  // State management
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!userId) return null;
      
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
      
      const response = await postApi.getPostByUserId(userId, page, 9);
      
      if (response && response.pagination) {
        setHasNextPage(response.pagination.hasNextPage);
        setTotalPosts(response.pagination.totalPosts || 0);
        setCurrentPage(page);
      }
      
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
    
    if (userId) {
      loadData();
    }
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
  const handleBackPress = () => {
    navigation.goBack();
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
  
  const handleMenuPress = () => {
    setIsActionModalVisible(true);
  };
  
  // Handle blocking the user
  const handleBlockUser = () => {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${userProfile?.username}? They won't be able to see your posts or contact you.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Block", 
          style: "destructive",
          onPress: () => {
            // Implement block logic here
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  // Handle reporting the user
  const handleReportUser = () => {
    navigation.navigate('ReportUser', { userId, username: userProfile?.username });
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {username || 'Profile'}
          </Text>
          <View style={styles.headerRight} />
        </View>
        <UserProfileSkeleton />
      </SafeAreaView>
    );
  }
  
  if (!userProfile && !isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="person-outline" size={60} color={colors.subtext} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>
            User not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {userProfile?.username || username || 'Profile'}
        </Text>
        <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userProfile?.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
                <Text style={[styles.avatarText, { color: colors.highlight }]}>
                  {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statCount, { color: colors.text }]}>
                {totalPosts || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={[styles.statCount, { color: colors.text }]}>
                {userProfile?.followerCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Followers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={[styles.statCount, { color: colors.text }]}>
                {userProfile?.followingCount || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bio Section */}
        <View style={styles.bioSection}>
          <View style={styles.usernameRow}>
            <Text style={[styles.username, { color: colors.text }]}>
              {userProfile?.username}
            </Text>
            {userProfile?.verifiedBadge && (
              <MaterialCommunityIcons 
                name="check-decagram" 
                size={18} 
                color={colors.primary} 
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          {userProfile?.bio && (
            <Text style={[styles.bio, { color: colors.text }]}>{userProfile.bio}</Text>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[
                styles.followButton, 
                { 
                  backgroundColor: isFollowing ? 'transparent' : colors.primary,
                  borderWidth: isFollowing ? 1 : 0,
                  borderColor: colors.border
                }
              ]}
              onPress={handleFollowToggle}
            >
              <Text 
                style={[
                  styles.followButtonText, 
                  { color: isFollowing ? colors.text : '#FFFFFF' }
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.messageButton, { borderColor: colors.border }]}
              onPress={handleMessagePress}
            >
              <Text style={[styles.messageButtonText, { color: colors.text }]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Posts Grid */}
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
            <Ionicons 
              name="list" 
              size={24} 
              color={viewMode === 'list' ? colors.text : colors.subtext} 
            />
          </TouchableOpacity>
        </View>
        
        <PostGrid
          posts={posts}
          viewMode={viewMode}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          userId={userId}
          isLoading={false}
          navigation={navigation}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
        />
      </View>
      
      <OtherProfileActionModel
        visible={isActionModalVisible}
        onClose={() => setIsActionModalVisible(false)}
        username={userProfile?.username}
        userId={userId}
        onBlock={handleBlockUser}
        onReport={handleReportUser}
        navigation={navigation}
        userProfile={userProfile}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  avatarContainer: {
    marginRight: 20,
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
  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
  },
  followButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8,
    justifyContent: 'center',
    height: 36,
  },
  followButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  messageButtonText: {
    fontWeight: '500',
    fontSize: 15,
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

export default OtherProfile; 
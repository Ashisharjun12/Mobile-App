import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
  Share
} from 'react-native';
import { postApi, userApi } from '../../../api/api';
import { useUserAuthStore } from '../../../store/auth-store';
import PostCard from '../common/PostCard';
import PostSkeleton from '../../skeleton/PostSkeleton';
import ActionModel from '../common/ActionModel';

const AllPost = ({ navigation, filterType = 'all' }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    highlightBlue: '#0095F6',
  };
  
  // State variables
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  
  // Action modal states
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Get current user from store
  const currentUser = useUserAuthStore(state => state.user);
  
  // Fetch user profile data for a post author
  const fetchUserProfile = async (authorId) => {
    try {
      // Skip if we already have this user's profile
      if (userProfiles[authorId]) return;
      
      console.log(`Fetching profile for author ID: ${authorId}`);
      const response = await userApi.getUserProfile(authorId);
      
      if (response && response.data) {
        setUserProfiles(prev => ({
          ...prev,
          [authorId]: response.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching profile for author ${authorId}:`, error);
    }
  };
  
  // Fetch profiles for all post authors
  const fetchAllProfiles = async (postsArray) => {
    const authorIds = [...new Set(postsArray.map(post => post.authorId))];
    
    const fetchPromises = authorIds.map(authorId => {
      // Only fetch if we don't already have this profile
      if (!userProfiles[authorId]) {
        return fetchUserProfile(authorId);
      }
      return Promise.resolve();
    });
    
    await Promise.all(fetchPromises);
  };
  
  // Function to fetch posts
  const fetchPosts = async (page = 1, shouldRefresh = false) => {
    try {
      if (shouldRefresh) setRefreshing(true);
      if (page > 1) setLoadingMore(true);
      
      let response;
      if (filterType === 'college') {
        // Fetch posts from same college
        response = await postApi.getAllPostFromSameCollege(page, 12);
        console.log('Fetched college posts:', response);
      } else {
        // Fetch all posts
        response = await postApi.getAllPosts(page, 12);
        console.log('Fetched all posts:', response);
      }
      
      const newPosts = response.posts || [];
      
      // Update posts based on whether we're refreshing, loading more, or initial load
      if (shouldRefresh || page === 1) {
        setPosts(newPosts);
        // Fetch user profiles for all posts
        await fetchAllProfiles(newPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        // Fetch user profiles for new posts only
        await fetchAllProfiles(newPosts);
      }
      
      // Initialize like states for new posts
      const initialLikedState = {};
      newPosts.forEach(post => {
        initialLikedState[post.id] = false;
      });
      setLikedPosts(prev => ({...prev, ...initialLikedState}));
      
      // Update pagination info
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          hasNextPage: response.pagination.hasNextPage
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);
  
  // Fetch new posts when filter type changes
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false
    });
    fetchPosts(1, true);
  }, [filterType]);
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchPosts(1, true);
  }, [filterType]);
  
  // Handle loading more posts
  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loadingMore) {
      fetchPosts(pagination.currentPage + 1);
    }
  };
  
  // Handle post actions
  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Here you would call the like API in a real implementation
    console.log(`Post ${postId} ${likedPosts[postId] ? 'unliked' : 'liked'}`);
  };
  
  const handleComment = (postId) => {
    // Navigate to comments screen or open comments modal
    console.log(`Comment on post ${postId}`);
  };
  
  const handleShare = (postId) => {
    // Share the post
    console.log(`Share post ${postId}`);
  };
  
  // Handle navigation to post details
  const handlePostPress = (post) => {
    navigation.navigate('UserPost', { 
      postId: post.id, 
      authorId: post.authorId 
    });
  };
  
  // Handle navigation to user profile
  const handleProfilePress = (authorId) => {
    navigation.navigate('UserProfile', { 
      userId: authorId
      });
  };
  
  // Function to open action modal
  const openActionModal = (post) => {
    setSelectedPost(post);
    setActionModalVisible(true);
  };
  
  // Action modal handlers
  const handleEditPost = () => {
    console.log("Edit post:", selectedPost?.id);
    // Navigate to edit post screen
  };
  
  const handleDeletePost = async () => {
    console.log("Delete post:", selectedPost?.id);
    // Delete post logic
  };
  
  const handleSharePost = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this post!',
        url: `https://yourapp.com/post/${selectedPost?.id}`,
      });
      
      if (result.action === Share.sharedAction) {
        console.log("Shared successfully");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  const handleSavePost = () => {
    console.log("Save post:", selectedPost?.id);
    // Save post logic
  };
  
  const handleCopyLink = () => {
    console.log("Copy link for post:", selectedPost?.id);
    // Copy link logic
  };
  
  const handleBlockUser = () => {
    if (!selectedPost) return;
    console.log("Block user:", selectedPost.authorId);
    // Block user logic
  };
  
  const handleReportPost = () => {
    console.log("Report post:", selectedPost?.id);
    // Report post logic
  };
  
  const handleNotInterested = () => {
    console.log("Not interested in post:", selectedPost?.id);
    // Not interested logic
  };
  
  // Render footer for FlatList
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.highlightBlue} />
      </View>
    );
  };
  
  // Render empty component
  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {filterType === 'college' 
            ? 'No posts from your college yet. Pull down to refresh.'
            : 'No posts available. Pull down to refresh.'}
        </Text>
      </View>
    );
  };
  
  // Render loading skeleton
  if (loading) {
  return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <PostSkeleton />
       
    </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            userProfile={userProfiles[item.authorId]}
            onPostPress={() => handlePostPress(item)}
            onProfilePress={() => handleProfilePress(item.authorId, item.authorUsername)}
            onLike={() => handleLike(item.id)}
            onComment={() => handleComment(item.id)}
            onShare={() => handleShare(item.id)}
            onMorePress={() => openActionModal(item)}
            liked={likedPosts[item.id]}
            isOwnPost={currentUser?.id === item.authorId}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#FFFFFF' : '#000000'}
            colors={[colors.highlightBlue]}
            progressBackgroundColor={isDark ? '#2A2A2A' : '#F0F0F0'}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 && styles.emptyListContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
      
      {/* Action Modal */}
      <ActionModel
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        isOwnPost={selectedPost ? currentUser?.id === selectedPost.authorId : false}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onShare={handleSharePost}
        onSave={handleSavePost}
        onCopyLink={handleCopyLink}
        onBlock={handleBlockUser}
        onReport={handleReportPost}
        onNotInterested={handleNotInterested}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  }
});

export default AllPost;
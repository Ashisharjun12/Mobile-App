import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  FlatList,
  Dimensions,
  Share,
  Animated
} from 'react-native';
import { postApi, userApi } from '../../../api/api';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserAuthStore } from '../../../store/auth-store';
import Navigate from '../../common/Navigate';
import PostCard from '../common/PostCard';
import ActionModel from '../common/ActionModel';
import PostSkeleton from '../../../components/skeleton/PostSkeleton';

const { width } = Dimensions.get('window');

const UserPost = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    highlightBlue: '#0095F6',
    heart: '#E1306C',
    separator: isDark ? '#2A2A2A' : '#EEEEEE',
  };
  
  const route = useRoute();
  
  // Current user
  const currentUser = useUserAuthStore(state => state.user);
  
  // Extract postId and authorId from route params
  const { postId, authorId } = route.params || {};
  
  // State variables
  const [userProfile, setUserProfile] = useState(null);
  const [focusedPost, setFocusedPost] = useState(null);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI interaction states
  const [likedPosts, setLikedPosts] = useState({});
  const [activeCarouselIndex, setActiveCarouselIndex] = useState({});
  
  // Add new state for action modal
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Determine if the post is owned by the logged-in user
  const isOwnPost = selectedPost ? selectedPost.authorId === currentUser?.id : false;
  
  // Function to fetch data
  const fetchData = async () => {
    try {
      // 1. Fetch user profile using authorId
      if (authorId) {
        const userResponse = await userApi.getUserProfile(authorId);
        console.log("User profile data:", userResponse);
        if (userResponse && userResponse.data) {
          setUserProfile(userResponse.data);
        }
      }
      
      // 2. Fetch all posts by the author
      if (authorId) {
        const postsResponse = await postApi.getPostByAuthorId(authorId);
        console.log("All posts by author:", postsResponse);
        
        let posts = [];
        if (postsResponse && postsResponse.posts) {
          posts = postsResponse.posts;
        } else if (postsResponse && postsResponse.post) {
          posts = postsResponse.post;
        }
        
        // Find the focused post if postId is provided
        if (postId && posts.length > 0) {
          const post = posts.find(p => p.id === postId);
          if (post) {
            setFocusedPost(post);
            
            // Initialize like state for this post
            setLikedPosts(prev => ({
              ...prev,
              [post.id]: false
            }));
            
            // Remove it from the other posts to avoid duplication
            posts = posts.filter(p => p.id !== postId);
          }
        }
        
        // Initialize like states for all posts
        const initialLikedState = {};
        const initialCarouselState = {};
        posts.forEach(post => {
          initialLikedState[post.id] = false;
          initialCarouselState[post.id] = 0;
        });
        setLikedPosts(prev => ({...prev, ...initialLikedState}));
        setActiveCarouselIndex(initialCarouselState);
        
        setAuthorPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [authorId, postId]);
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [postId, authorId]);
  
  // Handle like button press
  const handleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Here you would call the like API in a real implementation
    console.log(`Post ${postId} ${likedPosts[postId] ? 'unliked' : 'liked'}`);
  };
  
  // Handle comment press
  const handleComment = (postId) => {
    console.log(`Comment on post ${postId}`);
  };
  
  // Handle share press
  const handleShare = (postId) => {
    console.log(`Share post ${postId}`);
  };
  
  // Handle profile press
  const handleProfilePress = () => {
    if (!userProfile) return;
    navigation.navigate('UserProfile', { userId: userProfile.id });
  };
  
  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return 'just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 604800)}w`;
    
    const options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString(undefined, options);
  };
  
  // Render text with hashtags
  const renderTextWithHashtags = (text) => {
    if (!text) return null;
    
    const words = text.split(' ');
    
    return (
      <Text style={[styles.postContent, {color: colors.text}]}>
        {words.map((word, index) => {
          if (word.startsWith('#')) {
            return (
              <Text 
                key={index} 
                style={[styles.hashtag, {color: colors.highlightBlue}]}
              >
                {word}{' '}
              </Text>
            );
          }
          return <Text key={index}>{word}{' '}</Text>;
        })}
      </Text>
    );
  };
  
  // Function to open action modal
  const openActionModal = (post) => {
    setSelectedPost(post);
    setActionModalVisible(true);
  };
  
  // Handler functions for action options
  const handleEditPost = () => {
    console.log("Edit post:", selectedPost?.id);
    // Navigate to edit post screen
    // navigation.navigate('EditPost', { postId: selectedPost?.id });
  };
  
  const handleDeletePost = async () => {
    console.log("Delete post:", selectedPost?.id);
    // Implement delete post logic here
    // await postApi.deletePost(selectedPost?.id);
    // Then refresh the posts
  };
  
  const handleSharePost = async () => {
    // Use the Share API from React Native
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
    // Implement save post logic
  };
  
  const handleCopyLink = () => {
    console.log("Copy link for post:", selectedPost?.id);
    // Implement copy to clipboard logic
    // Clipboard.setString(`https://yourapp.com/post/${selectedPost?.id}`);
  };
  
  const handleBlockUser = () => {
    console.log("Block user:", userProfile?.id);
    // Implement block user logic
  };
  
  const handleReportPost = () => {
    console.log("Report post:", selectedPost?.id);
    // Navigate to report screen
    // navigation.navigate('ReportPost', { postId: selectedPost?.id });
  };
  
  const handleNotInterested = () => {
    console.log("Not interested in post:", selectedPost?.id);
    // Implement not interested logic
  };
  
  // Render a post
  const renderPost = (post) => {
    if (!post) return null;
    
    const hasMedia = post.media && post.media.length > 0;
    
    return (
      <View style={styles.postContainer}>
        {/* Post header */}
        <View style={styles.postHeader}>
          <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress}>
            {userProfile?.avatar ? (
              <Image source={{uri: userProfile.avatar}} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatarPlaceholder, {backgroundColor: colors.border}]}>
                <Text style={styles.avatarText}>
                  {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            
            <View style={styles.userMeta}>
              <View style={styles.usernameRow}>
                <Text style={[styles.username, {color: colors.text}]}>
                  {userProfile?.username || 'username'}
                </Text>
                
                {userProfile?.verifiedBadge && (
                  <MaterialCommunityIcons 
                    name="check-decagram" 
                    size={14} 
                    color={colors.highlightBlue} 
                    style={styles.verifiedBadge} 
                  />
                )}
              </View>
              
              <Text style={[styles.timeAgo, {color: colors.subtext}]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => openActionModal(post)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Post content */}
        <View style={styles.postContent}>
          {renderTextWithHashtags(post.content)}
        </View>
        
        {/* Media carousel */}
        {hasMedia && (
          <View style={styles.mediaContainer}>
            <FlatList
              data={post.media}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const contentOffset = e.nativeEvent.contentOffset;
                const viewSize = e.nativeEvent.layoutMeasurement;
                const pageNum = Math.floor(contentOffset.x / viewSize.width);
                setActiveCarouselIndex(prev => ({
                  ...prev,
                  [post.id]: pageNum
                }));
              }}
              renderItem={({ item }) => (
                <Image 
                  source={{ uri: item.url }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              )}
              keyExtractor={(item, index) => `media-${post.id}-${index}`}
            />
            
            {/* Pagination dots */}
            {post.media.length > 1 && (
              <View style={styles.pagination}>
                {post.media.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.paginationDot,
                      { 
                        backgroundColor: index === (activeCarouselIndex[post.id] || 0) 
                          ? colors.highlightBlue 
                          : 'rgba(255, 255, 255, 0.6)'
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.actionBar}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(post.id)}
            >
              <Ionicons 
                name={likedPosts[post.id] ? "heart" : "heart-outline"} 
                size={22} 
                color={likedPosts[post.id] ? colors.heart : colors.text} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleComment(post.id)}
            >
              <Ionicons name="chatbubble-outline" size={21} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(post.id)}
            >
              <Ionicons name="paper-plane-outline" size={21} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={21} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Like count and comments summary */}
        <View style={styles.postMeta}>
          <Text style={[styles.likesCount, {color: colors.text}]}>
            {(post.likesCount || 0) + (likedPosts[post.id] ? 1 : 0)} likes
          </Text>
          
          {post.commentsCount > 0 && (
            <TouchableOpacity 
              onPress={() => handleComment(post.id)}
              style={styles.viewComments}
            >
              <Text style={[styles.commentsText, {color: colors.subtext}]}>
                View all {post.commentsCount} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  
  // Show skeleton loading state
  if (loading) {
    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <Navigate title="Posts" />
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <PostSkeleton />
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <Navigate title="Posts" />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#FFFFFF' : '#000000'}
            colors={[colors.highlightBlue]}
            progressBackgroundColor={isDark ? '#2A2A2A' : '#F0F0F0'}
          />
        }
      >
        {/* Focused post (if any) */}
        {focusedPost && (
          <PostCard
            post={focusedPost}
            userProfile={userProfile}
            onPostPress={() => {}}
            onProfilePress={() => handleProfilePress(focusedPost.authorId)}
            onLike={() => handleLike(focusedPost.id)}
            onComment={() => handleComment(focusedPost.id)}
            onShare={() => handleShare(focusedPost.id)}
            onMorePress={() => openActionModal(focusedPost)}
            liked={likedPosts[focusedPost.id]}
            isOwnPost={currentUser?.id === focusedPost.authorId}
            isFocused={true}
          />
        )}
        
        {focusedPost && authorPosts.length > 0 && (
          <View style={[styles.postSeparator, {backgroundColor: colors.separator}]} />
        )}
        
        {/* Other posts by the author */}
        {authorPosts.map((post, index) => (
          <View key={post.id}>
            <PostCard
              post={post}
              userProfile={userProfile}
              onPostPress={() => {}}
              onProfilePress={() => handleProfilePress(post.authorId)}
              onLike={() => handleLike(post.id)}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post.id)}
              onMorePress={() => openActionModal(post)}
              liked={likedPosts[post.id]}
              isOwnPost={currentUser?.id === post.authorId}
            />
            {index < authorPosts.length - 1 && (
              <View style={[styles.postSeparator, {backgroundColor: colors.separator}]} />
            )}
          </View>
        ))}
        
        {/* Empty state if no posts */}
        {!focusedPost && authorPosts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={50} color={colors.subtext} />
            <Text style={[styles.emptyStateText, {color: colors.text}]}>No posts to show</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Action Modal */}
      <ActionModel
        visible={actionModalVisible}
        onClose={() => setActionModalVisible(false)}
        isOwnPost={isOwnPost}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  postContainer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userMeta: {
    marginLeft: 10,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: '600',
    fontSize: 15,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 20,
  },
  hashtag: {
    fontWeight: '500',
  },
  mediaContainer: {
    width: width,
    height: width,
    marginBottom: 12,
    position: 'relative',
  },
  mediaImage: {
    width: width,
    height: width,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 18,
    padding: 2,
  },
  postMeta: {
    paddingHorizontal: 16,
  },
  likesCount: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 2,
  },
  viewComments: {
    marginTop: 2,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 14,
  },
  threadConnector: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  threadLine: {
    width: 1.5,
    height: 24,
  },
  threadDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
  },
  postSeparator: {
    height: 1,
    marginVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
  },
  skeletonContainer: {
    flex: 1,
    paddingTop: 16,
  },
});

export default UserPost;
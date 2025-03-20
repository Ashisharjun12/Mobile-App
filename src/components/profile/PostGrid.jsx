import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  useColorScheme
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PostGridSkeleton from '../skeleton/PostGridSkeleton';

const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;

const PostGrid = ({ 
  posts = [], 
  viewMode = 'grid',
  onLoadMore,
  isLoadingMore = false,
  userId,
  isLoading = false,
  navigation,
  onRefresh,
  refreshing = false,
  isVisitingProfile = false
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    card: isDark ? '#1E1E1E' : '#F5F5F5',
    primary: '#0095F6',
  };

  // Handle post tap - 
  //  to post details screen
  const handlePostPress = (post) => {
    if (!post || !post.id) return;
    
    const authorId = post.authorId || userId;
    
    if (!authorId) {
      console.error("No author ID available for post:", post.id);
      return;
    }
    
    console.log(`Navigating to post ${post.id} by author ${authorId}`);
    
    // Navigate to the post detail view
    navigation.navigate('UserPosts', {
      postId: post.id,
      authorId: authorId
    });
  };

  // Show loading skeleton
  if (isLoading) {
    return <PostGridSkeleton count={9} />;
  }

  // Render empty state (no posts)
  if (!posts || posts.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="images-outline" size={60} color={colors.subtext} />
        <Text style={[styles.emptyText, { color: colors.text }]}>No Posts Yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
          When posts are added, they'll appear here.
        </Text>
      </View>
    );
  }

  // Grid view (3x3 grid of posts)
  if (viewMode === 'grid') {
    return (
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => {
          const hasMedia = item.media && item.media.length > 0;
          const mediaUrl = hasMedia ? item.media[0].url : null;
          const hasMultipleMedia = item.media && item.media.length > 1;
          
          return (
            <TouchableOpacity 
              style={styles.gridItem}
              onPress={() => handlePostPress(item)}
              activeOpacity={0.8}
            >
              {mediaUrl ? (
                // Post with media
                <Image 
                  source={{ uri: mediaUrl }} 
                  style={styles.gridImage}
                  resizeMode="cover"
                />
              ) : (
                // Text-only post
                <View style={[styles.textOnlyPost, { backgroundColor: colors.card }]}>
                  <Text 
                    style={[styles.textOnlyContent, { color: colors.text }]} 
                    numberOfLines={4}
                  >
                    {item.content}
                  </Text>
                </View>
              )}
              
              {/* Indicators for multiple media or video */}
              {hasMultipleMedia && (
                <View style={styles.multipleIndicator}>
                  <MaterialIcons name="collections" size={16} color="#FFFFFF" />
                </View>
              )}
              
              {item.mediaType === 'video' && (
                <View style={styles.videoIndicator}>
                  <Ionicons name="play" size={18} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#FFFFFF' : '#000000'}
            colors={[colors.primary]}
            progressBackgroundColor={isDark ? '#2A2A2A' : '#F0F0F0'}
          />
        }
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={9}
        removeClippedSubviews={true}
        contentContainerStyle={styles.gridContainer}
      />
    );
  }
  
  // List view (vertical scrolling posts)
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const hasMedia = item.media && item.media.length > 0;
        const mediaUrl = hasMedia ? item.media[0].url : null;
        
        return (
          <TouchableOpacity 
            style={[styles.listItem, { backgroundColor: colors.background }]}
            onPress={() => handlePostPress(item)}
            activeOpacity={0.8}
          >
            {/* Post header with date */}
            <View style={styles.listItemHeader}>
              <Text style={[styles.listItemDate, { color: colors.subtext }]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            
            {/* Post content */}
            {item.content && (
              <Text 
                style={[styles.listItemContent, { color: colors.text }]} 
                numberOfLines={hasMedia ? 3 : 10}
              >
                {item.content}
              </Text>
            )}
            
            {/* Post media */}
            {hasMedia && (
              <Image 
                source={{ uri: mediaUrl }} 
                style={styles.listItemMedia}
                resizeMode="cover"
              />
            )}
            
            {/* Post stats */}
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
      }}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDark ? '#FFFFFF' : '#000000'}
          colors={[colors.primary]}
          progressBackgroundColor={isDark ? '#2A2A2A' : '#F0F0F0'}
        />
      }
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={7}
      removeClippedSubviews={true}
      contentContainerStyle={styles.listContainer}
    />
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
  gridContainer: {
    paddingVertical: 1,
  },
  gridItem: {
    width: GRID_SIZE - 2,
    height: GRID_SIZE - 2,
    position: 'relative',
    margin: 1,
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
    borderRadius: 4,
    padding: 3,
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
    padding: 8,
  },
  listItem: {
    marginBottom: 16,
    overflow: 'hidden',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(150, 150, 150, 0.2)',
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
    flex: 1,
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
});

export default PostGrid;
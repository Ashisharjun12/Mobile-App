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
  useColorScheme
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;

const PostGrid = ({ 
  posts = [], 
  viewMode = 'grid',
  onLoadMore,
  isLoadingMore = false,
  userId,
  isLoading = false,
  disableScrolling = false
}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Define theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    card: isDark ? '#1E1E1E' : '#F5F5F5',
    primary: '#0095F6',
  };

  // Handle navigation to post detail
  const handlePostPress = (post) => {
    if (!post || !post.id) return;
    
    // Ensure we have the author ID
    const authorId = post.authorId || userId;
    
    if (!authorId) {
      console.error("No author ID available for post:", post.id);
      return;
    }
    
    console.log(`Navigating to post ${post.id} by author ${authorId}`);
    
    navigation.navigate('UserPosts', { 
      postId: post.id,
      authorId: authorId
    });
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.gridContainer}>
          {[...Array(9)].map((_, index) => (
            <View 
              key={`skeleton-${index}`} 
              style={[styles.gridItem, { backgroundColor: colors.border }]}
            />
          ))}
        </View>
      </View>
    );
  }

  // Render empty state
  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={50} color={colors.subtext} />
        <Text style={[styles.emptyText, { color: colors.text }]}>No Posts Yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.subtext }]}>
          When posts are added, they'll appear here.
        </Text>
      </View>
    );
  }

  // Render grid view
  if (viewMode === 'grid') {
    if (disableScrolling) {
      return (
        <View style={styles.gridContainer}>
          {posts.map(item => {
            const hasMedia = item.media && item.media.length > 0;
            const mediaUrl = hasMedia ? item.media[0].url : null;
            const hasMultipleMedia = item.media && item.media.length > 1;
            
            return (
              <TouchableOpacity 
                key={item.id}
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
                
                {/* Indicators */}
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
          })}
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
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
                
                {/* Indicators */}
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
          initialNumToRender={9}
          maxToRenderPerBatch={9}
          windowSize={9}
          removeClippedSubviews={true}
        />
      </View>
    );
  }

  // Render list view
  if (disableScrolling) {
    return (
      <View style={styles.listViewContainer}>
        {posts.map(item => {
          const hasMedia = item.media && item.media.length > 0;
          const mediaUrl = hasMedia ? item.media[0].url : null;
          
          return (
            <TouchableOpacity 
              key={item.id}
              style={[styles.listItem, { backgroundColor: colors.card }]}
              onPress={() => handlePostPress(item)}
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
        })}
      </View>
    );
  }
  
  // Original FlatList return for list view
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const hasMedia = item.media && item.media.length > 0;
          const mediaUrl = hasMedia ? item.media[0].url : null;
          
          return (
            <TouchableOpacity 
              style={[styles.listItem, { backgroundColor: colors.card }]}
              onPress={() => handlePostPress(item)}
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
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContainer}
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
  loadingContainer: {
    padding: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
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
    padding: 8,
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
  listViewContainer: {
    padding: 8,
  },
});

export default PostGrid;
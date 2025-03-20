import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const PostCard = ({ 
  post, 
  userProfile, 
  onLike, 
  onComment, 
  onShare, 
  onProfilePress,
  onMorePress,
  liked = false,
  likeAnimating = false,
  isOwnPost = false,
  isFocused = false 
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    highlightBlue: '#0095F6',
    heart: '#E1306C',
    blue: '#0095F6',
  };
  
  // Format date for readability
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
  
  // Handle hashtags in text
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
  
  // Handle image carousel
  const renderImageCarousel = () => {
    if (!post?.media || post.media.length === 0) return null;
    
    return (
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
            setActiveImageIndex(pageNum);
          }}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item.url }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          )}
          keyExtractor={(item, index) => `media-${index}`}
        />
        
        {/* Pagination dots */}
        {post.media.length > 1 && (
          <View style={styles.paginationContainer}>
            {post.media.map((_, index) => (
              <View 
                key={`dot-${index}`} 
                style={[
                  styles.paginationDot,
                  { 
                    backgroundColor: index === activeImageIndex 
                      ? colors.highlightBlue 
                      : 'rgba(255, 255, 255, 0.6)' 
                  }
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={[
      styles.postContainer, 
      { backgroundColor: colors.background },
      isFocused && styles.focusedPost
    ]}>
      {/* Post header with user info */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={onProfilePress}>
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
                {userProfile?.username || 'Username'}
              </Text>
              {userProfile?.verifiedBadge && (
                <MaterialCommunityIcons 
                  name="check-decagram" 
                  size={14} 
                  color={colors.blue} 
                  style={styles.verifiedBadge} 
                />
              )}
            </View>
            <Text style={[styles.timeAgo, {color: colors.subtext}]}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Post content */}
      <View style={styles.postBody}>
        {renderTextWithHashtags(post.content)}
        
        {/* Media carousel */}
        {renderImageCarousel()}
        
        {/* Action buttons */}
        <View style={styles.actionBar}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onLike(post.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={24} 
                color={liked ? colors.heart : colors.text} 
                style={likeAnimating && styles.likeAnimation}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onComment(post.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onShare(post.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="paper-plane-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Like count and comments summary */}
        <View style={styles.postMeta}>
          <Text style={[styles.likesCount, {color: colors.text}]}>
            {(post.likesCount || 0) + (liked ? 1 : 0)} likes
          </Text>
          
          {post.commentsCount > 0 && (
            <TouchableOpacity 
              onPress={() => onComment(post.id)}
              style={styles.viewComments}
            >
              <Text style={[styles.commentsText, {color: colors.subtext}]}>
                View all {post.commentsCount} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    paddingVertical: 12,
  },
  focusedPost: {
    paddingTop: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
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
    fontSize: 14,
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
    fontSize: 14,
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
  postBody: {
    paddingHorizontal: 16,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  hashtag: {
    fontWeight: '500',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  mediaImage: {
    width: width - 32, // Account for container padding
    height: '100%',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
    padding: 2,
  },
  likeAnimation: {
    transform: [{scale: 1.2}],
  },
  postMeta: {
    marginTop: 4,
  },
  likesCount: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  viewComments: {
    marginTop: 2,
  },
  commentsText: {
    fontSize: 14,
  },
});

export default PostCard;
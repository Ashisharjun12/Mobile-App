import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

const  PersonalDetailsSkeleton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    separator: isDark ? '#2A2A2A' : '#EEEEEE',
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Post Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.userMeta}>
            <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={12} />
          </View>
        </View>
        <Skeleton width={20} height={20} />
      </View>
      
      {/* Post Content */}
      <View style={styles.content}>
        <Skeleton width={width - 32} height={14} style={{ marginBottom: 6 }} />
        <Skeleton width={width * 0.85} height={14} style={{ marginBottom: 6 }} />
        <Skeleton width={width * 0.65} height={14} />
      </View>
      
      {/* Media */}
      <Skeleton width={width} height={width} borderRadius={0} />
      
      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <Skeleton width={24} height={24} style={{ marginRight: 20 }} />
          <Skeleton width={24} height={24} style={{ marginRight: 20 }} />
          <Skeleton width={24} height={24} />
        </View>
        <Skeleton width={24} height={24} />
      </View>
      
      {/* Likes & Comments */}
      <View style={styles.engagement}>
        <Skeleton width={80} height={16} style={{ marginBottom: 8 }} />
        <Skeleton width={120} height={14} />
      </View>
      
      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <View style={[styles.sectionDivider, { backgroundColor: colors.separator }]} />
        
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={18} />
        </View>
        
        {/* Comment Items */}
        {[...Array(3)].map((_, index) => (
          <View key={`comment-${index}`} style={styles.commentItem}>
            <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: 12 }} />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
                <Skeleton width={40} height={12} />
              </View>
              <Skeleton width={width * 0.7} height={14} style={{ marginBottom: 4 }} />
              <Skeleton width={width * 0.5} height={14} />
              <View style={styles.commentActions}>
                <Skeleton width={40} height={12} style={{ marginRight: 16 }} />
                <Skeleton width={40} height={12} style={{ marginRight: 16 }} />
                <Skeleton width={40} height={12} />
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* Add Comment */}
      <View style={styles.addComment}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <Skeleton 
          width={width - 80} 
          height={40} 
          style={{ marginLeft: 12, borderRadius: 20 }} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMeta: {
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
  },
  engagement: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  commentsSection: {
    paddingVertical: 12,
  },
  sectionDivider: {
    height: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopColor: 'transparent',
  },
});

export default PersonalDetailsSkeleton; 
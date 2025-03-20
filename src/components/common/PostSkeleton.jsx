import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

const PostSkeleton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    separator: isDark ? '#2A2A2A' : '#EEEEEE',
  };
  
  return (
    <View style={styles.skeletonContainer}>
      {/* Header skeleton */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Skeleton width={36} height={36} borderRadius={18} />
          <View style={styles.userMeta}>
            <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={10} />
          </View>
        </View>
        <Skeleton width={24} height={10} />
      </View>
      
      {/* Content skeleton */}
      <View style={styles.postContent}>
        <Skeleton width={width - 32} height={12} style={{ marginBottom: 6 }} />
        <Skeleton width={width * 0.7} height={12} style={{ marginBottom: 6 }} />
        <Skeleton width={width * 0.5} height={12} />
      </View>
      
      {/* Media skeleton */}
      <View style={styles.mediaContainer}>
        <Skeleton width={width} height={width} borderRadius={0} />
      </View>
      
      {/* Action bar skeleton */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <Skeleton width={24} height={24} style={{ marginRight: 18 }} />
          <Skeleton width={24} height={24} style={{ marginRight: 18 }} />
          <Skeleton width={24} height={24} />
        </View>
        <Skeleton width={24} height={24} />
      </View>
      
      {/* Post meta skeleton */}
      <View style={styles.postMeta}>
        <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
        <Skeleton width={150} height={12} />
      </View>
      
      {/* Separator */}
      <View style={[styles.postSeparator, { backgroundColor: colors.separator }]} />
      
      {/* Second post skeleton (partial) */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Skeleton width={36} height={36} borderRadius={18} />
          <View style={styles.userMeta}>
            <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={10} />
          </View>
        </View>
        <Skeleton width={24} height={10} />
      </View>
      
      <View style={styles.postContent}>
        <Skeleton width={width - 32} height={12} style={{ marginBottom: 6 }} />
        <Skeleton width={width * 0.6} height={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    paddingTop: 16,
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
  userMeta: {
    marginLeft: 10,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mediaContainer: {
    width: width,
    height: width,
    marginBottom: 12,
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
  postMeta: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  postSeparator: {
    height: 1,
    marginVertical: 8,
  },
});

export default PostSkeleton; 
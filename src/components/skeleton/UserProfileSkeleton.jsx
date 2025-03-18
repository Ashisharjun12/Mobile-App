import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { getSkeletonColor } from './skeletonUtils';

const UserProfileSkeleton = () => {
  const isDark = useColorScheme() === 'dark';
  const { baseColor } = getSkeletonColor(isDark);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarSkeleton, { backgroundColor: baseColor }]} />
        <View style={styles.statsContainer}>
          {[...Array(3)].map((_, i) => (
            <View key={i} style={styles.statItem}>
              <View style={[styles.statNumberSkeleton, { backgroundColor: baseColor }]} />
              <View style={[styles.statLabelSkeleton, { backgroundColor: baseColor }]} />
            </View>
          ))}
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.bioSection}>
        <View style={[styles.usernameSkeleton, { backgroundColor: baseColor }]} />
        {[...Array(2)].map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.bioLineSkeleton, 
              { 
                backgroundColor: baseColor,
                width: i === 1 ? '70%' : '100%' 
              }
            ]} 
          />
        ))}
        
        {/* College Info */}
        <View style={styles.collegeInfo}>
          <View style={[styles.collegeLogoSkeleton, { backgroundColor: baseColor }]} />
          <View style={[styles.collegeTextSkeleton, { backgroundColor: baseColor }]} />
        </View>
      </View>

      {/* Edit Button */}
      <View style={[styles.editButtonSkeleton, { backgroundColor: baseColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarSkeleton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginRight: 20,
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
  statNumberSkeleton: {
    width: 40,
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  statLabelSkeleton: {
    width: 60,
    height: 12,
    borderRadius: 4,
  },
  bioSection: {
    marginBottom: 20,
  },
  usernameSkeleton: {
    width: 150,
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
  },
  bioLineSkeleton: {
    height: 14,
    borderRadius: 4,
    marginBottom: 8,
  },
  collegeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  collegeLogoSkeleton: {
    width: 22,
    height: 22,
    borderRadius: 4,
    marginRight: 8,
  },
  collegeTextSkeleton: {
    width: 180,
    height: 14,
    borderRadius: 4,
  },
  editButtonSkeleton: {
    height: 36,
    borderRadius: 8,
    marginTop: 16,
  },
});

export default UserProfileSkeleton; 
import React from 'react';
import { View, StyleSheet, useColorScheme, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PersonalDetailsSkeleton = () => {
  const isDark = useColorScheme() === 'dark';
  
  // Colors based on theme
  const baseColor = isDark ? '#2A2A2A' : '#E8E8E8';
  const highlightColor = isDark ? '#3A3A3A' : '#F5F5F5';
  
  return (
    <View style={styles.container}>
      {/* Avatar Skeleton */}
      <View style={[styles.avatarSkeleton, { backgroundColor: baseColor }]} />
      
      {/* Username Skeleton */}
      <View style={[styles.usernameSkeleton, { backgroundColor: baseColor }]} />
      
      {/* Bio Skeleton */}
      <View style={[styles.bioSkeleton, { backgroundColor: baseColor }]} />
      
      {/* Stats Row Skeleton */}
      <View style={styles.statsRow}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.statValueSkeleton, { backgroundColor: baseColor }]} />
            <View style={[styles.statLabelSkeleton, { backgroundColor: baseColor }]} />
          </View>
        ))}
      </View>
      
      <View style={[styles.divider, { backgroundColor: baseColor }]} />
      
      {/* Section Skeletons */}
      {[1, 2, 3].map((section) => (
        <View key={`section-${section}`} style={styles.section}>
          <View style={[styles.sectionTitleSkeleton, { backgroundColor: baseColor }]} />
          
          {/* Detail Items */}
          {[1, 2, 3, 4].map((item) => (
            <View key={`item-${section}-${item}`} style={styles.detailItem}>
              <View style={[styles.iconSkeleton, { backgroundColor: baseColor }]} />
              <View style={styles.detailContent}>
                <View style={[styles.labelSkeleton, { backgroundColor: baseColor }]} />
                <View style={[styles.valueSkeleton, { backgroundColor: baseColor }]} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  avatarSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  usernameSkeleton: {
    width: 150,
    height: 22,
    borderRadius: 4,
    marginTop: 12,
    alignSelf: 'center',
  },
  bioSkeleton: {
    width: '80%',
    height: 16,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValueSkeleton: {
    width: 40,
    height: 18,
    borderRadius: 4,
  },
  statLabelSkeleton: {
    width: 60,
    height: 14,
    borderRadius: 4,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  section: {
    marginTop: 16,
  },
  sectionTitleSkeleton: {
    width: 120,
    height: 18,
    borderRadius: 4,
    marginBottom: 12,
    marginLeft: 4,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
  },
  iconSkeleton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  labelSkeleton: {
    width: '30%',
    height: 14,
    borderRadius: 4,
    marginBottom: 2,
  },
  valueSkeleton: {
    width: '70%',
    height: 16,
    borderRadius: 4,
  },
});

export default PersonalDetailsSkeleton; 
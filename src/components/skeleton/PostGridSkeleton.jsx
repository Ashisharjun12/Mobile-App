import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { getSkeletonColor } from './skeletonUtils';

const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;
const GRID_SPACING = 1;

const PostGridSkeleton = ({ count = 9 }) => {
  const isDark = useColorScheme() === 'dark';
  const { baseColor } = getSkeletonColor(isDark);

  const rows = Math.ceil(count / 3);
  
  return (
    <View style={styles.container}>
      {[...Array(rows)].map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {[...Array(3)].map((_, colIndex) => {
            const itemIndex = rowIndex * 3 + colIndex;
            if (itemIndex >= count) return null;
            
            return (
              <View
                key={`item-${itemIndex}`}
                style={[
                  styles.gridItem,
                  { backgroundColor: baseColor }
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: GRID_SPACING / 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: GRID_SIZE - GRID_SPACING,
    height: GRID_SIZE - GRID_SPACING,
    margin: GRID_SPACING / 2,
  },
});

export default PostGridSkeleton; 
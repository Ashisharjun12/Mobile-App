import React from 'react';
import { View, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');
const GRID_SIZE = width / 3;
const GRID_SPACING = 1;

const PostGridSkeleton = ({ count = 9 }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    separator: isDark ? '#2A2A2A' : '#EEEEEE',
  };

  const rows = Math.ceil(count / 3);
  
  return (
    <View style={styles.container}>
      {/* Tab selector skeleton */}
      <View style={styles.tabSelector}>
        {[...Array(2)].map((_, index) => (
          <Skeleton 
            key={`tab-${index}`} 
            width={width / 2 - 20} 
            height={30} 
            style={{ marginHorizontal: 10 }}
          />
        ))}
      </View>
      
      {/* Grid items */}
      {[...Array(rows)].map((_, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {[...Array(3)].map((_, colIndex) => {
            const itemIndex = rowIndex * 3 + colIndex;
            if (itemIndex >= count) return null;
            
            return (
              <Skeleton
                key={`item-${itemIndex}`}
                width={GRID_SIZE - GRID_SPACING}
                height={GRID_SIZE - GRID_SPACING}
                borderRadius={0}
                style={styles.gridItem}
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
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  gridItem: {
    margin: GRID_SPACING / 2,
  },
  tabSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 8,
  },
});

export default PostGridSkeleton; 
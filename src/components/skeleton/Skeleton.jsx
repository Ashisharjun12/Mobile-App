import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, useColorScheme } from 'react-native';

const Skeleton = ({ width, height, style, borderRadius }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Colors based on theme
  const baseColor = isDark ? '#2A2A2A' : '#E0E0E0';
  const highlightColor = isDark ? '#3A3A3A' : '#F5F5F5';
  
  // Create animated value for the shimmer effect
  const animatedValue = new Animated.Value(0);
  
  useEffect(() => {
    // Create the animation loop
    const runAnimation = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => runAnimation());
    };
    
    runAnimation();
    
    // Clean up animation when component unmounts
    return () => animatedValue.stopAnimation();
  }, []);
  
  // Interpolate the animated value for the shimmer effect
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, width * 2],
  });
  
  // Set border radius with a default
  const finalBorderRadius = borderRadius !== undefined ? borderRadius : height / 4;
  
  return (
    <View 
      style={[
        { 
          width, 
          height, 
          borderRadius: finalBorderRadius, 
          backgroundColor: baseColor,
          overflow: 'hidden'
        }, 
        style
      ]}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: highlightColor,
          transform: [{ translateX }],
          opacity: 0.5,
        }}
      />
    </View>
  );
};

export default Skeleton; 
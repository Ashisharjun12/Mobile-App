import React from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const GlassButton = ({ children, onPress, style, currentTheme }) => {
  const isDark = currentTheme.dark;
  
  // For platforms that support BlurView
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <BlurView
          style={styles.blurContainer}
          blurType={isDark ? 'dark' : 'light'}
          blurAmount={10}
          reducedTransparencyFallbackColor={isDark ? '#333' : '#f0f0f0'}
        >
          <View style={styles.content}>
            {children}
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  }
  
  // Fallback for Android or platforms without BlurView
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: isDark ? 'rgba(50, 50, 50, 0.8)' : 'rgba(240, 240, 240, 0.8)',
          borderColor: isDark ? 'rgba(80, 80, 80, 0.5)' : 'rgba(220, 220, 220, 0.5)',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlassButton; 
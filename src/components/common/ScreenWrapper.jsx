import React from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../utils/context/ThemeContext';

const ScreenWrapper = ({ children, style }) => {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.dark;

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { 
          backgroundColor: isDark ? '#121212' : '#FFFFFF',
          // Only add padding to the bottom if it's not enough
          paddingBottom: insets.bottom > 0 ? 0 : 16
        },
        style
      ]}
    >
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#121212' : '#FFFFFF'} 
      />
      <View 
        style={[
          styles.content,
          { 
            // Add padding to the top if the SafeAreaView doesn't provide enough
            paddingTop: Platform.OS === 'android' ? insets.top || 16 : 0
          }
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper; 
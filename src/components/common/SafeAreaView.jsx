import React from 'react';
import { View, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../utils/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const CustomSafeAreaView = ({ children }) => {
  const { currentTheme } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: currentTheme.colors.background }
    ]}>
      <View style={styles.statusBarSpace} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  statusBarSpace: {
    height: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
  },
});

export default CustomSafeAreaView;
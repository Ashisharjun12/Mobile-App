import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../utils/context/ThemeContext';
import ScreenWrapper from '../common/ScreenWrapper';

const Confession = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.dark;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle, 
          { color: isDark ? '#FFFFFF' : '#000000' }
        ]}>
          Confessions
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
          Confession content goes here
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default Confession;
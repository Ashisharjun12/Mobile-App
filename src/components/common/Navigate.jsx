import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/context/ThemeContext';

const { width } = Dimensions.get('window');

const Navigate = ({ title }) => {
  const navigation = useNavigation();
  const { currentTheme, isDarkTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back-sharp" 
            color={isDarkTheme ? '#FFFFFF' : '#000000'} 
            size={width * 0.06} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          Display
        </Text>
      </View>

      <View style={styles.rightContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
    height: width * 0.15,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 4,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
  },
  backButton: {
    padding: width * 0.02,
  },
  title: {
    fontSize: width * 0.055,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
});

export default Navigate;
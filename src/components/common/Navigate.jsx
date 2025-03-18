import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const Navigate = ({ title }) => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  
  // Colors based on theme
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back-sharp" 
            color={colors.text} 
            size={width * 0.06} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
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
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Navigate;
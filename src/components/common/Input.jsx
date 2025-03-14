import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { useTheme } from '../../utils/context/ThemeContext';

const { width } = Dimensions.get('window');

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType = 'default',
  autoCapitalize = 'none'
}) => {
  const { currentTheme, isDarkTheme } = useTheme();
  const focusAnim = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [isDarkTheme ? '#374151' : '#E5E7EB', '#2563EB']
      ),
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, { color: currentTheme.colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={isDarkTheme ? '#6B7280' : '#9CA3AF'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => {
          focusAnim.value = withTiming(1, { duration: 200 });
        }}
        onBlur={() => {
          focusAnim.value = withTiming(0, { duration: 200 });
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: width * 0.13,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: width * 0.04,
  },
});

export default Input; 
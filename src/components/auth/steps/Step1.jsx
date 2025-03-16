import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import Animated, { 
  FadeInRight,
  FadeOutLeft 
} from 'react-native-reanimated';
import AvatarSelector from '../AvatarSelector';

const { width, height } = Dimensions.get('window');

const Step1 = ({ currentTheme, avatarStyle, handleAvatarSelect }) => {
  return (
    <Animated.View 
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.stepContainer}
    >
      <Text style={[styles.stepTitle, { color: currentTheme.colors.text }]}>
        Choose Your Avatar
      </Text>
      <Text style={[styles.stepDescription, { color: currentTheme.colors.text }]}>
        Select an avatar style that represents you
      </Text>
      <AvatarSelector
        selectedStyle={avatarStyle}
        onSelect={handleAvatarSelect}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: width,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    flex: 1,
    marginBottom: height * 0.1,
  },
  stepTitle: {
    fontSize: width * 0.06,
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.01,
  },
  stepDescription: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    opacity: 0.7,
    marginBottom: height * 0.03,
  },
});

export default Step1; 
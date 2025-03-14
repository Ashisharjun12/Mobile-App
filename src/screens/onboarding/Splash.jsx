import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { 
  responsiveHeight, 
  responsiveWidth, 
  responsiveFontSize 
} from 'react-native-responsive-dimensions';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/context/ThemeContext';

const Splash = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  
  // Animation values
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
    opacity: taglineOpacity.value
  }));

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 100
    });
    opacity.value = withTiming(1, { duration: 800 });
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    emojiScale.value = withDelay(1000, withSpring(1, {
      damping: 10,
      stiffness: 100
    }));

    const timer = setTimeout(() => {
      navigation.navigate('App');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <StatusBar
        backgroundColor={currentTheme.colors.background}
        barStyle={currentTheme.colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'}
      />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>IC</Text>
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          InCampus
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineStyle]}>
        <Text style={[styles.tagline, { color: currentTheme.colors.text }]}>
          A COLLEGE-BASED{'\n'}ANONYMOUS SOCIAL NETWORK
        </Text>
        <Animated.View style={[styles.emojiContainer, emojiStyle]}>
          <Text style={[styles.emoji, { color: currentTheme.colors.text }]}>
            Made with ❤️ in 🇮🇳
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    backgroundColor: '#2563EB',
    borderRadius: responsiveWidth(7),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: responsiveHeight(1),
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(5),
    fontFamily: 'Nunito-ExtraBold',
    includeFontPadding: false,
  },
  titleContainer: {
    marginTop: responsiveHeight(3),
  },
  title: {
    fontSize: responsiveFontSize(4),
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: responsiveHeight(10),
    alignItems: 'center',
  },
  tagline: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  emojiContainer: {
    marginTop: responsiveHeight(1),
  },
  emoji: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
});

export default Splash;
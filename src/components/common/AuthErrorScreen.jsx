import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUserAuthStore } from '../../store/auth-store';
import LogoutButton from './LogoutButton';

const AuthErrorScreen = ({ navigation, onLogin, errorType = 'auth' }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const logout = useUserAuthStore(state => state.logout);

  // Simple theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    cardBg: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#F5F5F5' : '#121212',
    subtext: isDark ? '#AAAAAA' : '#666666',
    button: '#FF3B30', // Red button for all error types
    buttonText: '#FFFFFF',
    accent: isDark ? '#404040' : '#F0F0F0',
  };

  // Handle login button press
  const handleLoginPress = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error (non-critical):", error);
    }
    
    if (navigation) {
      navigation.navigate('Login');
    }
    
    if (onLogin) {
      onLogin();
    }
  };

  // Content based on error type
  const content = {
    auth: {
      icon: 'lock-closed',
      title: 'Authentication Required',
      message: 'Please log in to view this profile and access all features.',
      buttonText: 'Log In',
    },
    profile: {
      icon: 'person-outline',
      title: 'Profile Not Found',
      message: 'The user profile you are looking for could not be loaded.',
      buttonText: 'Go to Login',
    }
  }[errorType];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View 
        style={[
          styles.card, 
          { backgroundColor: colors.cardBg }
        ]}
      >
        <View 
          style={[
            styles.iconContainer, 
            { backgroundColor: colors.accent }
          ]}
        >
          <Ionicons 
            name={content.icon} 
            size={32} 
            color={isDark ? '#FFFFFF' : '#121212'} 
          />
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>
          {content.title}
        </Text>
        
        <Text style={[styles.message, { color: colors.subtext }]}>
          {content.message}
        </Text>
        
       <LogoutButton style={{width:"100%"}}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthErrorScreen; 
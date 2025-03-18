import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Theme from '../setting/Theme';
import ScreenWrapper from '../common/ScreenWrapper';

const Home = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.dark;

  const handleMessagePress = () => {
    navigation.navigate('message');
  };

  const handleNotificationPress = () => {
    navigation.navigate('notification');
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={[
            styles.logoText, 
            { color: isDark ? '#FFFFFF' : '#000000' }
          ]}>
            InCampus
          </Text>
        </View>
        
        <View style={styles.iconsContainer}>
          {/* Custom Message Icon */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleMessagePress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons 
                name="message-text-outline" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
              {/* Unread indicator */}
              <View style={styles.unreadBadge} />
            </View>
          </TouchableOpacity>
          
          {/* Custom Notification Icon */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
              {/* Notification count */}
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    letterSpacing: -0.5,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
    padding: 4,
  },
  iconWrapper: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default Home;
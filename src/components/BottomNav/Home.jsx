import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../utils/context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import ScreenWrapper from '../common/ScreenWrapper';
import AllPost from '../posts/postsdata/AllPost';
import AllPostFilterModel from '../posts/postsdata/AllPostFilterModel';

const Home = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.dark;
  
  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all' or 'college'

  const handleMessagePress = () => {
    navigation.navigate('message');
  };

  const handleNotificationPress = () => {
    navigation.navigate('notification');
  };
  
  // Handle filter button press
  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };
  
  // Handle filter selection
  const handleFilterChange = (type) => {
    setFilterType(type);
    setFilterModalVisible(false);
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
          {/* Filter Icon - Moved to be with other icons */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Feather 
                name="filter" 
                size={22}
                color={filterType === 'college' ? '#0095F6' : (isDark ? '#FFFFFF' : '#000000')} 
              />
              {filterType === 'college' && (
                <View style={styles.filterActiveDot} />
              )}
            </View>
          </TouchableOpacity>
        
          {/* Message Icon */}
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleMessagePress}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Feather
                name="send" 
                size={22} 
                color={isDark ? '#FFFFFF' : '#000000'} 
              />
              {/* Unread indicator */}
              <View style={styles.unreadBadge} />
            </View>
          </TouchableOpacity>
          
          {/* Notification Icon */}
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

      {/* Post feed takes the rest of the screen */}
      <View style={styles.feedContainer}>
        <AllPost 
          navigation={navigation}
          filterType={filterType}
        />
      </View>
      
      {/* Filter Modal */}
      <AllPostFilterModel
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onSelectFilter={handleFilterChange}
        currentFilter={filterType}
      />
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
    marginLeft: 18,
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
  filterActiveDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0095F6',
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
  feedContainer: {
    flex: 1,
  },
});

export default Home;
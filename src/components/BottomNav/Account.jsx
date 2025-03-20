import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import { useUserAuthStore } from '../../store/auth-store';
import UserProfile from '../profile/UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingModal from '../setting/SettingModal';
import AddModel from '../add/AddModel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Account = ({ navigation, route }) => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useUserAuthStore(state => state.user);
  
  // Get route params
  const params = route.params || {};
  const viewUserId = params.viewUserId;
  const fromFeed = params.fromFeed;
  
  // State to track current profile being viewed
  const [currentProfileId, setCurrentProfileId] = useState(user?.id);
  
  // Determine which user ID to display
  const displayUserId = currentProfileId || user?.id;
  
  // Check if this is the logged-in user's profile
  const isOwnProfile = displayUserId === user?.id;
  
  // Get colors based on theme
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
  };
  
  // Update current profile when route params change
  useEffect(() => {
    if (viewUserId) {
      setCurrentProfileId(viewUserId);
    } else {
      setCurrentProfileId(user?.id);
    }
  }, [viewUserId, user?.id]);
  
  // Reset to own profile when tab is pressed while already on AccountTab
  useFocusEffect(
    React.useCallback(() => {
      // This will handle the case when the tab is pressed while on AccountTab
      const tabPress = navigation.getParent()?.addListener('tabPress', (e) => {
        if (navigation.isFocused()) {
          // If we're already on the Account tab, reset to own profile
          setCurrentProfileId(user?.id);
          navigation.setParams({
            viewUserId: null,
            fromFeed: false
          });
        }
      });
      
      return () => {
        if (navigation.getParent()) {
          navigation.getParent().removeListener('tabPress', tabPress);
        }
      };
    }, [navigation, user?.id])
  );
  
  // Handle back button press
  const handleBackPress = () => {
    if (fromFeed) {
      // If we came from feed, go back to the feed
      navigation.goBack();
    } else {
      // Otherwise reset to own profile
      setCurrentProfileId(user?.id);
      navigation.setParams({
        viewUserId: null,
        fromFeed: false
      });
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        {/* Left side - Back button if viewing another user */}
        <View style={styles.leftContainer}>
          {!isOwnProfile && (
            <TouchableOpacity 
              onPress={handleBackPress}
              style={styles.backButton}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={colors.text}
              />
            </TouchableOpacity>
          )}
          
          {/* Profile title - show username for other users */}
          {!isOwnProfile ? (
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Profile
            </Text>
          ) : null}
        </View>
        
        {/* Right Side Icons - Only for own profile */}
        <View style={styles.rightIconsContainer}>
          {isOwnProfile && (
            <>
              {/* Add Button */}
              <TouchableOpacity 
                onPress={() => setIsAddModalVisible(true)}
                style={styles.iconButton}
                testID="add-button"
              >
                <Ionicons 
                  name="add-circle-outline"
                  size={28} 
                  color={colors.text}
                />
              </TouchableOpacity>
              
              {/* Settings Button */}
              <TouchableOpacity 
                onPress={() => setIsSettingsVisible(true)}
                style={styles.iconButton}
                testID="settings-button"
              >
                <Ionicons 
                  name="ellipsis-horizontal"
                  size={24} 
                  color={colors.text}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      
      {/* Profile Content */}
      <View style={styles.content}>
        <UserProfile 
          userId={displayUserId} 
          navigation={navigation} 
          isVisitingProfile={!isOwnProfile}
        />
    </View>
      
      {/* Modals - Only for own profile */}
      {isOwnProfile && (
        <>
          <SettingModal 
            isVisible={isSettingsVisible}
            onClose={() => setIsSettingsVisible(false)}
          />
          
          <AddModel
            isVisible={isAddModalVisible}
            onClose={() => setIsAddModalVisible(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
});

export default Account;

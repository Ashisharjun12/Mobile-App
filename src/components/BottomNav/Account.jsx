import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useUserAuthStore } from '../../store/auth-store';
import UserProfile from '../profile/UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingModal from '../setting/SettingModal';
import AddModel from '../add/AddModel';


const Account = ({ navigation }) => {
   
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useUserAuthStore(state => state.user);
  
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        {/* Empty space on left */}
        <View style={styles.leftSpacer} />
        
        {/* Right Side Icons - Add and Settings next to each other */}
        <View style={styles.rightIconsContainer}>
          {/* Add Icon */}
          <TouchableOpacity 
            onPress={() => setIsAddModalVisible(true)}
            style={styles.addButton}
            testID="add-button"
          >
            <Ionicons 
              name="add-circle-outline"
              size={28} 
              color={colors.text}
            />
          </TouchableOpacity>

          {/* Settings Icon */}
          <TouchableOpacity 
            onPress={() => setIsSettingsVisible(true)}
            style={styles.menuButton}
            testID="settings-button"
          >
            <Ionicons 
              name="ellipsis-horizontal"
              size={24} 
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        <UserProfile userId={user?.id} navigation={navigation} />
      </View>

      {/* Settings Modal */}
      <SettingModal 
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
      />

      {/* Add Modal */}
      <AddModel
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
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
    borderBottomWidth: 0,
    justifyContent: 'space-between', // Push content to opposite sides
    marginVertical: 5,
  },
  leftSpacer: {
    flex: 1, // Takes up space on the left
  },
  rightIconsContainer: {
    flexDirection: 'row', // Arrange icons horizontally
    alignItems: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8, // Add some space between the icons
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default Account;

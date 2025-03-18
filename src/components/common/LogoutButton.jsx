import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Modal,
  View,
  Pressable,
  Dimensions,
  useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';
import { storage } from '../../store/mmkv';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LogoutButton = ({ 
  style, 
  textStyle, 
  iconSize = 20, 
  showIcon = true, 
  text = "Logout",
  onLogoutSuccess = () => {},
  customStyle
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigation = useNavigation();
  const logout = useUserAuthStore(state => state.logoutUser);
  const isDark = useColorScheme() === 'dark';

  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    danger: '#EF4444',
    modalBackground: 'rgba(0,0,0,0.5)',
  };

  const handleLogout = async () => {
    setShowConfirmModal(false);
    setIsLoggingOut(true);
    
    try {
      console.log('Logging out user...');
      
      // Attempt server logout, but don't wait for it in case of errors
      try {
        await userApi.logoutUser();
      } catch (error) {
        console.log('Server logout failed, continuing with local logout');
      }
      
      // Clear MMKV storage directly 
      storage.delete('user-auth');
      console.log('Cleared auth data from MMKV storage');
      
      // Update the auth store state
      logout();
      console.log('Updated auth store state - user logged out');
      
      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      
      // Execute optional callback
      onLogoutSuccess();
      
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if there's an error, ensure user is logged out locally
      storage.delete('user-auth');
      logout();
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, style, customStyle]}
        onPress={openConfirmModal}
        disabled={isLoggingOut}
        activeOpacity={0.7}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            {showIcon && (
              <Ionicons 
                name="log-out-outline" 
                size={iconSize} 
                color={textStyle?.color || "#FFFFFF"} 
                style={styles.icon} 
              />
            )}
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Centered Logout Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <Pressable 
          style={[styles.modalOverlay, { backgroundColor: colors.modalBackground }]} 
          onPress={() => setShowConfirmModal(false)}
        >
          <View 
            style={[styles.modalContainer, { backgroundColor: colors.background }]}
          >
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons 
                  name="log-out-outline" 
                  size={36} 
                  color={colors.danger} 
                />
              </View>
              
              {/* Title */}
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Logout
              </Text>

              {/* Message */}
              <Text style={[styles.modalMessage, { color: colors.subtext }]}>
                Are you sure you want to log out?
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalButton, styles.logoutButton, { backgroundColor: colors.danger }]} 
                  onPress={handleLogout}
                >
                  <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444', // Red color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 100,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 6,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 340,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent: {
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default LogoutButton; 
 
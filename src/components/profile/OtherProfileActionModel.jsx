import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  useColorScheme,
  Share,
  Clipboard,
  Platform,
  ToastAndroid,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');

const OtherProfileActionModel = ({ 
  visible, 
  onClose, 
  username,
  userId,
  onBlock,
  onReport,
  navigation,
  userProfile
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    modalBackground: isDark ? '#252525' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    danger: '#FF3B30',
    highlight: isDark ? '#E1E1E1' : '#000000',
  };
  
  // Animation for sliding up
  const slideAnim = useRef(new Animated.Value(height)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);
  
  // Handle share profile
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${username}'s profile!`,
        url: `https://yourapp.com/user/${userId}`,
      });
      
      if (result.action === Share.sharedAction) {
        console.log("Shared successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  // Handle copy profile link
  const handleCopyLink = () => {
    const profileUrl = `https://yourapp.com/user/${userId}`;
    Clipboard.setString(profileUrl);
    
    // Show success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Profile link copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Profile link copied to clipboard');
    }
    
    onClose();
  };
  
  // Handle block user
  const handleBlockUser = () => {
    // Call the onBlock handler passed in props
    if (onBlock) {
      onBlock();
    }
    onClose();
  };
  
  // Handle report user
  const handleReportUser = () => {
    // Call the onReport handler passed in props
    if (onReport) {
      onReport();
    }
    onClose();
  };
  
  // Handle QR code
  const handleQRCode = () => {
    console.log("Show QR code for profile");
    onClose();
  };
  
  // Handle about this account - Navigate to AboutAccount screen
  const handleAboutAccount = () => {
    onClose();
    // Navigate to the AboutAccount screen with user data
    navigation.navigate('AboutAccount', { 
      userId: userId,
      username: username,
      userProfile: userProfile
    });
  };
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  backgroundColor: colors.modalBackground,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Handle bar at top */}
              <View style={styles.headerContainer}>
                <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
              </View>
              
              {/* Action options */}
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleShare}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons 
                      name="share-social-outline" 
                      size={24} 
                      color={colors.text} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    Share profile
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleQRCode}
                >
                  <View style={styles.optionIconContainer}>
                    <MaterialIcons 
                      name="qr-code" 
                      size={24} 
                      color={colors.text} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    QR code
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleCopyLink}
                >
                  <View style={styles.optionIconContainer}>
                    <Feather 
                      name="link" 
                      size={24} 
                      color={colors.text} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    Copy profile URL
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleAboutAccount}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons 
                      name="information-circle-outline" 
                      size={24} 
                      color={colors.text} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    About this account
                  </Text>
                </TouchableOpacity>
                
                {/* Separator line */}
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
                
                {/* Danger zone options */}
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleReportUser}
                >
                  <View style={styles.optionIconContainer}>
                    <Feather 
                      name="flag" 
                      size={24} 
                      color={colors.danger} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.danger }]}>
                    Report
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.option}
                  onPress={handleBlockUser}
                >
                  <View style={styles.optionIconContainer}>
                    <Ionicons 
                      name="close-circle-outline" 
                      size={24} 
                      color={colors.danger} 
                    />
                  </View>
                  <Text style={[styles.optionText, { color: colors.danger }]}>
                    Block
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Cancel button removed as requested */}
            </Animated.View>
          </TouchableWithoutFeedback>
    </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  separator: {
    height: 1,
    marginVertical: 8,
  }
});

export default OtherProfileActionModel;
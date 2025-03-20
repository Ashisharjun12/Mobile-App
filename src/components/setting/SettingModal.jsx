import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  useColorScheme,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from '../common/LogoutButton';

const { height } = Dimensions.get('window');

const SettingModal = ({ isVisible, onClose }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation();
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    modalBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    cardBackground: isDark ? '#2A2A2A' : '#F5F5F5',
    danger: '#FF3B30',
    overlay: 'rgba(0, 0, 0, 0.4)',
  };
  
  // Animation values
  const slideAnim = new Animated.Value(isVisible ? 0 : height);
  const backdropOpacity = new Animated.Value(isVisible ? 1 : 0);
  
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);
  
  // Function to handle option press
  const handleOptionPress = (action) => {
    // Close the modal first
    onClose();
    
    // Wait a bit for animation to finish before executing the action
    setTimeout(() => {
      if (action) action();
    }, 300);
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: 'lock-closed-outline',
          label: 'Password & Security',
          onPress: () => navigation.navigate('Password'),
        },
        {
          icon: 'person-outline',
          label: 'Personal Details',
          onPress: () => navigation.navigate('PersonalDetails'),
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy',
          onPress: () => navigation.navigate('Privacy'),
        },
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: 'color-palette-outline',
          label: 'Appearance',
          onPress: () => navigation.navigate('Theme'),
        },
        {
          icon: 'notifications-outline',
          label: 'Notification Settings',
          onPress: () => navigation.navigate('Notification'),
        },
        {
          icon: 'bookmark-outline',
          label: 'Saved Posts',
          onPress: () => navigation.navigate('Saved'),
        },
      ]
    },
    {
      title: "Data",
      items: [
        {
          icon: 'server-outline',
          label: 'Data & Storage',
          onPress: () => navigation.navigate('DataStroage'),
        },
        {
          icon: 'trash-outline',
          label: 'Data Deletion Request',
          onPress: () => navigation.navigate('DataDelete'),
        },
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
          onPress: () => navigation.navigate('HelpCenter'),
        },
      ]
    }
  ];
  
  // Render menu item
  const renderMenuItem = (icon, label, onPress, showForwardIcon = true) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => handleOptionPress(onPress)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={colors.text} />
      </View>
      <Text style={[styles.menuText, { color: colors.text }]}>
        {label}
      </Text>
      {showForwardIcon && (
        <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.overlay, 
            { backgroundColor: colors.overlay, opacity: backdropOpacity }
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContainer, 
                { 
                  backgroundColor: colors.modalBackground,
                  borderColor: colors.border,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Handle bar */}
              <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
              
              {/* Title */}
              <Text style={[styles.title, { color: colors.text }]}>
                Account Settings
              </Text>
              
              {/* Menu Sections in ScrollView */}
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {menuSections.map((section, sectionIndex) => (
                  <View key={sectionIndex} style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
                      {section.title}
                    </Text>
                    <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
                      {section.items.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>
                          {renderMenuItem(item.icon, item.label, item.onPress)}
                          {itemIndex !== section.items.length - 1 && (
                            <View style={[styles.separator, { backgroundColor: colors.border }]} />
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                  </View>
                ))}
                
                {/* Logout Button */}
                <View style={styles.logoutContainer}>
                  <LogoutButton customStyle={styles.logoutButton} />
    </View>
                
                {/* Extra padding at the bottom */}
                <View style={styles.bottomPadding} />
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.75,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 0,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: '100%',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  separator: {
    height: 0.5,
    width: '100%',
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 8,
  },
  bottomPadding: {
    height: 30, // Safe area for devices with home indicators
  }
});

export default SettingModal;
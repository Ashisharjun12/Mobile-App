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
  TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

const ActionModel = ({ 
  visible, 
  onClose, 
  isOwnPost = false,
  onEdit,
  onDelete,
  onShare,
  onSave,
  onCopyLink,
  onBlock,
  onReport,
  onNotInterested
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    modalBackground: isDark ? '#1E1E1E' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    highlightBlue: '#0095F6',
    destructive: '#FF3B30',
    overlay: 'rgba(0, 0, 0, 0.4)',
  };
  
  // Animation values
  const slideAnim = new Animated.Value(visible ? 0 : height);
  const backdropOpacity = new Animated.Value(visible ? 1 : 0);
  
  useEffect(() => {
    if (visible) {
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
  }, [visible]);
  
  // Function to handle option press
  const handleOptionPress = (action) => {
    // Close the modal first
    onClose();
    
    // Wait a bit for animation to finish before executing the action
    setTimeout(() => {
      if (action) action();
    }, 300);
  };
  
  // Render action option
  const renderOption = (icon, label, onPress, color = colors.text, destructive = false) => (
    <TouchableOpacity 
      style={styles.option}
      onPress={() => handleOptionPress(onPress)}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        {typeof icon === 'string' ? (
          <Ionicons name={icon} size={22} color={color} />
        ) : (
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        )}
      </View>
      <Text style={[
        styles.optionText, 
        { color },
        destructive && styles.destructiveText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <Modal
      transparent
      visible={visible}
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
                Post Options
              </Text>
              
              {/* Owner-specific options */}
              {isOwnPost && (
                <View style={styles.sectionContainer}>
                  {renderOption('create-outline', 'Edit', onEdit)}
                  {renderOption('trash-outline', 'Delete', onDelete, colors.destructive, true)}
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                </View>
              )}
              
              {/* Common options */}
              <View style={styles.sectionContainer}>
                {renderOption('share-outline', 'Share', onShare)}
                {renderOption('bookmark-outline', 'Save', onSave)}
                {renderOption('copy-outline', 'Copy link', onCopyLink)}
                {!isOwnPost && renderOption('eye-off-outline', 'Not interested', onNotInterested)}
              </View>
              
              {/* Always show report and block (even for own posts) */}
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
              <View style={styles.sectionContainer}>
                {renderOption('remove-circle-outline', 'Block', onBlock, colors.destructive, true)}
                {renderOption('flag-outline', 'Report', onReport, colors.destructive, true)}
    </View>
              
              {/* Extra padding at the bottom */}
              <View style={styles.bottomPadding} />
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
  sectionContainer: {
    width: '100%',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    width: '100%',
  },
  optionIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 14,
  },
  optionText: {
    fontSize: 16,
  },
  destructiveText: {
    fontWeight: '500',
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  bottomPadding: {
    height: 30, // Safe area for devices with home indicators
  }
});

export default ActionModel;
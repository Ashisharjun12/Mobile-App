import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  useColorScheme
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { height } = Dimensions.get('window');

const AllPostFilterModel = ({ visible, onClose, onSelectFilter, currentFilter }) => {
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
    collegeColor: '#4F46E5', // Indigo color for college filter
    allPostsColor: '#16A34A', // Green color for all posts filter
    overlay: 'rgba(0, 0, 0, 0.4)',
  };
  
  // Animation values with useRef to persist between renders
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  // Reset animation values when modal visibility changes
  useEffect(() => {
    if (visible) {
      // Reset position before starting the animation
      slideAnim.setValue(height);
      backdropOpacity.setValue(0);
      
      // Start animations
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
  }, [visible, slideAnim, backdropOpacity]);
  
  // Function to handle filter selection
  const handleFilterSelect = (filterType) => {
    onSelectFilter(filterType);
  };
  
  if (!visible) return null; // Don't render if not visible
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
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
                Filter Posts
              </Text>
              
              {/* Filter options */}
              <View style={styles.optionsContainer}>
                {/* All Posts */}
                <TouchableOpacity 
                  style={[
                    styles.optionItem, 
                    { borderBottomColor: colors.border, borderBottomWidth: 0.5 }
                  ]}
                  onPress={() => handleFilterSelect('all')}
                >
                  <View style={styles.optionIconContainer}>
                    <View style={[
                      styles.optionIcon, 
                      { backgroundColor: colors.allPostsColor }
                    ]}>
                      <FontAwesome name="globe" size={18} color="#FFF" />
                    </View>
                  </View>
                  
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: colors.text }]}>
                      All Posts
                    </Text>
                    <Text style={[styles.optionDescription, { color: colors.subtext }]}>
                      View posts from everyone
                    </Text>
                  </View>
                  
                  {currentFilter === 'all' && (
                    <Ionicons 
                      name="checkmark" 
                      size={24} 
                      color={colors.highlightBlue} 
                    />
                  )}
                </TouchableOpacity>
                
                {/* College Posts */}
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={() => handleFilterSelect('college')}
                >
                  <View style={styles.optionIconContainer}>
                    <View style={[
                      styles.optionIcon, 
                      { backgroundColor: colors.collegeColor }
                    ]}>
                      <FontAwesome name="graduation-cap" size={16} color="#FFF" />
                    </View>
                  </View>
                  
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: colors.text }]}>
                      My College
                    </Text>
                    <Text style={[styles.optionDescription, { color: colors.subtext }]}>
                      View posts from your college only
                    </Text>
                  </View>
                  
                  {currentFilter === 'college' && (
                    <Ionicons 
                      name="checkmark" 
                      size={24} 
                      color={colors.highlightBlue} 
                    />
                  )}
                </TouchableOpacity>
              </View>
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
    paddingBottom: 36, // Extra padding at the bottom for devices with home indicator
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
  optionsContainer: {
    width: '100%',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  optionIconContainer: {
    marginRight: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
});

export default AllPostFilterModel;
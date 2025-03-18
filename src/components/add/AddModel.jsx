import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const AddModel = ({ isVisible, onClose }) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
  };

  const addOptions = [
    {
      icon: 'add-outline',
      label: 'Create Post',
      onPress: () => {
        onClose();
        navigation.navigate('CreatePost');
      },
    },
    {
      icon: 'school-outline',
      label: 'Go to College Confession',
      onPress: () => {
        onClose();
        navigation.navigate('CollegeConfession');
      },
    },
    {
      icon: 'chatbubble-outline',
      label: 'Chat with AI',
      onPress: () => {
        onClose();
        navigation.navigate('AIChat');
      },
    },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View 
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
            
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={[styles.headerText, { color: colors.text }]}>
                Create
              </Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {addOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    index !== addOptions.length - 1 && { 
                      borderBottomWidth: 0.5, 
                      borderBottomColor: colors.border 
                    }
                  ]}
                  onPress={option.onPress}
                >
                  <Ionicons name={option.icon} size={24} color={colors.text} />
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.35, // Reduced height since we removed the cancel button
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  modalContent: {
    flex: 1,
    paddingBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default AddModel;
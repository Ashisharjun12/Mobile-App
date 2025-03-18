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
  ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LogoutButton from '../common/LogoutButton';

const { height } = Dimensions.get('window');

const SettingModal = ({ isVisible, onClose }) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    cardBackground: isDark ? '#1E1E1E' : '#F5F5F5',
    danger: '#FF3B30',
    modalBackground: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: 'lock-closed-outline',
          label: 'Password & Security',
          onPress: () => {
            onClose();
            navigation.navigate('Password');
          },
        },
        {
          icon: 'person-outline',
          label: 'Personal Details',
          onPress: () => {
            onClose();
            navigation.navigate('PersonalDetails');
          },
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Privacy',
          onPress: () => {
            onClose();
            navigation.navigate('Privacy');
          },
        },
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: 'color-palette-outline',
          label: 'Appearance',
          onPress: () => {
            onClose();
            navigation.navigate('Theme');
          },
        },
        {
          icon: 'notifications-outline',
          label: 'Notification Settings',
          onPress: () => {
            onClose();
            navigation.navigate('Notification');
          },
        },
        {
          icon: 'bookmark-outline',
          label: 'Saved Posts',
          onPress: () => {
            onClose();
            navigation.navigate('Saved');
          },
        },
      ]
    },
    {
      title: "Data",
      items: [
        {
          icon: 'server-outline',
          label: 'Data & Storage',
          onPress: () => {
            onClose();
            navigation.navigate('DataStroage');
          },
        },
        {
          icon: 'trash-outline',
          label: 'Data Deletion Request',
          onPress: () => {
            onClose();
            navigation.navigate('DataDelete');
          },
        },
        {
          icon: 'help-circle-outline',
          label: 'Help Center',
          onPress: () => {
            onClose();
            navigation.navigate('HelpCenter');
          },
        },
      ]
    }
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
                Account Settings
              </Text>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
              {menuSections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
                    {section.title}
                  </Text>
                  <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
                    {section.items.map((item, itemIndex) => (
                      <TouchableOpacity
                        key={itemIndex}
                        style={[
                          styles.menuItem,
                          itemIndex !== section.items.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: colors.border }
                        ]}
                        onPress={item.onPress}
                      >
                        <Ionicons name={item.icon} size={22} color={colors.text} />
                        <Text style={[styles.menuText, { color: colors.text }]}>
                          {item.label}
                        </Text>
                        <Ionicons 
                          name="chevron-forward" 
                          size={18} 
                          color={colors.subtext} 
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              {/* Logout Button */}
              <View style={styles.logoutContainer}>
                <LogoutButton customStyle={styles.logoutButton} />
              </View>
            </ScrollView>
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
    height: height * 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  modalContent: {
    flex: 1,
    paddingBottom: 30,
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
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionContainer: {
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
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    width: '100%',
    borderRadius: 8,
  },
});

export default SettingModal;
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleBottomSheet from '../common/SimpleBottomSheet';

const { width, height } = Dimensions.get('window');

const GenderPickerModal = ({ 
  visible, 
  onClose, 
  onSelect, 
  currentTheme,
  selectedGender 
}) => {
  const genderOptions = [
    { label: 'Male', value: 'male', icon: 'male', color: '#2563EB' },
    { label: 'Female', value: 'female', icon: 'female', color: '#EC4899' },
    { label: 'Other', value: 'other', icon: 'person', color: '#9333EA' },
    { label: 'Prefer not to say', value: 'not_specified', icon: 'shield', color: '#6B7280' },
  ];

  return (
    <SimpleBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Gender"
      currentTheme={currentTheme}
    >
      <View style={styles.sheetContent}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sheetOption,
              { backgroundColor: currentTheme.dark ? '#1E1E1E' : '#F5F5F5' },
              selectedGender === option.value && { 
                backgroundColor: option.color + '15'
              }
            ]}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <Ionicons 
              name={option.icon} 
              size={24} 
              color={selectedGender === option.value ? option.color : currentTheme.colors.text} 
            />
            <Text style={[
              styles.sheetOptionText,
              { color: selectedGender === option.value ? option.color : currentTheme.colors.text }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: 8,
  },
  sheetOptionText: {
    marginLeft: width * 0.03,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Medium',
  },
});

export default GenderPickerModal; 
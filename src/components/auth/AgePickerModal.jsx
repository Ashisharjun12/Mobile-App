import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import SimpleBottomSheet from '../common/SimpleBottomSheet';

const { width, height } = Dimensions.get('window');

const AgePickerModal = ({ 
  visible, 
  onClose, 
  onSelect, 
  currentTheme,
  selectedAge 
}) => {
  const ages = Array.from({ length: 89 }, (_, i) => i + 12); // Ages 12-100

  return (
    <SimpleBottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Age"
      currentTheme={currentTheme}
    >
      <ScrollView 
        style={styles.ageScrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetContent}>
          {ages.map((age) => (
            <TouchableOpacity
              key={age}
              style={[
                styles.ageOption,
                { backgroundColor: currentTheme.dark ? '#1E1E1E' : '#F5F5F5' },
                selectedAge === age && { 
                  backgroundColor: '#2563EB15'
                }
              ]}
              onPress={() => {
                onSelect(age);
                onClose();
              }}
            >
              <Text style={[
                styles.ageText,
                { color: selectedAge === age ? '#2563EB' : currentTheme.colors.text }
              ]}>
                {age} years
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  ageScrollView: {
    maxHeight: height * 0.6,
  },
  sheetContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  ageOption: {
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: 8,
  },
  ageText: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
});

export default AgePickerModal; 
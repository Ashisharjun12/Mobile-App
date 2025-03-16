import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GenderPickerModal from '../GenderPickerModal';
import AgePickerModal from '../AgePickerModal';

const { width, height } = Dimensions.get('window');

const Step3 = ({ currentTheme, onNext, onBottomSheetChange, gender, age, onSelectGender, onSelectAge }) => {
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male', icon: 'male', color: '#2563EB' },
    { label: 'Female', value: 'female', icon: 'female', color: '#EC4899' },
    { label: 'Other', value: 'other', icon: 'person', color: '#9333EA' },
    { label: 'Prefer not to say', value: 'not_specified', icon: 'shield', color: '#6B7280' },
  ];

  useEffect(() => {
    onBottomSheetChange(showGenderModal || showAgeModal);
  }, [showGenderModal, showAgeModal]);

  const handleGenderSelect = (selectedGender) => {
    console.log("Selected gender:", selectedGender);
    onSelectGender(selectedGender);
  };

  const handleAgeSelect = (selectedAge) => {
    console.log("Selected age:", selectedAge);
    onSelectAge(selectedAge);
  };

  const handleContinue = () => {
    console.log("Step3 - Continuing with gender:", gender, "and age:", age);
    onNext();
  };

  return (
    <Animated.View 
      entering={FadeInRight}
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background }
      ]}
    >
      <Text style={[styles.title, { color: currentTheme.colors.text }]}>
        Personal Details
      </Text>
      <Text style={[styles.subtitle, { color: currentTheme.colors.text + '80' }]}>
        Tell us a bit about yourself
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option, 
            { backgroundColor: currentTheme.colors.card }
          ]}
          onPress={() => setShowGenderModal(true)}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionLabel, { color: currentTheme.colors.text }]}>
              Gender
            </Text>
            <Text 
              style={[
                styles.optionValue, 
                { 
                  color: gender ? 
                    genderOptions.find(opt => opt.value === gender)?.color : 
                    currentTheme.colors.text + '80'
                }
              ]}
            >
              {gender ? 
                genderOptions.find(opt => opt.value === gender)?.label : 
                'Select gender'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option, 
            { backgroundColor: currentTheme.colors.card }
          ]}
          onPress={() => setShowAgeModal(true)}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionLabel, { color: currentTheme.colors.text }]}>
              Age
            </Text>
            <Text style={[styles.optionValue, { color: age ? '#2563EB' : currentTheme.colors.text + '80' }]}>
              {age ? `${age} years` : 'Select age'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
      </View>

      {gender && age && !showGenderModal && !showAgeModal && (
        <Animated.View 
          entering={FadeInDown}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: '#2563EB' }]}
            onPress={handleContinue}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <GenderPickerModal
        visible={showGenderModal}
        onClose={() => setShowGenderModal(false)}
        onSelect={handleGenderSelect}
        currentTheme={currentTheme}
        selectedGender={gender}
      />

      <AgePickerModal
        visible={showAgeModal}
        onClose={() => setShowAgeModal(false)}
        onSelect={handleAgeSelect}
        currentTheme={currentTheme}
        selectedAge={age}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.04,
  },
  optionsContainer: {
    gap: height * 0.02,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.04,
    borderRadius: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: height * 0.05,
    left: width * 0.05,
    right: width * 0.05,
  },
  nextButton: {
    height: width * 0.13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
  },
});

export default Step3;
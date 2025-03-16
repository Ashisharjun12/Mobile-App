import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import Animated, { 
  FadeInRight,
  FadeOutLeft 
} from 'react-native-reanimated';
import Input from '../../common/Input';

const { width, height } = Dimensions.get('window');

const Step2 = ({ 
  currentTheme, 
  username, 
  setUsername, 
  isGenerating, 
  handleGenerateUsername,
  onNext 
}) => {
  return (
    <Animated.View 
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          Create username
        </Text>

        <View style={styles.inputSection}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={currentTheme.colors.text + '80'}
            style={[
              styles.input, 
              { 
                color: currentTheme.colors.text,
                backgroundColor: currentTheme.colors.card 
              }
            ]}
          />

          <TouchableOpacity 
            style={[
              styles.generateButton,
              { backgroundColor: '#2563EB20' }
            ]}
            onPress={handleGenerateUsername}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#2563EB" size="small" />
            ) : (
              <Text style={[styles.generateText, { color: '#2563EB' }]}>
                ↻ Generate username
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {username && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  content: {
    flex: 1,
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.04,
  },
  inputSection: {
    width: '100%',
  },
  input: {
    height: width * 0.13,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Medium',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: height * 0.02,
  },
  generateButton: {
    height: width * 0.11,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.06,
    alignSelf: 'center',
  },
  generateText: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-SemiBold',
  },
  nextButton: {
    backgroundColor: '#2563EB',
    height: width * 0.13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
  },
});

export default Step2;
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const Step5 = ({ currentTheme, email, setEmail, onNext }) => {
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const isDarkMode = currentTheme.dark;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          entering={FadeInRight}
          style={[
            styles.container,
            { backgroundColor: currentTheme.colors.background }
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: currentTheme.colors.text }]}>
              What's your email?
            </Text>
            <Text style={[styles.subtitle, { color: currentTheme.colors.text + '80' }]}>
              We'll use this to verify your account and for important notifications
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: error ? '#EF4444' : 
                               isFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                               isDarkMode ? '#555555' : currentTheme.colors.border,
                    borderWidth: 1
                  }
                ]}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color={error ? '#EF4444' : 
                           isFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                           isDarkMode ? '#DDDDDD' : '#555555'} 
                  />
                  <TextInput
                    style={[styles.input, { color: currentTheme.colors.text }]}
                    placeholder="Enter your email address"
                    placeholderTextColor={currentTheme.colors.text + '60'}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  {email.length > 0 && (
                    <TouchableOpacity onPress={() => setEmail('')}>
                      <Ionicons 
                        name="close-circle" 
                        size={20} 
                        color={isDarkMode ? '#DDDDDD' : '#555555'} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  <View style={styles.helperTextContainer}>
                    <Text style={[styles.helperText, { color: currentTheme.colors.text + '60' }]}>
                      We'll never share your email with anyone else
                    </Text>
                    <Text style={[styles.verificationText, { color: isDarkMode ? '#90CAF9' : '#2563EB' }]}>
                      We'll send you a verification code
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <Animated.View 
            entering={FadeInDown}
            style={styles.buttonWrapper}
          >
            <TouchableOpacity
              style={[
                styles.nextButton, 
                { 
                  backgroundColor: email.trim() ? '#2563EB' : '#2563EB80',
                  opacity: email.trim() ? 1 : 0.7
                }
              ]}
              onPress={handleContinue}
              disabled={!email.trim()}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingTop: height * 0.02,
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
  formContainer: {
    marginTop: height * 0.02,
  },
  inputGroup: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: width * 0.14,
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    marginLeft: width * 0.02,
  },
  errorText: {
    color: '#EF4444',
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginTop: 5,
    marginLeft: 5,
  },
  helperTextContainer: {
    marginTop: 5,
    marginLeft: 5,
  },
  helperText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginBottom: 4,
  },
  verificationText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-SemiBold',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: height * 0.05,
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

export default Step5;
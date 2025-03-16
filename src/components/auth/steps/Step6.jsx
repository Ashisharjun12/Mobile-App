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
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const Step6 = ({ currentTheme, onNext, username, email, avatarStyle, gender, age, selectedCollege, isRegistering }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  
  const isDarkMode = currentTheme.dark;

  const validatePassword = () => {
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleContinue = () => {
    if (validatePassword()) {
      console.log("Password validated, proceeding with registration");
      
      // Create the complete registration data object
      const registrationData = {
        username,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/${avatarStyle}/png?seed=${username}`,
        gender,
        age: age ? parseInt(age) : null,
        college: selectedCollege ? selectedCollege.id : null
      };
      
      console.log("Registration data:", {
        ...registrationData,
        password: "********" // Mask password in logs
      });
      
      setError('');
      onNext(password); // Pass the password to the parent component
    }
  };

  // Check if password meets requirements
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const passwordsMatch = password === confirmPassword && password.length > 0;

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
              Create a password
            </Text>
            <Text style={[styles.subtitle, { color: currentTheme.colors.text + '80' }]}>
              Create a secure password to protect your account
            </Text>

            <View style={styles.formContainer}>
              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: error && !passwordFocused ? '#EF4444' : 
                               passwordFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                               isDarkMode ? '#555555' : currentTheme.colors.border,
                    borderWidth: 1
                  }
                ]}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={error && !passwordFocused ? '#EF4444' : 
                           passwordFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                           isDarkMode ? '#DDDDDD' : '#555555'} 
                  />
                  <TextInput
                    style={[styles.input, { color: currentTheme.colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={currentTheme.colors.text + '60'}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError('');
                    }}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Ionicons 
                      name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={isDarkMode ? '#DDDDDD' : '#555555'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputContainer, 
                  { 
                    backgroundColor: currentTheme.colors.card,
                    borderColor: error && !confirmPasswordFocused ? '#EF4444' : 
                               confirmPasswordFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                               isDarkMode ? '#555555' : currentTheme.colors.border,
                    borderWidth: 1
                  }
                ]}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={error && !confirmPasswordFocused ? '#EF4444' : 
                           confirmPasswordFocused ? (isDarkMode ? '#FFFFFF' : '#2563EB') : 
                           isDarkMode ? '#DDDDDD' : '#555555'} 
                  />
                  <TextInput
                    style={[styles.input, { color: currentTheme.colors.text }]}
                    placeholder="Confirm your password"
                    placeholderTextColor={currentTheme.colors.text + '60'}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (error) setError('');
                    }}
                    secureTextEntry={!confirmPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    <Ionicons 
                      name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={isDarkMode ? '#DDDDDD' : '#555555'} 
                    />
                  </TouchableOpacity>
                </View>
                
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  confirmPassword.length > 0 && (
                    <Text style={[
                      styles.matchText, 
                      { color: passwordsMatch ? '#4CAF50' : '#EF4444' }
                    ]}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </Text>
                  )
                )}
              </View>

              {/* Password Requirements */}
              <View style={[styles.requirementsContainer, { backgroundColor: isDarkMode ? '#333333' : '#F5F5F5' }]}>
                <Text style={[styles.requirementsTitle, { color: currentTheme.colors.text }]}>
                  Password must have:
                </Text>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={hasMinLength ? '#4CAF50' : (isDarkMode ? '#AAAAAA' : '#777777')} 
                  />
                  <Text style={[
                    styles.requirementText, 
                    { color: hasMinLength ? (isDarkMode ? '#4CAF50' : '#4CAF50') : currentTheme.colors.text + '80' }
                  ]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={(hasUpperCase && hasLowerCase) ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={(hasUpperCase && hasLowerCase) ? '#4CAF50' : (isDarkMode ? '#AAAAAA' : '#777777')} 
                  />
                  <Text style={[
                    styles.requirementText, 
                    { color: (hasUpperCase && hasLowerCase) ? (isDarkMode ? '#4CAF50' : '#4CAF50') : currentTheme.colors.text + '80' }
                  ]}>
                    Upper and lowercase letters
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={hasNumber ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={hasNumber ? '#4CAF50' : (isDarkMode ? '#AAAAAA' : '#777777')} 
                  />
                  <Text style={[
                    styles.requirementText, 
                    { color: hasNumber ? (isDarkMode ? '#4CAF50' : '#4CAF50') : currentTheme.colors.text + '80' }
                  ]}>
                    At least one number
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"} 
                    size={16} 
                    color={hasSpecialChar ? '#4CAF50' : (isDarkMode ? '#AAAAAA' : '#777777')} 
                  />
                  <Text style={[
                    styles.requirementText, 
                    { color: hasSpecialChar ? (isDarkMode ? '#4CAF50' : '#4CAF50') : currentTheme.colors.text + '80' }
                  ]}>
                    At least one special character
                  </Text>
                </View>
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
                  backgroundColor: (password.length >= 8 && passwordsMatch) ? '#2563EB' : '#2563EB80',
                  opacity: (password.length >= 8 && passwordsMatch) ? 1 : 0.7
                }
              ]}
              onPress={handleContinue}
              disabled={!(password.length >= 8 && passwordsMatch) || isRegistering}
            >
              {isRegistering ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.nextButtonText}>Create Account</Text>
              )}
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
  matchText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginTop: 5,
    marginLeft: 5,
  },
  requirementsContainer: {
    padding: width * 0.04,
    borderRadius: 12,
    marginTop: height * 0.01,
    marginBottom: height * 0.02,
  },
  requirementsTitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: height * 0.01,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.005,
  },
  requirementText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginLeft: width * 0.02,
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

export default Step6;
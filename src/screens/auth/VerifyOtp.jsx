import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../utils/context/ThemeContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { userApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';

const { width, height } = Dimensions.get('window');
const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentTheme } = useTheme();
  const { email, response } = route.params || {};
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const isDarkMode = currentTheme.dark;
  
  // Get the register user function from Zustand store
  const registerUser = useUserAuthStore(state => state.registerUser);

  useEffect(() => {
    // Focus the input when the screen loads
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    // Start the timer
    startTimer();

    // Log the token for debugging
    console.log("Email received in VerifyOtp:", email);
    console.log("Token received in VerifyOtp:", response?.activationToken?.token);

    return () => {
      // Clear the timer when the component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setTimer(30);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text) => {
    // Only allow numbers and limit to OTP_LENGTH
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(formattedText);
    setError('');

    // Auto-submit when OTP is complete
    if (formattedText.length === OTP_LENGTH) {
      Keyboard.dismiss();
    }
  };

  // Handle clicking on a specific OTP box
  const handleOtpBoxClick = (index) => {
    // Ensure the input is focused and keyboard appears
    if (inputRef.current) {
      // Force keyboard to show by focusing with a slight delay
      setTimeout(() => {
        inputRef.current.focus();
        
        // If we're clicking on a box that already has a value, we want to replace it
        // So we'll set the selection to that specific position
        if (index < otp.length) {
          inputRef.current.setSelection(index, index + 1);
        }
      }, 50);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    setError('');
    
    try {
      // Call the API to resend OTP
      // This would typically be a call to re-register or request a new OTP
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call
      
      setSuccess('OTP resent successfully!');
      startTimer();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`);
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Call the API to verify OTP
      const verifyData = {
        email,
        otp,
        token: response?.activationToken?.token // Make sure we're using the correct token path
      };
      
      console.log('Verifying OTP with data:', verifyData);
      
      // Call the actual API
      const verifyResponse = await userApi.verifyEmail(verifyData);
      console.log('Verification response:', verifyResponse);
      
      setSuccess('Account verified successfully!');
      
      // Check if we have the expected data in the response
      if (verifyResponse.success && verifyResponse.accessToken) {
        console.log('Storing user data:', verifyResponse.data);
        console.log('Storing access token:', verifyResponse.accessToken);
        
        // Register user in Zustand store with the correct data structure
        registerUser(verifyResponse.data, verifyResponse.accessToken);
        
        // Navigate to the home screen after successful verification
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          });
        }, 1000);
      } else {
        console.error('Invalid or unexpected response structure:', verifyResponse);
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    const otpArray = otp.split('');

    for (let i = 0; i < OTP_LENGTH; i++) {
      boxes.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleOtpBoxClick(i)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.otpBox,
              {
                backgroundColor: isDarkMode ? '#2A2A2A' : '#F5F5F5',
                borderColor: otpArray[i] 
                  ? (isDarkMode ? '#FFFFFF' : '#2563EB')
                  : (isDarkMode ? '#555555' : '#E5E7EB')
              }
            ]}
          >
            <Text
              style={[
                styles.otpText,
                { color: currentTheme.colors.text }
              ]}
            >
              {otpArray[i] || ''}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return boxes;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={isVerifying}
          >
            <Ionicons
              name="arrow-back-sharp"
              size={24}
              color={currentTheme.colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
            Verify Email
          </Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.View
          entering={FadeInDown.duration(800).springify()}
          style={styles.content}
        >
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            Enter verification code
          </Text>
          
          <Text style={[styles.subtitle, { color: currentTheme.colors.text + '80' }]}>
            We've sent a 6-digit code to{' '}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <View style={styles.otpContainer}>
            <View style={styles.otpBoxesContainer}>
              {renderOtpBoxes()}
            </View>
            
            <TextInput
              ref={inputRef}
              style={[styles.hiddenInput, { height: 50 }]}
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              caretHidden={true}
              selection={{start: otp.length, end: otp.length}}
              showSoftInputOnFocus={true}
            />
          </View>

          {error ? (
            <Animated.Text
              entering={FadeIn}
              style={styles.errorText}
            >
              {error}
            </Animated.Text>
          ) : success ? (
            <Animated.Text
              entering={FadeIn}
              style={styles.successText}
            >
              {success}
            </Animated.Text>
          ) : null}

          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: currentTheme.colors.text + '80' }]}>
              {timer > 0 ? `Resend code in ${timer}s` : 'Didn\'t receive the code?'}
            </Text>
            
            {timer === 0 && (
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={isResending}
                style={styles.resendButton}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <Text style={styles.resendText}>Resend</Text>
                )}
              </TouchableOpacity>
            )}
    </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: otp.length === OTP_LENGTH ? '#2563EB' : '#2563EB80',
                opacity: otp.length === OTP_LENGTH ? 1 : 0.7
              }
            ]}
            onPress={handleVerifyOtp}
            disabled={otp.length !== OTP_LENGTH || isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    height: width * 0.15,
    marginTop: height * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontFamily: 'Nunito-Bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: width * 0.02,
    width: width * 0.1,
  },
  placeholder: {
    width: width * 0.1,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.04,
    textAlign: 'center',
    paddingHorizontal: width * 0.1,
  },
  emailText: {
    fontFamily: 'Nunito-Bold',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.03,
    position: 'relative',
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: height * 0.02,
  },
  otpBox: {
    width: width * 0.12,
    height: width * 0.14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  otpText: {
    fontSize: width * 0.06,
    fontFamily: 'Nunito-Bold',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: 50,
    top: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  successText: {
    color: '#10B981',
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  timerText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
  },
  resendButton: {
    marginLeft: width * 0.02,
    padding: width * 0.01,
  },
  resendText: {
    color: '#2563EB',
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Bold',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.05,
  },
  verifyButton: {
    height: width * 0.13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
  },
});

export default VerifyOtp;
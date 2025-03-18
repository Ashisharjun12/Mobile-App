import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../utils/context/ThemeContext';
import Animated, { 
  FadeInDown, 
  FadeInUp 
} from 'react-native-reanimated';
import Input from '../../components/common/Input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { userApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const { currentTheme, isDarkTheme } = useTheme();
  const loginUser = useUserAuthStore(state => state.loginUser);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email or username');
      return false;
    }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Determine if input is email or username
      const isEmail = email.includes('@');
      const loginData = isEmail 
        ? { email: email.trim(), password } 
        : { username: email.trim(), password };
      
      console.log('Attempting login with:', { ...loginData, password: '********' });
      
      // Call login API
      const response = await userApi.loginUser(loginData);
      console.log('Login successful:', response);
      
      if (response.success) {
        // Get user data from response.data
        const userData = response.data;
        
        // Store access token in user object for later API calls
        userData.accessToken = response.accessToken;
        
        // IMPORTANT: We're storing the refresh token as the main token in Zustand
        // This way we don't need to change the auth store structure
        loginUser(userData, response.refreshToken);
        
        console.log('User data stored in Zustand:', {
          userData: userData,
          token: response.refreshToken, // Using refresh token as the main token
          accessToken: response.accessToken // Stored inside userData
        });
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        // Handle unexpected response format
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // The server responded with an error status code
        const message = error.response.data?.message || 'Invalid credentials';
        setError(message);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
    >
      <Animated.View 
        entering={FadeInDown.duration(1000).springify()}
        style={styles.headerContainer}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: '#2563EB' }]}>
            <Text style={styles.logoText}>IC</Text>
          </View>
        </View>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          InCampus
        </Text>
        <Text style={[styles.subtitle, { color: currentTheme.colors.text }]}>
          Sign in to Account
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.duration(1000).springify()}
        style={styles.formContainer}
      >
        <Input
          placeholder="Email or Username"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(''); // Clear error on input change
          }}
          keyboardType={email.includes('@') ? "email-address" : "default"}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError(''); // Clear error on input change
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
              size={24} 
              color={isDarkTheme ? '#6B7280' : '#9CA3AF'} 
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.forgotText, { color: '#2563EB' }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: '#2563EB' },
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: currentTheme.colors.text }]}>
            New to InCampus?
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            style={styles.createAccountButton}
            disabled={isLoading}
          >
            <Text style={styles.createAccountText}>
              Create an account
            </Text>
          </TouchableOpacity>
    </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  logoContainer: {
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: width * 0.09,
    fontFamily: 'Nunito-ExtraBold',
    includeFontPadding: false,
  },
  title: {
    fontSize: width * 0.08,
    fontFamily: 'Nunito-ExtraBold',
    marginBottom: height * 0.01,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito-SemiBold',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  formContainer: {
    width: width,
    alignItems: 'center',
  },
  passwordContainer: {
    width: width * 0.9,
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: width * 0.04,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: width * 0.02,
  },
  errorContainer: {
    width: width * 0.9,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Medium',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingRight: width * 0.05,
    marginTop: height * 0.01,
  },
  forgotText: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-SemiBold',
  },
  button: {
    width: width * 0.9,
    height: width * 0.13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  signupText: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.01,
  },
  createAccountButton: {
    marginTop: height * 0.01,
  },
  createAccountText: {
    color: '#2563EB',
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
    letterSpacing: 0.5,
  },
});

export default Login;
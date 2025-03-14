import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useTheme } from '../../utils/context/ThemeContext';
import Animated, { 
  FadeInDown, 
  FadeInUp 
} from 'react-native-reanimated';
import Input from '../../components/common/Input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const { currentTheme, isDarkTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
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

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.forgotText, { color: '#2563EB' }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2563EB' }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: currentTheme.colors.text }]}>
            New to InCampus?
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            style={styles.createAccountButton}
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
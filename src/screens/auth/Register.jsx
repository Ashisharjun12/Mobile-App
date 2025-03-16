import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../utils/context/ThemeContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { generateUsername, userApi } from '../../api/api';
import Step1 from '../../components/auth/steps/Step1';
import Step2 from '../../components/auth/steps/Step2';
import Step3 from '../../components/auth/steps/Step3';
import Step4 from '../../components/auth/steps/Step4';
import Step5 from '../../components/auth/steps/Step5';
import Step6 from '../../components/auth/steps/Step6';

const { width, height } = Dimensions.get('window');

const Register = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [avatarStyle, setAvatarStyle] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [username, setUsername] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');

  const handleGenerateUsername = async () => {
    setIsGenerating(true);
    try {
      const response = await generateUsername();
      setUsername(response.username);
    } catch (error) {
      console.error('Error generating username:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAvatarSelect = (style) => {
    setAvatarStyle(style);
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/png?seed=${style}`;
    setSelectedAvatarUrl(avatarUrl);
  };

  const handleBottomSheetState = (isOpen) => {
    setIsBottomSheetOpen(isOpen);
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleAgeSelect = (selectedAge) => {
    setAge(selectedAge);
  };

  useEffect(() => {
    handleGenerateUsername();
  }, []);

  const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        onPress={() => {
          if (step > 1) {
            setStep(step - 1);
          } else {
            navigation.goBack();
          }
        }}
        style={styles.backButton}
        disabled={isRegistering}
      >
        <Ionicons 
          name="arrow-back-sharp" 
          size={24} 
          color={currentTheme.colors.text} 
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
        Create Account
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            currentTheme={currentTheme}
            avatarStyle={avatarStyle}
            handleAvatarSelect={handleAvatarSelect}
          />
        );
      case 2:
        return (
          <Step2
            currentTheme={currentTheme}
            username={username}
            setUsername={setUsername}
            isGenerating={isGenerating}
            handleGenerateUsername={handleGenerateUsername}
            onNext={() => setStep(step + 1)}
          />
        );
      case 3:
        return (
          <Step3
            currentTheme={currentTheme}
            onNext={() => setStep(step + 1)}
            onBottomSheetChange={handleBottomSheetState}
            gender={gender}
            age={age}
            onSelectGender={handleGenderSelect}
            onSelectAge={handleAgeSelect}
          />
        );
      case 4:
        return (
          <Step4
            currentTheme={currentTheme}
            onNext={() => setStep(step + 1)}
            onSelectCollege={(college) => {
              console.log("Selected college in Register:", college);
              setSelectedCollege(college);
            }}
          />
        );
      case 5:
        return (
          <Step5
            currentTheme={currentTheme}
            email={email}
            setEmail={setEmail}
            onNext={() => setStep(step + 1)}
          />
        );
      case 6:
        return (
          <Step6
            currentTheme={currentTheme}
            username={username}
            email={email}
            avatarStyle={avatarStyle}
            gender={gender}
            age={age}
            selectedCollege={selectedCollege}
            onNext={(password) => {
              console.log("Received password from Step6:", password ? "Password provided" : "No password");
              handleRegister(password);
            }}
            isRegistering={isRegistering}
          />
        );
      default:
        return null;
    }
  };

  const handleRegister = async (password) => {
    console.log("Attempting to register user with data:");
    
    // Check if password is provided
    if (!password) {
      console.error("Password is required for registration. Please use the Create Account button in the form.");
      return;
    }
    
    // Log the complete registration data
    const registrationData = {
      username,
      email,
      password, // Use the password passed from Step6
      avatar: `https://api.dicebear.com/7.x/${avatarStyle}/png?seed=${username}`,
      gender,
      age: age ? parseInt(age) : null,
      college: selectedCollege ? selectedCollege.id : null // Send only the college ID
    };
    
    console.log("Registration data:", registrationData);
    
    // Check if all required data is available
    if (!username || !email || !avatarStyle || !gender || !age || !selectedCollege) {
      console.log("Missing required data for registration:");
      console.log({
        username: username ? "✓" : "✗",
        email: email ? "✓" : "✗",
        avatarStyle: avatarStyle ? "✓" : "✗",
        gender: gender ? "✓" : "✗",
        age: age ? "✓" : "✗",
        selectedCollege: selectedCollege ? "✓" : "✗"
      });
      return;
    }
    
    // Start loading animation
    setIsRegistering(true);
    setRegistrationStatus('Creating your account...');
    
    try {
      // Call the API to register the user
      const response = await userApi.registerUser(registrationData);
      console.log("Registration data sent to API:", registrationData);
      console.log("Registration response:", response);
      console.log("Registration response:", response?.activationToken);
      
      // Show success message
      setRegistrationStatus('Account created successfully!');
      
      // Short delay to show success message
      setTimeout(() => {
        setIsRegistering(false);
        // Navigate to OTP verification
        navigation.navigate('VerifyOtp', { email ,response});
      }, 1000);
      
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationStatus('Registration failed. Please try again.');
      
      // Show error for a moment before hiding the loading screen
      setTimeout(() => {
        setIsRegistering(false);
      }, 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Header />
      
      <Animated.View 
        entering={FadeInDown.duration(1000).springify()}
        style={styles.stepIndicator}
      >
        <Text style={[styles.subtitle, { color: currentTheme.colors.text }]}>
          Step {step} of 6
        </Text>
      </Animated.View>

      {renderCurrentStep()}

      {!isBottomSheetOpen && step < 6 && (
        <Animated.View 
          entering={FadeInDown}
          style={styles.buttonContainer}
        >
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#2563EB' }]}
            onPress={() => setStep(step + 1)}
            disabled={isRegistering}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Loading Modal */}
      <Modal
        transparent={true}
        visible={isRegistering}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[
              styles.loadingContainer, 
              { backgroundColor: currentTheme.dark ? '#1E1E1E' : '#FFFFFF' }
            ]}
          >
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[
              styles.loadingText, 
              { color: currentTheme.colors.text }
            ]}>
              {registrationStatus}
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
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
  stepIndicator: {
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.04,
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    opacity: 0.7,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    width: width,
    alignItems: 'center',
  },
  button: {
    width: width * 0.9,
    height: width * 0.13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: width * 0.8,
    padding: width * 0.06,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.045,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
  },
});

export default Register;
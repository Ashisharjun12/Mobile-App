import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
  SafeAreaView
} from 'react-native';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collegeApi } from '../../../api/api';

const { width, height } = Dimensions.get('window');

const Step4 = ({ currentTheme, onNext, onSelectCollege }) => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredColleges(colleges);
    } else {
      const filtered = colleges.filter(college => 
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (college.location && college.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredColleges(filtered);
    }
  }, [searchQuery, colleges]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await collegeApi.getAllColleges();
      console.log("Fetched colleges data:", response);
      
      // Map the response data to a consistent format
      const formattedColleges = response.data || response.colleges || [];
      console.log("Number of colleges:", formattedColleges.length);
      
      // Log the first few colleges for debugging
      if (formattedColleges.length > 0) {
        console.log("Sample colleges:", formattedColleges.slice(0, 3));
      }
      
      setColleges(formattedColleges);
      setFilteredColleges(formattedColleges);
      setError(null);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Failed to load colleges. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCollegeLogoUrl = (college) => {
    if (college.logo && college.logo.length > 0 && college.logo[0].url) {
      return college.logo[0].url;
    }
    return null;
  };

  const handleSelectCollege = (college) => {
    console.log("Selected college in Step4:", college);
    console.log("College ID:", college.id);
    console.log("College name:", college.name);
    console.log("College location:", college.location);
    if (college.logo) {
      console.log("College logo:", college.logo);
    }
    
    setSelectedCollege(college);
    if (onSelectCollege) {
      onSelectCollege(college);
    }
  };

  const handleContinue = () => {
    if (selectedCollege) {
      onNext();
    }
  };

  const renderCollegeItem = ({ item }) => {
    const logoUrl = getCollegeLogoUrl(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.collegeItem,
          { 
            backgroundColor: currentTheme.colors.card,
            borderColor: selectedCollege && selectedCollege.id === item.id 
              ? '#2563EB' 
              : 'transparent'
          }
        ]}
        onPress={() => handleSelectCollege(item)}
      >
        {logoUrl ? (
          <Image 
            source={{ uri: logoUrl }} 
            style={styles.collegeLogo}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.placeholderLogo, { backgroundColor: currentTheme.colors.border }]}>
            <Text style={[styles.placeholderText, { color: currentTheme.colors.text }]}>
              {item.name.charAt(0)}
            </Text>
          </View>
        )}
        
        <View style={styles.collegeInfo}>
          <Text style={[styles.collegeName, { color: currentTheme.colors.text }]}>
            {item.name}
          </Text>
          {item.location && (
            <Text style={[styles.collegeLocation, { color: currentTheme.colors.text + '80' }]}>
              {item.location}
            </Text>
          )}
        </View>
        
        {selectedCollege && selectedCollege.id === item.id && (
          <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.colors.background }]}>
      <Animated.View 
        entering={FadeInRight}
        style={styles.container}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            Select Your College
          </Text>
          <Text style={[styles.subtitle, { color: currentTheme.colors.text + '80' }]}>
            Connect with students from your college
          </Text>

          <View style={[styles.searchContainer, { backgroundColor: currentTheme.colors.card }]}>
            <Ionicons name="search" size={20} color={currentTheme.colors.text + '80'} />
            <TextInput
              style={[styles.searchInput, { color: currentTheme.colors.text }]}
              placeholder="Search colleges..."
              placeholderTextColor={currentTheme.colors.text + '60'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={currentTheme.colors.text + '80'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={[styles.loadingText, { color: currentTheme.colors.text }]}>
                Loading colleges...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={40} color="#EF4444" />
              <Text style={[styles.errorText, { color: currentTheme.colors.text }]}>
                {error}
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchColleges}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredColleges.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="school" size={40} color={currentTheme.colors.text + '60'} />
              <Text style={[styles.emptyText, { color: currentTheme.colors.text }]}>
                No colleges found matching your search
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredColleges}
              renderItem={renderCollegeItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.collegeList}
            />
          )}
    </View>

        <View style={styles.spacer} />

        {selectedCollege && (
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
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    display: 'flex',
    flexDirection: 'column',
  },
  headerSection: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    fontFamily: 'Nunito-Bold',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
    marginBottom: height * 0.03,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    height: width * 0.12,
    borderRadius: 12,
    marginBottom: height * 0.02,
  },
  searchInput: {
    flex: 1,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Regular',
  },
  listContainer: {
    flex: 1,
    marginBottom: height * 0.02,
  },
  collegeList: {
    paddingBottom: height * 0.1,
  },
  collegeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  collegeLogo: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 8,
    marginRight: width * 0.03,
  },
  placeholderLogo: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 8,
    marginRight: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: width * 0.06,
    fontFamily: 'Nunito-Bold',
  },
  collegeInfo: {
    flex: 1,
  },
  collegeName: {
    fontSize: width * 0.045,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  collegeLocation: {
    fontSize: width * 0.035,
    fontFamily: 'Nunito-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    fontFamily: 'Nunito-Medium',
    textAlign: 'center',
  },
  spacer: {
    height: height * 0.01, // Add extra space between list and button
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

export default Step4;
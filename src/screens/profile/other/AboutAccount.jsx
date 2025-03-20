import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { userApi } from '../../../api/api';

const AboutAccount = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { userId, username } = route.params || {};
  const [userProfile, setUserProfile] = useState(route.params?.userProfile || null);
  const [loading, setLoading] = useState(!userProfile);
  
  // Updated theme colors with more subtle borders and backgrounds for light mode
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    card: isDark ? '#1E1E1E' : '#FFFFFF', // Changed light mode card to pure white
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#333333' : '#EFEFEF', // Lighter border for light mode
    shadowColor: isDark ? '#000000' : '#BBBBBB', // Lighter shadow for light mode
    primary: '#0095F6',
  };
  
  // Fetch user profile if not provided in route params
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userProfile && userId) {
        setLoading(true);
        try {
          const response = await userApi.getUserProfile(userId);
          if (response && response.data) {
            setUserProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [userId, userProfile]);
  
  // Handle back button
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.background, 
        borderBottomColor: colors.border
      }]}>
        <TouchableOpacity 
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          About this account
        </Text>
        <View style={styles.headerRight} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* User basic info */}
          <View style={[
            styles.userSection, 
            { 
              backgroundColor: colors.card,
              shadowColor: colors.shadowColor,
              borderColor: colors.border,
            }
          ]}>
            <View style={styles.profileHeader}>
              {/* User avatar */}
              {userProfile?.avatar ? (
                <Image 
                  source={{ uri: userProfile.avatar }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
                  <Text style={styles.avatarText}>
                    {userProfile?.username?.[0]?.toUpperCase() || username?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
              
              <View style={styles.nameContainer}>
                <View style={styles.nameRow}>
                  <Text style={[styles.username, { color: colors.text }]}>
                    {userProfile?.username || username}
                  </Text>
                  
                  {userProfile?.verifiedBadge && (
                    <MaterialCommunityIcons 
                      name="check-decagram" 
                      size={18} 
                      color={colors.primary} 
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                
                {userProfile?.bio && (
                  <Text style={[styles.bio, { color: colors.subtext }]} numberOfLines={2}>
                    {userProfile.bio}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Account information */}
          <View style={[
            styles.infoSection, 
            { 
              backgroundColor: colors.card,
              shadowColor: colors.shadowColor,
              borderColor: colors.border,
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account information</Text>
            
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Member since</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatDate(userProfile?.createdAt)}
              </Text>
            </View>
            
            {userProfile?.age && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.subtext }]}>Age</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {userProfile.age}
                </Text>
              </View>
            )}
            
            {/* Gender with updated styling */}
            {userProfile?.gender && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.infoLabel, { color: colors.subtext }]}>Gender</Text>
                <View style={[
                  styles.genderBadge, 
                  { 
                    backgroundColor: 
                      userProfile.gender.toLowerCase() === 'male' ? 'rgba(52, 152, 219, 0.08)' : 
                      userProfile.gender.toLowerCase() === 'female' ? 'rgba(232, 67, 147, 0.08)' : 
                      userProfile.gender.toLowerCase() === 'other' ? 'rgba(155, 89, 182, 0.08)' : 
                      'rgba(149, 165, 166, 0.08)'  // Made backgrounds more subtle
                  }
                ]}>
                  <Text style={[
                    styles.genderText,
                    {
                      color: 
                        userProfile.gender.toLowerCase() === 'male' ? '#3498db' : 
                        userProfile.gender.toLowerCase() === 'female' ? '#e84393' : 
                        userProfile.gender.toLowerCase() === 'other' ? '#9b59b6' : 
                        '#95a5a6'
                    }
                  ]}>
                    {userProfile.gender}
                  </Text>
                </View>
              </View>
            )}
          </View>
          
          {/* College information with logo */}
          {userProfile?.collegeName && (
            <View style={[
              styles.infoSection, 
              { 
                backgroundColor: colors.card,
                shadowColor: colors.shadowColor,
                borderColor: colors.border,
              }
            ]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Education</Text>
              
              <View style={styles.collegeContainer}>
                {userProfile.collegeLogo && userProfile.collegeLogo.length > 0 ? (
                  <Image 
                    source={{ uri: userProfile.collegeLogo[0].url }} 
                    style={styles.collegeLogo}
                  />
                ) : (
                  <View style={[styles.collegeLogoPlaceholder, { backgroundColor: 'rgba(150, 150, 150, 0.08)' }]}>
                    <Ionicons 
                      name="school-outline" 
                      size={18} 
                      color={colors.subtext} 
                    />
                  </View>
                )}
                
                <View style={styles.collegeDetails}>
                  <View style={styles.infoRowNoBottom}>
                    <Text style={[styles.infoLabel, { color: colors.subtext }]}>College</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {userProfile.collegeName}
                    </Text>
                  </View>
                  
                  {userProfile.collegeLocation && (
                    <View style={styles.infoRowNoBottom}>
                      <Text style={[styles.infoLabel, { color: colors.subtext }]}>Location</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {userProfile.collegeLocation}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
    </View>
          )}
          
          {/* Stats information */}
          <View style={[
            styles.infoSection, 
            { 
              backgroundColor: colors.card,
              shadowColor: colors.shadowColor,
              borderColor: colors.border,
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Stats</Text>
            
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Followers</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {userProfile?.followerCount || 0}
              </Text>
            </View>
            
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoLabel, { color: colors.subtext }]}>Following</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {userProfile?.followingCount || 0}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  userSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Updated shadow for better Threads-like appearance
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0, // Removed border
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 18,
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Updated shadow for better Threads-like appearance
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 0, // Removed border
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  infoRowNoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  genderBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  collegeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    marginTop: 4,
  },
  collegeLogo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 14,
  },
  collegeLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collegeDetails: {
    flex: 1,
  }
});

export default AboutAccount;
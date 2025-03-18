import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { userApi } from '../../api/api';
import { useUserAuthStore } from '../../store/auth-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Navigate from '../common/Navigate';
import PersonalDetailsSkeleton from '../skeleton/PersonalDetailsSkeleton';

const PersonalDetails = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDark = useColorScheme() === 'dark';
  const user = useUserAuthStore(state => state.user);

  // Theme colors
  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    text: isDark ? '#E1E1E1' : '#000000',
    subtext: isDark ? '#9E9E9E' : '#666666',
    border: isDark ? '#2A2A2A' : '#F5F5F5',
    card: isDark ? '#121212' : '#FFFFFF',
    primary: '#0095F6',
    badge: isDark ? '#2A6EC7' : '#0095F6',
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const response = await userApi.getUserProfile(user?.id);
        if (response && response.data) {
          console.log('User details:', response.data);
          setUserDetails(response.data);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  // Group data into sections for display
  const renderDetailItem = (label, value, icon) => {
    if (value === undefined || value === null) return null;
    
    return (
      <View style={styles.detailItem}>
        <View style={styles.detailIcon}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.detailContent}>
          <Text style={[styles.detailLabel, { color: colors.subtext }]}>{label}</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
        </View>
      </View>
    );
  };

  const renderSectionTitle = (title) => (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navigate title="Personal Details" />
        <PersonalDetailsSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navigate title="Personal Details" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => setLoading(true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Navigate title="Personal Details" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>No user details found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Navigate title="Personal Details" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: userDetails.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.usernameContainer}>
            <Text style={[styles.username, { color: colors.text }]}>
              {userDetails.username}
            </Text>
            {userDetails.verifiedBadge && (
              <MaterialCommunityIcons 
                name="check-decagram" 
                size={18} 
                color={colors.primary} 
                style={{ marginLeft: 6 }}
              />
            )}
          </View>
          <Text style={[styles.bio, { color: colors.subtext }]}>
            {userDetails.bio || "No bio added yet"}
          </Text>
        </View>

        {/* Stats Section - Instagram style */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{userDetails.postsCount || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Posts</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{userDetails.followerCount || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Followers</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{userDetails.followingCount || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Following</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Basic Info Section */}
        <View style={styles.section}>
          {renderSectionTitle("Basic Information")}
          {renderDetailItem("Full Name", userDetails.username, "person-outline")}
          {renderDetailItem("Email", userDetails.email, "mail-outline")}
          {renderDetailItem("Gender", userDetails.gender ? userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : "Not specified", "male-female-outline")}
          {renderDetailItem("Age", userDetails.age ? `${userDetails.age} years` : "Not specified", "calendar-outline")}
        </View>

        {/* College Info Section */}
        <View style={styles.section}>
          {renderSectionTitle("College Information")}
          {renderDetailItem("College", userDetails.collegeName, "school-outline")}
          {renderDetailItem("Location", userDetails.collegeLocation, "location-outline")}
        </View>

        {/* Account Info Section */}
        <View style={styles.section}>
          {renderSectionTitle("Account Information")}
          {renderDetailItem("Account Status", userDetails.status ? userDetails.status.charAt(0).toUpperCase() + userDetails.status.slice(1) : "Active", "checkmark-circle-outline")}
          {renderDetailItem("Role", userDetails.role ? userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1) : "User", "person-circle-outline")}
          {renderDetailItem("Direct Messages", userDetails.allowDMs ? "Enabled" : "Disabled", "chatbubble-outline")}
          {renderDetailItem("Joined", new Date(userDetails.createdAt).toLocaleDateString(), "time-outline")}
          {renderDetailItem("Last Active", new Date(userDetails.lastActive).toLocaleDateString(), "time-outline")}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  bio: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  // Instagram-style stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
  },
  detailIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PersonalDetails;
import React from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../utils/context/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../../components/BottomNav/Home';
import Search from '../../components/BottomNav/Search';
import AddPost from '../../components/BottomNav/AddPost';
import Confession from '../../components/BottomNav/Confession';
import Account from '../../components/BottomNav/Account';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassButton from '../../components/common/GlassButton';
import { useUserAuthStore } from '../../store/auth-store';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress, currentTheme }) => {
  return (
    <GlassButton
      style={[
        styles.addPostButton,
        { 
          shadowColor: currentTheme.dark ? '#000' : '#888',
        }
      ]}
      onPress={onPress}
      currentTheme={currentTheme}
    >
      {children}
    </GlassButton>
  );
};

const MainApp = () => {
  const { currentTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const user = useUserAuthStore(state => state.user);
  
  const isDark = currentTheme.dark;
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#121212' : '#ffffff',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          height: 65 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
        },
        tabBarActiveTintColor: isDark ? '#ffffff' : '#000000',
        tabBarInactiveTintColor: isDark ? '#888888' : '#888888',
        tabBarItemStyle: {
          borderTopWidth: 0,
        },
      }}
      initialRouteName="HomeTab"
    >
      <Tab.Screen 
        name="HomeTab" 
        component={Home} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="home" 
                size={28}
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={Search} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="search" 
                size={28}
                color={color} 
              />
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="AddPostTab" 
        component={AddPost} 
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="plus" 
                size={26}
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </View>
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} currentTheme={currentTheme} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="ConfessionTab" 
        component={Confession} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Feather 
                name="message-circle" 
                size={28}
                color={color} 
              />
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="AccountTab" 
        component={Account} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              {user && user.avatar ? (
                <View 
                  style={[
                    styles.avatarContainer,
                    {
                      borderColor: isDark 
                        ? focused ? '#ffffff' : 'rgba(255, 255, 255, 0.3)' 
                        : focused ? '#000000' : 'rgba(0, 0, 0, 0.2)',
                      borderWidth: focused ? 2 : 1,
                    }
                  ]}
                >
                  <Image 
                    source={{ uri: user.avatar }} 
                    style={styles.avatar} 
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <Feather 
                  name="user" 
                  size={28}
                  color={color} 
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  addPostButton: {
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 12, 
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});

export default MainApp;
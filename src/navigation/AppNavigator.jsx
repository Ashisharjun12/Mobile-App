import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from './AuthNavigator'
import { useUserAuthStore } from '../store/auth-store'
import { ActivityIndicator, View } from 'react-native'
import MainApp from '../screens/home/MainApp'
import Theme from '../components/setting/Theme'
import Password from '../components/setting/Password'
import PersonalDetails from '../components/setting/PersonalDetails'
import Privacy from '../components/setting/Privacy'
import Notification from '../components/setting/Notification'
import DataStroage from '../components/setting/DataStroage'
import DataDelete from '../components/setting/DataDelete'
import Help from '../components/setting/Help'
import UserPost from '../components/posts/postsdata/UserPost'
import AllPost from '../components/posts/postsdata/AllPost'
import UserProfile from '../components/profile/UserProfile'
import OtherProfile from '../components/profile/OtherProfile'
import AboutAccount from '../screens/profile/other/AboutAccount'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true)
    const isAuthenticated = useUserAuthStore(state => state.isAuthenticated)
    const user = useUserAuthStore(state => state.user)
    const token = useUserAuthStore(state => state.token)

    useEffect(() => {
        // Check authentication status when component mounts
        console.log('Auth status:', { isAuthenticated, user: user, token: !!token })
        setIsLoading(false)
    }, [isAuthenticated, user, token])

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        )
    }

    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <>
                    <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
                    {/* settings start*/}
                    <Stack.Screen name="Theme" component={Theme} options={{ headerShown: false, title: 'Appearance' }} />
                    <Stack.Screen name="Password" component={Password} options={{ headerShown: false }} />
                    <Stack.Screen name="PersonalDetails" component={PersonalDetails} options={{ headerShown: false }} />
                    <Stack.Screen name="Privacy" component={Privacy} options={{ headerShown: false }} />
                    <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
                    <Stack.Screen name="DataStroage" component={DataStroage} options={{ headerShown: false }} />
                    <Stack.Screen name="DataDelete" component={DataDelete} options={{ headerShown: false }} />
                    <Stack.Screen name="HelpCenter" component={Help} options={{ headerShown: false }} />
                    {/* settings end */}
                    {/* posts start */}
                    <Stack.Screen name="UserPosts" component={UserPost} options={{ headerShown: false }} />
                    <Stack.Screen name="AllPosts" component={AllPost} options={{ headerShown: false }} />
                    {/* posts ends */}
                    {/* profile start */}
                    <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
                    <Stack.Screen name="OtherProfile" component={OtherProfile} options={{ headerShown: false }} />
                    {/* others */}
                    <Stack.Screen name="AboutAccount" component={AboutAccount} options={{ headerShown: false }} />
                    {/* prodile end */}
                    
                </>
            ) : (
                <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
            )}
        </Stack.Navigator>
    )
}

export default AppNavigator
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from './AuthNavigator'
import Home from '../screens/home/Home'
import { useUserAuthStore } from '../store/auth-store'
import { ActivityIndicator, View } from 'react-native'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true)
    const isAuthenticated = useUserAuthStore(state => state.isAuthenticated)
    const user = useUserAuthStore(state => state.user)
    const token = useUserAuthStore(state => state.token)

    useEffect(() => {
        // Check authentication status when component mounts
        console.log('Auth status:', { isAuthenticated, user: !!user, token: !!token })
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
                    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                </>
            ) : (
                <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
            )}
        </Stack.Navigator>
    )
}

export default AppNavigator
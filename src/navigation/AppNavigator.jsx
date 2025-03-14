
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from './AuthNavigator'
import Home from '../screens/home/Home'


const Stack = createNativeStackNavigator()
const AppNavigator = () => {

    const isLoggedIn = false
    return (
        <>
            
                <Stack.Navigator>
                    {isLoggedIn? (
                        <>
                            <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
                            
                        </>
                    ) : (
                        <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{headerShown:false}}/>
                    )}

                </Stack.Navigator>
          
        </>
    )
}

export default AppNavigator
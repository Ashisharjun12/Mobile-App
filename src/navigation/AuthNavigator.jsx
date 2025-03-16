
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/auth/Login'
import Register from '../screens/auth/Register'
import VerifyOtp from '../screens/auth/VerifyOtp'

const Stack = createNativeStackNavigator()
const AuthNavigator = () => {
  return (
    <>
   
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
            <Stack.Screen name="VerifyOtp" component={VerifyOtp} options={{headerShown:false}}/>
        </Stack.Navigator>
   
    </>
  )
}

export default AuthNavigator
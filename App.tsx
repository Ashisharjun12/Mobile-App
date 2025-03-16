import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ThemeProvider } from './src/utils/context/ThemeContext'
import { Provider as PaperProvider } from 'react-native-paper'
import { useTheme } from './src/utils/context/ThemeContext'
import Splash from './src/screens/onboarding/Splash'
import AppNavigator from './src/navigation/AppNavigator'
import CustomSafeAreaView from './src/components/common/SafeAreaView'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator()

const AppContent = () => {
  const { currentTheme, isDarkTheme } = useTheme()

  return (
    <CustomSafeAreaView>
      <StatusBar
        backgroundColor={currentTheme.colors.background}
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        translucent
      />
      <PaperProvider theme={currentTheme}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: currentTheme.colors.background }
            }}
          >
            <Stack.Screen 
              name="Splash" 
              component={Splash} 
            />
            <Stack.Screen 
              name='App' 
              component={AppNavigator} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </CustomSafeAreaView>
  )
}



const App = () => {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.container}>
      <AppContent />
      </GestureHandlerRootView>

      
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App
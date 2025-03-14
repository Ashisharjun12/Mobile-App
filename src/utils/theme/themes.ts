import { DefaultTheme, MD2DarkTheme } from 'react-native-paper';
import { Appearance } from 'react-native';

export const lightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6200ee',
        accent: '#03dac4',
        background: '#ffffff',
        surface: '#ffffff',
        text: '#000000',
        statusBarColor: '#F0F0F0'
    },
};

export const darkTheme = {
    ...MD2DarkTheme,
    colors: {
        ...MD2DarkTheme.colors,
        primary: '#bb86fc',
        accent: '#03dac6',
        background: '#121212',
        surface: '#121212',
        text: '#ffffff',
        statusBarColor: '#22272B'
    },
};

// Function to get system theme dynamically
export const getSystemTheme = () => (Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme);

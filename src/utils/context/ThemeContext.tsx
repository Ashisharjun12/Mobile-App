import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { darkTheme, lightTheme } from '../theme/themes';

type ThemeContextType = {
    themeMode: 'light' | 'dark' | 'system';
    isDarkTheme: boolean;
    currentTheme: typeof lightTheme | typeof darkTheme;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType>({
    themeMode: 'system',
    isDarkTheme: false,
    currentTheme: lightTheme,
    setThemeMode: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { themeMode, isDarkTheme, currentTheme, setThemeMode } = useThemeStore();

    return (
        <ThemeContext.Provider value={{ themeMode, isDarkTheme, currentTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import { lightTheme, darkTheme, getSystemTheme } from '../utils/theme/themes';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeState = {
    themeMode: ThemeMode;
    isDarkTheme: boolean;
    currentTheme: typeof lightTheme | typeof darkTheme;
    setThemeMode: (mode: ThemeMode) => void;
};

const storage = new MMKV();

export const useThemeStore = create<ThemeState>((set) => {
    const storedThemeMode = storage.getString('themeMode') as ThemeMode | null;
    const themeMode = storedThemeMode || 'system';
    const isDarkTheme = themeMode === 'dark' || (themeMode === 'system' && Appearance.getColorScheme() === 'dark');

    return {
        themeMode,
        isDarkTheme,
        currentTheme: themeMode === 'system' ? getSystemTheme() : isDarkTheme ? darkTheme : lightTheme,
        setThemeMode: (mode: ThemeMode) => {
            storage.set('themeMode', mode);
            const newIsDarkTheme = mode === 'dark' || (mode === 'system' && Appearance.getColorScheme() === 'dark');
            set({
                themeMode: mode,
                isDarkTheme: newIsDarkTheme,
                currentTheme: mode === 'system' ? getSystemTheme() : newIsDarkTheme ? darkTheme : lightTheme,
            });
        },
    };
});

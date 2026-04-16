import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';
const THEME_KEY = 'dinho_theme_mode';

async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(THEME_KEY) as ThemeMode | null;
    }
    return (await SecureStore.getItemAsync(THEME_KEY)) as ThemeMode | null;
  } catch {
    return null;
  }
}

async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(THEME_KEY, mode);
    } else {
      await SecureStore.setItemAsync(THEME_KEY, mode);
    }
  } catch {}
}

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
  themeMode: 'system',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadThemeMode().then((saved) => {
      if (saved) setThemeModeState(saved);
      setLoaded(true);
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemeMode(mode);
  };

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const next: ThemeMode =
      themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

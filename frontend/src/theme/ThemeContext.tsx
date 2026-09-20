import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from './theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Load saved preference on mount
    AsyncStorage.getItem('@theme_preference').then(saved => {
      if (saved) {
        setIsDark(saved === 'dark');
      }
    });
  }, []);

  // Automatically update theme when the device's system theme changes
  useEffect(() => {
    if (systemColorScheme) {
      setIsDark(systemColorScheme === 'dark');
      // Optional: Clear any manual override when the system explicitly changes
      AsyncStorage.removeItem('@theme_preference');
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newMode = !prev;
      AsyncStorage.setItem('@theme_preference', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

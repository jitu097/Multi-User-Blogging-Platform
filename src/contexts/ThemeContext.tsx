// Theme Context and Provider for React Best Practices
"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { useLocalStorage, useMediaQuery } from '@/hooks';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  isSystemPreference: boolean;
}

interface ThemeContextValue extends ThemeState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeAction = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'UPDATE_SYSTEM_PREFERENCE'; payload: boolean };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        isDark: action.payload === 'dark' || (action.payload === 'system' && state.isSystemPreference),
      };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      return {
        ...state,
        theme: newTheme,
        isDark: newTheme === 'dark',
      };
    case 'UPDATE_SYSTEM_PREFERENCE':
      return {
        ...state,
        isSystemPreference: action.payload,
        isDark: state.theme === 'system' ? action.payload : state.isDark,
      };
    default:
      return state;
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system' 
}) => {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>('theme', defaultTheme);
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  
  const initialState: ThemeState = {
    theme: storedTheme,
    isDark: storedTheme === 'dark' || (storedTheme === 'system' && prefersDark),
    isSystemPreference: prefersDark,
  };

  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Update system preference when media query changes
  React.useEffect(() => {
    dispatch({ type: 'UPDATE_SYSTEM_PREFERENCE', payload: prefersDark });
  }, [prefersDark]);

  // Apply theme to document
  React.useEffect(() => {
    const root = document.documentElement;
    if (state.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDark]);

  const setTheme = useCallback((theme: Theme) => {
    setStoredTheme(theme);
    dispatch({ type: 'SET_THEME', payload: theme });
  }, [setStoredTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setStoredTheme(newTheme);
    dispatch({ type: 'TOGGLE_THEME' });
  }, [state.theme, setStoredTheme]);

  const contextValue = useMemo(() => ({
    ...state,
    setTheme,
    toggleTheme,
  }), [state, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
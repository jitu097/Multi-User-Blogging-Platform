// Global Application State Store with comprehensive state management
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange';

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
}

// User preferences
export interface UserPreferences {
  theme: Theme;
  colorScheme: ColorScheme;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoSave: boolean;
  compactMode: boolean;
  showOnboarding: boolean;
}

// Application state interface
interface AppState {
  // Theme and UI
  theme: Theme;
  colorScheme: ColorScheme;
  isDarkMode: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // User preferences
  preferences: UserPreferences;
  
  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Simple cache for API responses and computed data
  cache: Record<string, {
    data: unknown; // Using unknown instead of any for type safety
    timestamp: Date;
    ttl: number; // Time to live in milliseconds
  }>;
  
  // Connection state
  isOnline: boolean;
  lastOnlineAt: Date | null;
  
  // Performance metrics
  performanceMetrics: {
    pageLoadTime: number;
    apiResponseTimes: Record<string, number>;
    errorCount: number;
    lastUpdated: Date;
  };
  
  // Theme and UI actions
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // User preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Notification management
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
  
  // Loading state helpers
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  clearLoadingState: (key: string) => void;
  
  // Cache helpers - store temporary data with TTL
  setCache: (key: string, data: unknown, ttl?: number) => void;
  getCache: <T = unknown>(key: string) => T | null;
  clearCache: (key?: string) => void;
  cleanExpiredCache: () => void;
  
  // Actions - Connection state
  setOnlineStatus: (online: boolean) => void;

  // Actions - Performance
  recordPageLoadTime: (time: number) => void;
  recordApiResponse: (endpoint: string, time: number) => void;
  incrementErrorCount: () => void;
  resetPerformanceMetrics: () => void;
  
  // Computed values
  getActiveNotifications: () => Notification[];
  getCacheStats: () => { size: number; expired: number };
  getPerformanceSummary: () => string;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  colorScheme: 'blue',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotifications: true,
  pushNotifications: false,
  autoSave: true,
  compactMode: false,
  showOnboarding: true,
};

const initialState = {
  theme: 'system' as Theme,
  colorScheme: 'blue' as ColorScheme,
  isDarkMode: false,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  preferences: defaultPreferences,
  notifications: [],
  unreadNotificationsCount: 0,
  globalLoading: false,
  loadingStates: {},
  cache: {},
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastOnlineAt: null,
  performanceMetrics: {
    pageLoadTime: 0,
    apiResponseTimes: {},
    errorCount: 0,
    lastUpdated: new Date(),
  },
};

// Utility functions
const generateNotificationId = () => {
  return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const isMediaDarkMode = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const calculateIsDarkMode = (theme: Theme): boolean => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return isMediaDarkMode();
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Theme and UI actions
          setTheme: (theme) =>
            set((state) => {
              state.theme = theme;
              state.preferences.theme = theme;
              state.isDarkMode = calculateIsDarkMode(theme);
            }),
            
          setColorScheme: (scheme) =>
            set((state) => {
              state.colorScheme = scheme;
              state.preferences.colorScheme = scheme;
            }),
            
          toggleTheme: () =>
            set((state) => {
              const newTheme = state.theme === 'light' ? 'dark' : 'light';
              state.theme = newTheme;
              state.preferences.theme = newTheme;
              state.isDarkMode = calculateIsDarkMode(newTheme);
            }),
            
          setSidebarCollapsed: (collapsed) =>
            set((state) => {
              state.sidebarCollapsed = collapsed;
            }),
            
          toggleSidebar: () =>
            set((state) => {
              state.sidebarCollapsed = !state.sidebarCollapsed;
            }),
            
          setMobileMenuOpen: (open) =>
            set((state) => {
              state.mobileMenuOpen = open;
            }),
            
          // Preferences actions
          updatePreferences: (preferences) =>
            set((state) => {
              state.preferences = { ...state.preferences, ...preferences };
              
              // Update related state
              if (preferences.theme) {
                state.theme = preferences.theme;
                state.isDarkMode = calculateIsDarkMode(preferences.theme);
              }
              if (preferences.colorScheme) {
                state.colorScheme = preferences.colorScheme;
              }
            }),
            
          resetPreferences: () =>
            set((state) => {
              state.preferences = { ...defaultPreferences };
              state.theme = defaultPreferences.theme;
              state.colorScheme = defaultPreferences.colorScheme;
              state.isDarkMode = calculateIsDarkMode(defaultPreferences.theme);
            }),
            
          // Notifications actions
          addNotification: (notification) =>
            set((state) => {
              const newNotification: Notification = {
                ...notification,
                id: generateNotificationId(),
                timestamp: new Date(),
                duration: notification.duration ?? 5000,
              };
              
              state.notifications.unshift(newNotification);
              state.unreadNotificationsCount += 1;
              
              // Auto-remove notification after duration
              if (newNotification.duration && newNotification.duration > 0) {
                setTimeout(() => {
                  get().removeNotification(newNotification.id);
                }, newNotification.duration);
              }
            }),
            
          removeNotification: (id) =>
            set((state) => {
              const index = state.notifications.findIndex((n: Notification) => n.id === id);
              if (index > -1) {
                state.notifications.splice(index, 1);
                if (state.unreadNotificationsCount > 0) {
                  state.unreadNotificationsCount -= 1;
                }
              }
            }),
            
          clearNotifications: () =>
            set((state) => {
              state.notifications = [];
              state.unreadNotificationsCount = 0;
            }),
            
          markNotificationAsRead: (id) =>
            set((state) => {
              const notification = state.notifications.find((n: Notification) => n.id === id);
              if (notification && state.unreadNotificationsCount > 0) {
                state.unreadNotificationsCount -= 1;
              }
            }),
            
          // Loading states actions
          setGlobalLoading: (loading) =>
            set((state) => {
              state.globalLoading = loading;
            }),
            
          setLoadingState: (key, loading) =>
            set((state) => {
              if (loading) {
                state.loadingStates[key] = true;
              } else {
                delete state.loadingStates[key];
              }
            }),
            
          clearLoadingState: (key) =>
            set((state) => {
              delete state.loadingStates[key];
            }),
            
          // Cache management actions
          setCache: (key, data, ttl = 5 * 60 * 1000) => // Default 5 minutes TTL
            set((state) => {
              state.cache[key] = {
                data,
                timestamp: new Date(),
                ttl,
              };
            }),
            
          // Retrieve cached data if it hasn't expired yet
          getCache: <T = unknown>(key: string): T | null => {
            const state = get();
            const cached = state.cache[key];
            
            if (!cached) return null;
            
            const now = new Date().getTime();
            const cacheTime = cached.timestamp.getTime();
            
            if (now - cacheTime > cached.ttl) {
              // Cache expired, remove it
              set((state) => {
                delete state.cache[key];
              });
              return null;
            }
            
            return cached.data as T;
          },
          
          clearCache: (key) =>
            set((state) => {
              if (key) {
                delete state.cache[key];
              } else {
                state.cache = {};
              }
            }),
            
          cleanExpiredCache: () =>
            set((state) => {
              const now = new Date().getTime();
              Object.keys(state.cache).forEach(key => {
                const cached = state.cache[key];
                if (now - cached.timestamp.getTime() > cached.ttl) {
                  delete state.cache[key];
                }
              });
            }),
            
          // Connection state actions
          setOnlineStatus: (online) =>
            set((state) => {
              state.isOnline = online;
              if (!online) {
                state.lastOnlineAt = new Date();
              }
            }),
            
          // Performance actions
          recordPageLoadTime: (time) =>
            set((state) => {
              state.performanceMetrics.pageLoadTime = time;
              state.performanceMetrics.lastUpdated = new Date();
            }),
            
          recordApiResponse: (endpoint, time) =>
            set((state) => {
              state.performanceMetrics.apiResponseTimes[endpoint] = time;
              state.performanceMetrics.lastUpdated = new Date();
            }),
            
          incrementErrorCount: () =>
            set((state) => {
              state.performanceMetrics.errorCount += 1;
              state.performanceMetrics.lastUpdated = new Date();
            }),
            
          resetPerformanceMetrics: () =>
            set((state) => {
              state.performanceMetrics = {
                pageLoadTime: 0,
                apiResponseTimes: {},
                errorCount: 0,
                lastUpdated: new Date(),
              };
            }),
            
          // Computed values
          getActiveNotifications: () => {
            const state = get();
            return state.notifications.slice(0, 10); // Limit to 10 most recent
          },
          
          getCacheStats: () => {
            const state = get();
            const now = new Date().getTime();
            let expired = 0;
            
            Object.values(state.cache).forEach(cached => {
              if (now - cached.timestamp.getTime() > cached.ttl) {
                expired++;
              }
            });
            
            return {
              size: Object.keys(state.cache).length,
              expired,
            };
          },
          
          getPerformanceSummary: () => {
            const state = get();
            const { pageLoadTime, apiResponseTimes, errorCount } = state.performanceMetrics;
            
            const avgApiTime = Object.values(apiResponseTimes).length > 0
              ? Object.values(apiResponseTimes).reduce((a, b) => a + b, 0) / Object.values(apiResponseTimes).length
              : 0;
              
            return `Page: ${pageLoadTime}ms, API: ${avgApiTime.toFixed(0)}ms, Errors: ${errorCount}`;
          },
        }))
      ),
      {
        name: "app-store",
        partialize: (state) => ({
          // Persist important user preferences and settings
          theme: state.theme,
          colorScheme: state.colorScheme,
          sidebarCollapsed: state.sidebarCollapsed,
          preferences: state.preferences,
          // Don't persist notifications, loading states, or cache
        }),
      }
    ),
    { name: "app-store" }
  )
);

// Setup media query listener for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleMediaChange = (e: MediaQueryListEvent) => {
    const store = useAppStore.getState();
    if (store.theme === 'system') {
      useAppStore.setState({ isDarkMode: e.matches });
    }
  };
  
  mediaQuery.addEventListener('change', handleMediaChange);
  
  // Setup online/offline listeners
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false);
  });
}

// Auto-cleanup expired cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    useAppStore.getState().cleanExpiredCache();
  }, 5 * 60 * 1000);
}
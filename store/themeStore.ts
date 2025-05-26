import { create } from 'zustand';
import { ColorValue } from 'react-native';

interface ThemeColors {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  accent: {
    orange: string;
    purple: string;
    magenta: string;
    yellow: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
    normal: string;
  };
  neutral: {
    white: string;
    black: string;
    gray: string;
  };
  gradient: {
    primary: [string, string];
    secondary: [string, string];
    performance: [string, string];
  };
}

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

// Dark theme colors
const darkColors: ThemeColors = {
  primary: {
    main: '#0F172A',
    light: '#1E293B',
    dark: '#0A1122',
  },
  secondary: {
    main: '#00A9A5',
    light: '#4FD1CD',
    dark: '#007A77',
  },
  accent: {
    orange: '#F97316',
    purple: '#8B5CF6',
    magenta: '#EC4899',
    yellow: '#F6E05E',
  },
  background: {
    primary: '#0F172A',
    secondary: '#1E293B',
    card: '#1A2234',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    normal: '#6B7280',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
  },
  gradient: {
    primary: ['#00A9A5', '#0284C7'],
    secondary: ['#8B5CF6', '#EC4899'],
    performance: ['#F6E05E', '#EC4899'], // Light yellow to magenta
  },
};

// Light theme colors
const lightColors: ThemeColors = {
  primary: {
    main: '#FFFFFF',
    light: '#F8FAFC',
    dark: '#E2E8F0',
  },
  secondary: {
    main: '#0284C7',
    light: '#38BDF8',
    dark: '#075985',
  },
  accent: {
    orange: '#F97316',
    purple: '#8B5CF6',
    magenta: '#EC4899',
    yellow: '#F6E05E',
  },
  background: {
    primary: '#F8FAFC',
    secondary: '#E2E8F0',
    card: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    normal: '#6B7280',
  },
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: '#94A3B8',
  },
  gradient: {
    primary: ['#0284C7', '#0EA5E9'],
    secondary: ['#8B5CF6', '#EC4899'],
    performance: ['#F6E05E', '#EC4899'], // Light yellow to magenta
  },
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true,
  colors: darkColors,
  toggleTheme: () => set((state) => ({
    isDarkMode: !state.isDarkMode,
    colors: state.isDarkMode ? lightColors : darkColors,
  })),
}));
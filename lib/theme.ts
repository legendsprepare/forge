import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6B46C1',
    secondary: '#4ECDC4',
    background: '#FFFFFF',
    card: '#F3F4F6',
    cardLight: '#FAFBFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    notification: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    danger: '#DC2626',
    white: '#FFFFFF',
    gold: '#F59E0B',
    purple: '#7C3AED',
    accent: '#4ECDC4',
    info: '#3B82F6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 14,
    },
    small: {
      fontSize: 12,
    },
    metrics: {
      fontSize: 18,
      fontWeight: '600',
    },
  },
  elevation: {
    level0: 0,
    level1: 2,
    level2: 4,
    level3: 8,
    level4: 16,
    level5: 24,
  },
};

export const spacing = theme.spacing;
export const borderRadius = theme.borderRadius;
export const typography = theme.typography;
export const elevation = theme.elevation;

export const createTheme = (overrides?: any) => ({
  ...theme,
  ...overrides,
});

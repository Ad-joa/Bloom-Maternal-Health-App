export const Colors = {
  primary: '#f4bfbe', // Blush Pink
  brandOrange: '#f97316', // Hexta Orange
  secondary: '#f7e3cf', // Soft Peach
  accent: '#e8b5db', // Lavender
  background: '#ffffff',
  surface: '#f9f9f9',
  text: '#2d2d2d',
  textLight: '#757575',
  error: '#FF5252',
  success: '#8dd3c1', // Mint
  info: '#c8eaea', // Light Seafoam
  border: '#e0e0e0',
  white: '#ffffff',
  black: '#000000',
  
  // Trimesters
  t1: '#8dd3c1', // Mint
  t2: '#f7e3cf', // Soft Peach
  t3: '#f4bfbe', // Blush Pink
  
  // Risk
  low: '#8dd3c1',
  medium: '#f7e3cf',
  high: '#f4bfbe',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};

export const Shadow = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
};

export const theme = {
  colors: Colors,
  spacing: Spacing,
  typography: Typography,
  shadows: Shadow,
  fonts: {
    regular: 'System',
    bold: 'System',
  }
};

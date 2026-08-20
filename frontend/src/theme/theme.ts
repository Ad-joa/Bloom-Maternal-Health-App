import tokens from '../../design-tokens.json';

export const lightTheme = {
  colors: {
    // Pink Palette (Primary)
    primary: '#F1959B',       // Salmon Pink
    primaryLight: '#FBE8E9',  // Light Pink
    primaryDark: '#D87A80',   // Darker Pink
    
    accentTeal: '#00767E',    // Deep Teal
    accentOrange: '#EFAC5C',  // Terracotta
    
    background: '#FCF6EA',    // Warm Cream
    
    success: '#34C759',       
    warning: '#FF9500',       
    danger: '#FF3B30',        
    info: '#007AFF',          
    
    surface: '#FFFFFF',       // Clean white cards
    surfaceVariant: '#F4E9D0',// Warm Sand for tags/chips
    textHigh: '#2A3A38',      // Dark slate
    textMedium: '#8C9A97',    // Muted grey-teal
    border: 'rgba(0, 0, 0, 0.05)', 
  },
  typography: {
    families: {
      headingRegular: 'Montserrat_400Regular',
      headingMedium: 'Montserrat_500Medium',
      headingSemibold: 'Montserrat_600SemiBold',
      headingBold: 'Montserrat_700Bold',
      bodyRegular: 'Montserrat_400Regular',
      bodyMedium: 'Montserrat_500Medium',
      bodySemibold: 'Montserrat_600SemiBold',
      bodyBold: 'Montserrat_700Bold',
    },
    sizes: {
      largeTitle: parseInt(tokens.typography.sizes.largeTitle.value, 10),
      title1: parseInt(tokens.typography.sizes.title1.value, 10),
      title2: parseInt(tokens.typography.sizes.title2.value, 10),
      title3: parseInt(tokens.typography.sizes.title3.value, 10),
      headline: parseInt(tokens.typography.sizes.headline.value, 10),
      body: parseInt(tokens.typography.sizes.body.value, 10),
      callout: parseInt(tokens.typography.sizes.callout.value, 10),
      subhead: parseInt(tokens.typography.sizes.subhead.value, 10),
      footnote: parseInt(tokens.typography.sizes.footnote.value, 10),
      caption1: parseInt(tokens.typography.sizes.caption1.value, 10),
      caption2: parseInt(tokens.typography.sizes.caption2.value, 10),
    }
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#D87A80',
    primaryLight: '#3E2A2C', 
    primaryDark: '#F1959B', 
    
    accentTeal: '#689D96',    
    accentOrange: '#EFAC5C',  
    
    background: '#121212',    // Deep Dark
    
    success: '#34C759',       
    warning: '#FF9500',       
    danger: '#FF453A',        
    info: '#0A84FF',          
    
    surface: '#1E1E1E',       // Dark surface
    surfaceVariant: '#2C2C2E',
    textHigh: '#F5F5F5',      // Light text
    textMedium: '#A0A0A5',    // Muted light text
    border: 'rgba(255, 255, 255, 0.1)', 
  }
};

// Default export for backward compatibility during refactor
export const theme = lightTheme;
export type Theme = typeof lightTheme;

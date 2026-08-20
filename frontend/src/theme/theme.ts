import tokens from '../../design-tokens.json';

// Note: For a robust app, you would export separate `lightTheme` and `darkTheme`
// and switch between them using Context and `useColorScheme()`.
// This is the default Light Theme mapping for immediate usage.

export const theme = {
  colors: {
    // Soft Earth & Teal Palette
    primary: '#00767E',       // Deep Teal
    primaryLight: '#CDE2D6',  // Mint/Seafoam
    primaryDark: '#689D96',   // Slate Teal
    
    accentPink: '#F1959B',    // Salmon Pink
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
    },
    weights: {
      regular: tokens.typography.weights.regular.value,
      medium: tokens.typography.weights.medium.value,
      semibold: tokens.typography.weights.semibold.value,
      bold: tokens.typography.weights.bold.value,
    }
  },
  spacing: {
    1: parseInt(tokens.spacing["1"].value, 10),
    2: parseInt(tokens.spacing["2"].value, 10),
    3: parseInt(tokens.spacing["3"].value, 10),
    4: parseInt(tokens.spacing["4"].value, 10),
    5: parseInt(tokens.spacing["5"].value, 10),
    6: parseInt(tokens.spacing["6"].value, 10),
    7: parseInt(tokens.spacing["7"].value, 10),
    8: parseInt(tokens.spacing["8"].value, 10),
  },
  radii: {
    none: parseInt(tokens.radii.none.value, 10),
    sm: parseInt(tokens.radii.sm.value, 10),
    md: parseInt(tokens.radii.md.value, 10),
    lg: parseInt(tokens.radii.lg.value, 10),
    xl: parseInt(tokens.radii.xl.value, 10),
    pill: 9999,
  },
  shadows: {
    soft: {
      shadowColor: '#1C1C1E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 30,
      elevation: 2,
    },
    medium: {
      shadowColor: '#1C1C1E',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.08,
      shadowRadius: 40,
      elevation: 4,
    }
  }
};

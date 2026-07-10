import tokens from '../../design-tokens.json';

// Note: For a robust app, you would export separate `lightTheme` and `darkTheme`
// and switch between them using Context and `useColorScheme()`.
// This is the default Light Theme mapping for immediate usage.

export const theme = {
  colors: {
    primary: tokens.colors.primary["500"].value,
    primaryLight: tokens.colors.primary["100"].value,
    primaryDark: tokens.colors.primary["700"].value,
    
    success: tokens.colors.semantic.success.value,
    warning: tokens.colors.semantic.warning.value,
    danger: tokens.colors.semantic.danger.value,
    info: tokens.colors.semantic.info.value,
    
    surface: tokens.colors.light.surface.value,
    surfaceVariant: tokens.colors.light.surfaceVariant.value,
    textHigh: tokens.colors.light.textHigh.value,
    textMedium: tokens.colors.light.textMedium.value,
    border: tokens.colors.light.border.value,
  },
  typography: {
    families: {
      headingRegular: tokens.typography.families.headingRegular.value,
      headingMedium: tokens.typography.families.headingMedium.value,
      headingSemibold: tokens.typography.families.headingSemibold.value,
      headingBold: tokens.typography.families.headingBold.value,
      bodyRegular: tokens.typography.families.bodyRegular.value,
      bodyMedium: tokens.typography.families.bodyMedium.value,
      bodySemibold: tokens.typography.families.bodySemibold.value,
      bodyBold: tokens.typography.families.bodyBold.value,
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
      shadowColor: tokens.colors.primary["700"].value,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 4,
    },
    medium: {
      shadowColor: tokens.colors.primary["700"].value,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 32,
      elevation: 8,
    }
  }
};

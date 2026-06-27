import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export type TypographyVariant = 
  | 'largeTitle'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subhead'
  | 'footnote'
  | 'caption1'
  | 'caption2';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = theme.colors.textHigh,
  align = 'auto',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { color, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Map variants to specific font families instead of generic weights
const styles = StyleSheet.create({
  base: {
    // Default base styles
  },
  largeTitle: {
    fontSize: theme.typography.sizes.largeTitle,
    fontFamily: theme.typography.families.headingBold,
  },
  title1: {
    fontSize: theme.typography.sizes.title1,
    fontFamily: theme.typography.families.headingBold,
  },
  title2: {
    fontSize: theme.typography.sizes.title2,
    fontFamily: theme.typography.families.headingSemibold,
  },
  title3: {
    fontSize: theme.typography.sizes.title3,
    fontFamily: theme.typography.families.headingSemibold,
  },
  headline: {
    fontSize: theme.typography.sizes.headline,
    fontFamily: theme.typography.families.bodySemibold,
  },
  body: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.families.bodyRegular,
  },
  callout: {
    fontSize: theme.typography.sizes.callout,
    fontFamily: theme.typography.families.bodyRegular,
  },
  subhead: {
    fontSize: theme.typography.sizes.subhead,
    fontFamily: theme.typography.families.bodyMedium,
  },
  footnote: {
    fontSize: theme.typography.sizes.footnote,
    fontFamily: theme.typography.families.bodyRegular,
  },
  caption1: {
    fontSize: theme.typography.sizes.caption1,
    fontFamily: theme.typography.families.bodyRegular,
  },
  caption2: {
    fontSize: theme.typography.sizes.caption2,
    fontFamily: theme.typography.families.bodyMedium,
  },
});

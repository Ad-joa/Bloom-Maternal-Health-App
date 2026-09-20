import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass' | 'premium-glass';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
  intensity?: number;
  /** Optional icon to render in the top left header of the card */
  headerIcon?: React.ElementType;
  /** Optional title to render in the header */
  title?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  intensity = 60,
  headerIcon: HeaderIcon,
  title,
  style,
  children,
  ...props
}) => {
  const { theme, isDark } = useTheme();

  const base: StyleProp<ViewStyle> = {
    borderRadius: 24,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surface,
  };

  const variantStyle: StyleProp<ViewStyle> =
    variant === 'elevated'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0.3 : 0.08, shadowRadius: 8, elevation: 3 }
      : variant === 'outlined'
      ? { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'transparent' }
      : variant === 'filled'
      ? { backgroundColor: theme.colors.surfaceVariant }
      : {}; // glass handled separately

  const containerStyle: StyleProp<ViewStyle> = [base, variantStyle, style];

  if (variant === 'premium-glass') {
    return (
      <View style={[{ borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, style]} {...props}>
        <BlurView
          intensity={isDark ? 30 : 70}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={{ padding: theme.spacing[5] }}>
          {(HeaderIcon || title) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing[4] }}>
              {HeaderIcon && <HeaderIcon color={theme.colors.primaryDark} size={24} />}
              {title && (
                <Typography 
                  variant="headline" 
                  color={theme.colors.textHigh} 
                  style={HeaderIcon ? { marginLeft: theme.spacing[3] } : undefined}
                >
                  {title}
                </Typography>
              )}
            </View>
          )}
          {children}
        </View>
      </View>
    );
  }

  if (variant === 'glass') {
    return (
      <BlurView
        intensity={isDark ? 30 : intensity}
        tint={isDark ? 'dark' : 'light'}
        style={[base, style] as any}
        {...props as any}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

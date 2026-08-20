import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
  intensity?: number;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  intensity = 60,
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

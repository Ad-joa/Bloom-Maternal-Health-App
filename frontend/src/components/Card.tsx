import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  style,
  children,
  ...props
}) => {
  const containerStyle: ViewStyle[] = [
    styles.base,
    variant === 'elevated' ? styles.elevated : undefined,
    variant === 'outlined' ? styles.outlined : undefined,
    variant === 'filled' ? styles.filled : undefined,
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  elevated: {
    ...theme.shadows.soft,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: theme.colors.surfaceVariant,
  },
});

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
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'filled' && styles.filled,
    style as ViewStyle,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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

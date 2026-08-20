import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';

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
  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    variant === 'elevated' ? styles.elevated : undefined,
    variant === 'outlined' ? styles.outlined : undefined,
    variant === 'filled' ? styles.filled : undefined,
    variant === 'glass' ? styles.glass : undefined,
    style,
  ];

  if (variant === 'glass') {
    return (
      <BlurView intensity={intensity} tint="light" style={containerStyle as any} {...props as any}>
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

const styles = StyleSheet.create({
  base: {
    borderRadius: 24, // Apple style highly rounded cards
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surface,
  },
  elevated: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
  }
});

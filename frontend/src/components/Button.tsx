import React from 'react';
import {
  ActivityIndicator,
  ViewStyle,
  PressableProps,
  StyleProp,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';
import { BounceButton } from './BounceButton';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  title: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  title,
  loading = false,
  disabled = false,
  style,
  ...props
}) => {
  const { theme, isDark } = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isTertiary = variant === 'tertiary';
  const isDisabled = disabled || loading;

  const base: ViewStyle = {
    minHeight: 52,
    minWidth: 44,
    borderRadius: 100, // Pill style
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  };

  const variantStyle: ViewStyle = isPrimary
    ? { backgroundColor: isDisabled ? theme.colors.border : theme.colors.primaryDark }
    : isSecondary
    ? {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primaryDark,
      }
    : { backgroundColor: 'transparent' }; // tertiary

  const containerStyle: StyleProp<ViewStyle> = [base, variantStyle, style as StyleProp<ViewStyle>];

  const textColor = isPrimary
    ? '#FFF'
    : isDisabled
    ? theme.colors.textMedium
    : theme.colors.primaryDark;

  return (
    <BounceButton
      style={containerStyle}
      disabled={isDisabled}
      accessibilityRole="button"
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Typography variant="headline" color={textColor} align="center">
          {title}
        </Typography>
      )}
    </BounceButton>
  );
};

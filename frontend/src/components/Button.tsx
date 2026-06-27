import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends TouchableOpacityProps {
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
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isTertiary = variant === 'tertiary';

  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    isPrimary && styles.primary,
    isSecondary && styles.secondary,
    isTertiary && styles.tertiary,
    isDisabled && styles.disabled,
    style as ViewStyle,
  ];

  let textColor = isPrimary ? theme.colors.surface : theme.colors.primary;
  if (isDisabled && !isPrimary) textColor = theme.colors.textMedium;

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={isDisabled}
      activeOpacity={0.8}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[5],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  tertiary: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
  disabled: {
    opacity: 0.6,
  },
});

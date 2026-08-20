import React from 'react';
import { View, TextInput as RNTextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';

export interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  style,
  ...props
}) => {
  // If containerStyle has flex:1, we are nested inside a custom input row.
  // Strip the label, wrapper margin, and underline to act as a bare input.
  const isNested = containerStyle && (containerStyle as any).flex === 1;

  if (isNested) {
    return (
      <View style={[styles.nestedWrapper, containerStyle]}>
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor="#8E8E93"
          {...props}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Typography variant="footnote" color={theme.colors.textMedium} style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <RNTextInput
          style={[styles.input, style, leftIcon ? { paddingLeft: 8 } : null]}
          placeholderTextColor="#8E8E93"
          {...props}
        />
      </View>
      {error && (
        <Typography variant="caption1" color={theme.colors.danger} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing[4],
  },
  nestedWrapper: {
    justifyContent: 'center',
  },
  label: {
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingHorizontal: theme.spacing[1],
    paddingVertical: theme.spacing[1],
    minHeight: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  inputError: {
    borderBottomColor: theme.colors.danger,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.families.bodyRegular,
    color: theme.colors.textHigh,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
});

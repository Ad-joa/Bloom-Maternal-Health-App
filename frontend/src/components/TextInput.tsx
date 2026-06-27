import React from 'react';
import { View, TextInput as RNTextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';

export interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Typography variant="footnote" color={theme.colors.textMedium} style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textMedium}
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing[4],
  },
  label: {
    marginBottom: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
  inputContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    minHeight: 44,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  input: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textHigh,
  },
  errorText: {
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
});

import React from 'react';
import { View, TextInput as RNTextInput, TextInputProps, ViewStyle } from 'react-native';
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
  const { theme, isDark } = useTheme();

  // If containerStyle has flex:1, we are nested inside a custom input row.
  const isNested = containerStyle && (containerStyle as any).flex === 1;

  const inputStyle = {
    flex: 1,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    paddingVertical: theme.spacing[2],
  };

  const inputContainerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: error ? theme.colors.danger : theme.colors.border,
    paddingHorizontal: theme.spacing[1],
    paddingVertical: theme.spacing[1],
    minHeight: 48,
  };

  if (isNested) {
    return (
      <View style={[{ justifyContent: 'center' }, containerStyle]}>
        <RNTextInput
          style={[inputStyle, style]}
          placeholderTextColor={theme.colors.textMedium}
          {...props}
        />
      </View>
    );
  }

  return (
    <View style={[{ marginBottom: theme.spacing[4] }, containerStyle]}>
      {label && (
        <Typography
          variant="footnote"
          color={theme.colors.textMedium}
          style={{ marginBottom: theme.spacing[1], marginLeft: theme.spacing[1] }}
        >
          {label}
        </Typography>
      )}
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={{ justifyContent: 'center', alignItems: 'center', width: 24 }}>
            {leftIcon}
          </View>
        )}
        <RNTextInput
          style={[inputStyle, style, leftIcon ? { paddingLeft: 8 } : null]}
          placeholderTextColor={theme.colors.textMedium}
          {...props}
        />
      </View>
      {error && (
        <Typography
          variant="caption1"
          color={theme.colors.danger}
          style={{ marginTop: theme.spacing[1], marginLeft: theme.spacing[1] }}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';

export interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: React.ReactNode; // Can be an SVG or Icon component
  label?: string; // Optional text label next to icon
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  label,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, style, label ? styles.extended : styles.circular]}
    >
      {icon && <View style={label && styles.iconWithLabel}>{icon}</View>}
      {label && (
        <Typography variant="headline" color={theme.colors.surface}>
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    bottom: theme.spacing[5],
    right: theme.spacing[5],
    elevation: 5,
    shadowColor: theme.colors.primaryDark, // Soft colored shadow like Flo App
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  circular: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  extended: {
    height: 56,
    borderRadius: 28,
    paddingHorizontal: theme.spacing[5],
  },
  iconWithLabel: {
    marginRight: theme.spacing[2],
  }
});

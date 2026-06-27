import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';

export interface TagProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Tag: React.FC<TagProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => {
  const isInteractive = !!onPress;

  return (
    <TouchableOpacity
      activeOpacity={isInteractive ? 0.7 : 1}
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.container,
        selected ? styles.selected : styles.unselected,
        style,
      ]}
    >
      <Typography 
        variant="subhead" 
        color={selected ? theme.colors.primaryDark : theme.colors.textMedium}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii.pill, // Flo App uses highly rounded, pill-like tags
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselected: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  selected: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
});

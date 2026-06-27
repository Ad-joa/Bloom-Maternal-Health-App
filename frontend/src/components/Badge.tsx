import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';

export interface BadgeProps {
  count?: number;
  showZero?: boolean;
  dot?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  count = 0,
  showZero = false,
  dot = false,
  style,
}) => {
  if (!showZero && count === 0 && !dot) {
    return null;
  }

  if (dot) {
    return <View style={[styles.dot, style]} />;
  }

  // Cap the number at 99+
  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[styles.badge, style]}>
      <Typography variant="caption2" color={theme.colors.surface}>
        {displayCount}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
  },
  badge: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = theme.colors.primary,
  trackColor = theme.colors.primaryLight,
  height = 8,
  style,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }, style]}>
      <View 
        style={[
          styles.fill, 
          { 
            backgroundColor: color, 
            width: `${clampedProgress}%`,
            borderRadius: height / 2
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

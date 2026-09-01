import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';
import { BounceButton } from './BounceButton';

export interface EmptyStateProps {
  /** The Lucide icon to display in the glowing ring */
  icon: React.ElementType;
  title: string;
  description: string;
  /** Optional Primary Action Button */
  actionLabel?: string;
  onActionPress?: () => void;
  actionIcon?: React.ElementType;
  /** Optional Secondary Action Button */
  secondaryActionLabel?: string;
  onSecondaryActionPress?: () => void;
  /** Override the icon ring color (default uses theme primary) */
  colorHint?: string;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionPress,
  actionIcon: ActionIcon,
  secondaryActionLabel,
  onSecondaryActionPress,
  colorHint,
  style,
}) => {
  const { theme, isDark } = useTheme();

  const primaryColor = colorHint || theme.colors.primaryDark;
  
  // Hex to RGBA helper for gradients
  const hexToRgba = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    } else if (hex.startsWith('rgba')) {
        // Very basic fallback
        return hex;
    }
    return `rgba(${r},${g},${b},${alpha})`;
  };

  const gradientColors = isDark
    ? [hexToRgba(primaryColor, 0.15), hexToRgba('#EC4899', 0.10)]
    : [hexToRgba(primaryColor, 0.08), hexToRgba('#EC4899', 0.05)];

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        style={styles.iconRing}
      >
        <Icon color={primaryColor} size={40} />
      </LinearGradient>
      
      <Typography 
        variant="title2" 
        style={[styles.title, { fontFamily: theme.typography.families.headingBold }]}
      >
        {title}
      </Typography>
      
      <Typography 
        variant="body" 
        color={theme.colors.textMedium} 
        style={styles.description}
      >
        {description}
      </Typography>

      {actionLabel && onActionPress && (
        <BounceButton 
          style={[styles.primaryAction, { backgroundColor: primaryColor }]} 
          onPress={onActionPress}
        >
          {ActionIcon && <ActionIcon color="#fff" size={16} />}
          <Typography 
            variant="subhead" 
            color="#fff" 
            style={[styles.actionText, ActionIcon && { marginLeft: 8 }]}
          >
            {actionLabel}
          </Typography>
        </BounceButton>
      )}

      {secondaryActionLabel && onSecondaryActionPress && (
        <BounceButton 
          style={styles.secondaryAction} 
          onPress={onSecondaryActionPress}
        >
          <Typography 
            variant="subhead" 
            color={theme.colors.textMedium} 
            style={styles.secondaryActionText}
          >
            {secondaryActionLabel}
          </Typography>
        </BounceButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  actionText: {
    fontWeight: 'bold', // Fallback
  },
  secondaryAction: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondaryActionText: {
    fontWeight: '600',
  }
});

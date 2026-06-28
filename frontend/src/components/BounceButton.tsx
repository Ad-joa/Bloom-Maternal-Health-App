import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface BounceButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
}

export const BounceButton: React.FC<BounceButtonProps> = ({ 
  children, 
  style, 
  onPress, 
  onPressIn, 
  onPressOut, 
  scaleTo = 0.95,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  ...props 
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleValue, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
    
    // Trigger haptic feedback
    if (hapticStyle) {
      Haptics.impactAsync(hapticStyle);
    }

    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();

    if (onPressOut) onPressOut(e);
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

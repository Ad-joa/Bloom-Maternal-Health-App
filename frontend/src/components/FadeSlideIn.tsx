import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface FadeSlideInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'down' | 'up' | 'right' | 'left';
  distance?: number;
  style?: StyleProp<ViewStyle>;
  zoom?: boolean;
}

/**
 * A lightweight entry animation component using React Native's built-in
 * Animated API. Drop-in replacement for Reanimated's FadeInDown/FadeInUp
 * that works in Expo Go without native modules.
 */
export const FadeSlideIn: React.FC<FadeSlideInProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'down',
  distance = 24,
  style,
  zoom = false,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(
    direction === 'down' || direction === 'right' ? -distance : distance
  )).current;
  const scale = useRef(new Animated.Value(zoom ? 0.8 : 1)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.spring(translate, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
    ];

    if (zoom) {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 6,
        })
      );
    }

    const timer = setTimeout(() => {
      Animated.parallel(animations).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const isHorizontal = direction === 'left' || direction === 'right';

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity,
    transform: [
      isHorizontal ? { translateX: translate } : { translateY: translate },
      ...(zoom ? [{ scale }] : []),
    ],
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

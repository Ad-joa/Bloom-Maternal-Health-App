import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.65;
const IMAGE_SIZE = RING_SIZE - 24;

export function TermLoader({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Animations
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the entire loader
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Spin the ring continuously
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Slowly grow the belly image to simulate the "term growth" effect
    Animated.timing(scaleAnim, {
      toValue: 1.08,
      duration: 2800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // After 3 seconds, fade out then call onComplete
    const exitTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onComplete());
    }, 3000);

    return () => clearTimeout(exitTimer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Outer Ring Track */}
      <View style={styles.ringContainer}>
        {/* Static track (grey) */}
        <View style={styles.trackRing} />

        {/* Spinning progress arc (orange, Amila-style) */}
        <Animated.View
          style={[
            styles.progressArc,
            { transform: [{ rotate: spin }] },
          ]}
        />

        {/* Inner circle with image */}
        <View style={styles.imageMask}>
          <Animated.Image
            source={require('../../assets/baby.png')}
            style={[
              styles.bellyImage,
              { transform: [{ scale: scaleAnim }] },
            ]}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Loading text */}
      <View style={styles.textContainer}>
        <Typography variant="title2" style={styles.loadingText}>
          Determine your term...
        </Typography>
      </View>
    </Animated.View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    ringContainer: {
      width: RING_SIZE,
      height: RING_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trackRing: {
      position: 'absolute',
      width: RING_SIZE,
      height: RING_SIZE,
      borderRadius: RING_SIZE / 2,
      borderWidth: 7,
      borderColor: '#F0F0F0',
    },
    progressArc: {
      position: 'absolute',
      width: RING_SIZE,
      height: RING_SIZE,
      borderRadius: RING_SIZE / 2,
      borderWidth: 7,
      // Orange arc - 3 sides transparent, 1 solid
      borderTopColor: '#F97316',
      borderRightColor: '#F97316',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
    },
    imageMask: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: IMAGE_SIZE / 2,
      overflow: 'hidden',
      backgroundColor: '#FFF5F0',
    },
    bellyImage: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      marginTop: 48,
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    loadingText: {
      fontFamily: theme.typography.families.headingBold,
      color: theme.colors.textHigh,
      textAlign: 'center',
      letterSpacing: -0.5,
    },
  });

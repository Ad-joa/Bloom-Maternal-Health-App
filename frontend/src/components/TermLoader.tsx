import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { Typography } from './Typography';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.65;

export function TermLoader({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Fade in the loader
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

    // Force play Lottie animation
    lottieRef.current?.play();

    // After 3.2 seconds, fade out then advance
    const exitTimer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onComplete());
    }, 3200);

    return () => clearTimeout(exitTimer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Ring + Lottie layer */}
      <View style={styles.ringContainer}>
        {/* Static grey track */}
        <View style={styles.trackRing} />

        {/* Spinning orange progress arc */}
        <Animated.View
          style={[styles.progressArc, { transform: [{ rotate: spin }] }]}
        />

        {/* Lottie belly animation inside the ring */}
        <View style={styles.lottieWrapper}>
          <LottieView
            ref={lottieRef}
            source={require('../../assets/belly.json')}
            autoPlay
            loop={false}
            style={styles.lottie}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Text */}
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
      borderTopColor: '#F97316',
      borderRightColor: '#F97316',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
    },
    lottieWrapper: {
      width: RING_SIZE - 24,
      height: RING_SIZE - 24,
      borderRadius: (RING_SIZE - 24) / 2,
      overflow: 'hidden',
      backgroundColor: '#FFFAF5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    lottie: {
      width: RING_SIZE - 24,
      height: RING_SIZE - 24,
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

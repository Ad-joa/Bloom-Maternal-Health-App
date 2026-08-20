import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

export function TermLoader({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Animations
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in text
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Rotate the glowing ring
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse/Grow the belly to simulate the morphing effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 2500, // Grows slowly over the duration
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();

    // Finish loader
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#FFFFFF', '#FAFAFA']} 
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.circleContainer}>
        {/* Background track ring */}
        <View style={styles.trackRing} />
        
        {/* Spinning Progress Ring */}
        <Animated.View style={[styles.progressRing, { transform: [{ rotate: spin }] }]} />
        
        {/* Growing Belly Image (Placeholder for Lottie) */}
        <View style={styles.imageMask}>
          <Animated.Image 
            source={require('../../assets/amila_belly.jpg')}
            style={[styles.bellyImage, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="cover"
          />
        </View>
      </View>

      <Animated.View style={{ opacity: opacityAnim, marginTop: 48 }}>
        <Typography variant="title2" style={styles.loadingText}>
          Determine your term...
        </Typography>
      </Animated.View>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackRing: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: '#F3F4F6', // light gray
  },
  progressRing: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 6,
    borderColor: '#F97316', // Amila Orange
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  imageMask: {
    width: CIRCLE_SIZE - 20,
    height: CIRCLE_SIZE - 20,
    borderRadius: (CIRCLE_SIZE - 20) / 2,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellyImage: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontFamily: theme.typography.families.headingBold,
    color: theme.colors.textHigh,
    letterSpacing: -0.5,
  }
});

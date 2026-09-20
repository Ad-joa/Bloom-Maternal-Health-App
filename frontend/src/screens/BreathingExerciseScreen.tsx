import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, Play, Square } from 'lucide-react-native';

export default function BreathingExerciseScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Ready' | 'Breathe In' | 'Hold' | 'Breathe Out'>('Ready');
  const [timer, setTimer] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  // The 4-7-8 method
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      if (phase === 'Ready') {
        startInhale();
      }

      interval = setInterval(() => {
        setTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
      Animated.spring(opacityAnim, { toValue: 0.5, useNativeDriver: true }).start();
      setPhase('Ready');
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startInhale = () => {
    if (!isActive) return;
    setPhase('Breathe In');
    setTimer(4);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 2.2, duration: 4000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) startHold();
    });
  };

  const startHold = () => {
    if (!isActive) return;
    setPhase('Hold');
    setTimer(7);
    setTimeout(() => {
      if (isActive) startExhale();
    }, 7000);
  };

  const startExhale = () => {
    if (!isActive) return;
    setPhase('Breathe Out');
    setTimer(8);
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0.5, duration: 8000, useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) startInhale(); // loop
    });
  };

  const toggleSession = () => setIsActive(!isActive);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1A1A2E', '#16213E'] : ['#E0F2FE', '#F0F9FF']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { setIsActive(false); navigation.goBack(); }} style={styles.backBtn} activeOpacity={0.7}>
            <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            <ChevronLeft size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Typography variant="largeTitle" style={{ color: theme.colors.textHigh, textAlign: 'center', marginBottom: 8 }}>
            Relax & Breathe
          </Typography>
          <Typography variant="body" style={{ color: theme.colors.textMedium, textAlign: 'center', paddingHorizontal: 40 }}>
            Follow the 4-7-8 breathing method to reduce stress and prepare for sleep.
          </Typography>

          <View style={styles.animationContainer}>
            {/* Animated Breathing Circle */}
            <Animated.View style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]}>
              <LinearGradient
                colors={isDark ? ['#3B82F6', '#8B5CF6'] : ['#60A5FA', '#A78BFA']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
            </Animated.View>

            {/* Center Text */}
            <View style={styles.centerInfo}>
              <Typography variant="title1" style={{ color: theme.colors.textHigh }}>{phase}</Typography>
              {isActive && (
                <Typography variant="headline" style={{ color: theme.colors.textMedium, marginTop: 4 }}>
                  {timer}s
                </Typography>
              )}
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              activeOpacity={0.8}
              onPress={toggleSession}
            >
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.1)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />

              {isActive ? (
                <>
                  <Square size={24} color={theme.colors.textHigh} fill={theme.colors.textHigh} />
                  <Typography variant="headline" style={{ color: theme.colors.textHigh, marginLeft: 12 }}>Stop</Typography>
                </>
              ) : (
                <>
                  <Play size={24} color={theme.colors.textHigh} fill={theme.colors.textHigh} />
                  <Typography variant="headline" style={{ color: theme.colors.textHigh, marginLeft: 12 }}>Start</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  animationContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 80,
  },
  breathingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    position: 'absolute',
    overflow: 'hidden',
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  controls: {
    width: '100%',
    paddingHorizontal: 40,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  }
});

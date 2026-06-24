import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography } from '../constants/theme';

const { width } = Dimensions.get('window');
const SIZE = width * 0.65;
const STROKE_WIDTH = 20;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PregnancyRingProps {
  progress: number; // 0 to 1
  weeks: number;
  days: number;
}

const PregnancyRing: React.FC<PregnancyRingProps> = ({ progress, weeks, days }) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCUMFERENCE - CIRCUMFERENCE * animatedProgress.value;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={Colors.primary} stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.brandOrange} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Background Circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={Colors.surface}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#grad)"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            originX={SIZE / 2}
            originY={SIZE / 2}
          />
        </Svg>
        <View style={styles.innerContent}>
          <Text style={styles.weekText}>{weeks}</Text>
          <Text style={styles.weekLabel}>WEEKS</Text>
          <Text style={styles.daysText}>{days} days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  shadowContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: SIZE / 2,
  },
  innerContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 70,
  },
  weekLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 2,
  },
  daysText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default PregnancyRing;

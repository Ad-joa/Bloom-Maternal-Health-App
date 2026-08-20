import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Baby, Play, Square, RotateCcw } from 'lucide-react-native';
import { theme } from '../theme/theme';
import { Typography } from './Typography';
import { Card } from './Card';

export function KickCounter() {


  const [isActive, setIsActive] = useState(false);
  const [kicks, setKicks] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleStart = () => {


    setIsActive(true);
    setStartTime(new Date());
    setKicks(0);
  };

  const handleStop = () => {


    setIsActive(false);
    // In a real app, we would save to backend here
    alert(`Session saved! You counted ${kicks} kicks.`);
    setKicks(0);
    setStartTime(null);
  };

  const handleKick = () => {


    if (!isActive) return;
    setKicks(prev => prev + 1);
    
    // Animate the button
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Baby color={theme.colors.primaryDark} size={20} />
          </View>
          <View>
            <Typography variant="headline" color={theme.colors.textHigh}>Kick Counter</Typography>
            <Typography variant="caption1" color={theme.colors.textMedium}>Track baby's movements</Typography>
          </View>
        </View>
        {!isActive ? (
          <TouchableOpacity style={styles.actionBtn} onPress={handleStart}>
            <Play color={theme.colors.primaryDark} size={16} />
            <Typography variant="subhead" color={theme.colors.primaryDark} style={{marginLeft: 4}}>Start</Typography>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]} onPress={handleStop}>
            <Square color={theme.colors.danger} size={16} />
            <Typography variant="subhead" color={theme.colors.danger} style={{marginLeft: 4}}>Stop</Typography>
          </TouchableOpacity>
        )}
      </View>

      {isActive && (
        <View style={styles.activeArea}>
          <Typography variant="title1" align="center" style={styles.countText}>
            {kicks} <Typography variant="title3">kicks</Typography>
          </Typography>
          
          <TouchableOpacity activeOpacity={0.7} onPress={handleKick}>
            <Animated.View style={[styles.bigTapButton, { transform: [{ scale: scaleAnim }] }]}>
              <Baby color="#FFF" size={48} />
              <Typography variant="headline" color="#FFF" style={{marginTop: 8}}>Tap for Kick</Typography>
            </Animated.View>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    marginBottom: theme.spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeArea: {
    marginTop: 24,
    alignItems: 'center',
    paddingBottom: 8,
  },
  countText: {
    fontSize: 48,
    color: theme.colors.primaryDark,
    marginBottom: 24,
  },
  bigTapButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});

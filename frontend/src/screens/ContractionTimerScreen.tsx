import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, Play, Square, Activity, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type Contraction = {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  frequency?: number; // time since last contraction start
};

export default function ContractionTimerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  
  const [isTiming, setIsTiming] = useState(false);
  const [currentStart, setCurrentStart] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming && currentStart) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date().getTime() - currentStart.getTime()) / 1000));
      }, 1000);
      
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
    return () => clearInterval(interval);
  }, [isTiming, currentStart]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (isTiming) {
      // Stop timer
      const now = new Date();
      const duration = Math.floor((now.getTime() - currentStart!.getTime()) / 1000);
      
      let frequency = undefined;
      if (contractions.length > 0) {
         const lastStart = contractions[0].startTime;
         frequency = Math.floor((currentStart!.getTime() - lastStart.getTime()) / 1000);
      }

      const newContraction: Contraction = {
        id: Math.random().toString(),
        startTime: currentStart!,
        endTime: now,
        duration,
        frequency,
      };

      const newHistory = [newContraction, ...contractions];
      setContractions(newHistory);
      setIsTiming(false);
      setCurrentStart(null);
      setElapsedSeconds(0);
      
      checkAlertStatus(newHistory);
    } else {
      // Start timer
      setCurrentStart(new Date());
      setIsTiming(true);
    }
  };

  const checkAlertStatus = (history: Contraction[]) => {
    if (history.length >= 3) {
      const recent = history.slice(0, 3);
      // Check if frequency is ~5 mins (300s) and duration is ~1 min (60s)
      const isFrequent = recent.every(c => c.frequency && c.frequency <= 360);
      const isLong = recent.every(c => c.duration && c.duration >= 45);
      
      if (isFrequent && isLong) {
        Alert.alert(
          "Time to Go!", 
          "Your contractions are 5 minutes apart and lasting 1 minute. It's time to head to the hospital or call your midwife."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={isDark ? ['#1A1212', '#121212'] : ['#FFEBF0', '#FFFDFD']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.colors.textHigh} size={28} />
        </TouchableOpacity>
        <Typography variant="title2" style={{ fontFamily: theme.typography.families.headingBold }}>
          Contraction Timer
        </Typography>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Massive Timer Button */}
        <View style={styles.timerContainer}>
          {isTiming && (
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
          )}
          <TouchableOpacity 
            style={[styles.mainButton, isTiming ? styles.mainButtonActive : styles.mainButtonInactive]} 
            onPress={handleToggleTimer}
            activeOpacity={0.8}
          >
            {isTiming ? (
              <Square fill="#FFF" color="#FFF" size={48} />
            ) : (
              <Play fill="#FFF" color="#FFF" size={48} style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
          <Typography variant="largeTitle" style={styles.timeText}>
            {isTiming ? formatTime(elapsedSeconds) : '00:00'}
          </Typography>
          <Typography variant="subhead" color={theme.colors.textMedium} style={{ marginTop: 8 }}>
            {isTiming ? 'Tap to stop' : 'Tap to start timing'}
          </Typography>
        </View>

        {/* Warning Banner */}
        <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={styles.warningBanner}>
           <AlertTriangle color={theme.colors.danger} size={24} style={{ marginRight: 12 }} />
           <View style={{ flex: 1 }}>
             <Typography variant="subhead" style={{ fontFamily: theme.typography.families.headingSemibold }}>5-1-1 Rule</Typography>
             <Typography variant="caption1" color={theme.colors.textMedium}>Head to the hospital when contractions are 5 mins apart, lasting 1 min, for 1 hour.</Typography>
           </View>
        </BlurView>

        {/* History List */}
        <View style={styles.historySection}>
          <Typography variant="title3" style={{ marginBottom: 16, fontFamily: theme.typography.families.headingSemibold }}>
            Recent History
          </Typography>
          
          {contractions.length === 0 ? (
            <View style={styles.emptyState}>
              <Activity color={theme.colors.textMedium} size={48} strokeWidth={1.5} />
              <Typography variant="body" color={theme.colors.textMedium} style={{ marginTop: 16 }}>
                No contractions logged yet.
              </Typography>
            </View>
          ) : (
            contractions.map((c, index) => (
              <View key={c.id} style={styles.historyCard}>
                <View style={styles.historyRow}>
                   <View>
                     <Typography variant="caption1" color={theme.colors.textMedium}>Start Time</Typography>
                     <Typography variant="body" style={{ fontFamily: theme.typography.families.headingSemibold }}>
                       {c.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                     </Typography>
                   </View>
                   <View style={{ alignItems: 'center' }}>
                     <Typography variant="caption1" color={theme.colors.textMedium}>Duration</Typography>
                     <Typography variant="body" style={{ fontFamily: theme.typography.families.headingSemibold, color: theme.colors.primaryDark }}>
                       {formatTime(c.duration || 0)}
                     </Typography>
                   </View>
                   <View style={{ alignItems: 'flex-end' }}>
                     <Typography variant="caption1" color={theme.colors.textMedium}>Apart</Typography>
                     <Typography variant="body" style={{ fontFamily: theme.typography.families.headingSemibold }}>
                       {c.frequency ? formatTime(c.frequency) : '--:--'}
                     </Typography>
                   </View>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 48,
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    top: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primaryLight + '50',
  },
  mainButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 2,
  },
  mainButtonInactive: {
    backgroundColor: theme.colors.primary,
  },
  mainButtonActive: {
    backgroundColor: theme.colors.danger,
  },
  timeText: {
    marginTop: 32,
    fontSize: 56,
    fontFamily: theme.typography.families.headingBold,
    fontVariant: ['tabular-nums'],
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  historySection: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
    borderRadius: 24,
  },
  historyCard: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

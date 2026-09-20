import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, Baby, Clock, CheckCircle } from 'lucide-react-native';

export default function KickCounterScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  
  const [kicks, setKicks] = useState<{ id: string; time: Date }[]>([]);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStart && kicks.length < 10) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date().getTime() - sessionStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStart, kicks.length]);

  const handleLogKick = () => {
    if (kicks.length >= 10) return;
    const now = new Date();
    if (kicks.length === 0) {
      setSessionStart(now);
      setElapsedSeconds(0);
    }
    setKicks(prev => [{ id: Math.random().toString(), time: now }, ...prev]);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isComplete = kicks.length >= 10;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1A1212', '#121212'] : ['#F3E8FF', '#FAFAFA']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            <ChevronLeft size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title2" style={{ color: theme.colors.textHigh, marginLeft: 16 }}>
            Kick Counter
          </Typography>
        </View>

        <View style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Typography variant="title2" style={{ color: theme.colors.primaryDark }}>{kicks.length}/10</Typography>
                <Typography variant="caption2" style={{ color: theme.colors.textMedium, marginTop: 4 }}>KICKS</Typography>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusItem}>
                <Typography variant="title2" style={{ color: theme.colors.textHigh }}>{formatTime(elapsedSeconds)}</Typography>
                <Typography variant="caption2" style={{ color: theme.colors.textMedium, marginTop: 4 }}>ELAPSED TIME</Typography>
              </View>
            </View>
          </View>

          {/* Main Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.bigButton, isComplete && styles.bigButtonComplete]} 
              activeOpacity={0.8}
              onPress={handleLogKick}
              disabled={isComplete}
            >
              <LinearGradient 
                colors={isComplete 
                  ? ['#10B981', '#059669'] 
                  : ['#9333EA', '#7E22CE']
                } 
                style={StyleSheet.absoluteFillObject} 
              />
              {isComplete ? (
                <>
                  <CheckCircle size={64} color="#FFF" />
                  <Typography variant="title3" style={{ color: '#FFF', marginTop: 12 }}>Completed!</Typography>
                </>
              ) : (
                <>
                  <Baby size={64} color="#FFF" />
                  <Typography variant="title3" style={{ color: '#FFF', marginTop: 12 }}>Tap to Log Kick</Typography>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* History List */}
          <View style={{ flex: 1, marginTop: 32 }}>
            <Typography variant="title3" style={{ color: theme.colors.textHigh, marginBottom: 16 }}>Session History</Typography>
            <ScrollView showsVerticalScrollIndicator={false}>
              {kicks.length === 0 ? (
                <Typography variant="body" style={{ color: theme.colors.textMedium, textAlign: 'center', marginTop: 20 }}>
                  Tap the button when you feel a kick to start a new session.
                </Typography>
              ) : (
                kicks.map((kick, index) => (
                  <View key={kick.id} style={styles.historyItem}>
                    <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
                    <LinearGradient colors={isDark ? ['rgba(255,255,255,0.02)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
                    <View style={styles.historyIndex}>
                      <Typography variant="caption1" style={{ color: theme.colors.primaryDark, fontFamily: theme.typography.families.headingBold }}>
                        {kicks.length - index}
                      </Typography>
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Typography variant="headline" style={{ color: theme.colors.textHigh }}>Kick Felt</Typography>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Clock size={14} color={theme.colors.textMedium} style={{ marginRight: 6 }} />
                      <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>
                        {kick.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </View>
                  </View>
                ))
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  statusCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  bigButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bigButtonComplete: {
    shadowColor: '#10B981',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
  },
  historyIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(147,51,234,0.15)' : 'rgba(147,51,234,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

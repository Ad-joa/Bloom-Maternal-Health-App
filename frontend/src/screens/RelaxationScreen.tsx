import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Wind, Heart, Flower } from 'lucide-react-native';
import { BounceButton } from '../components/BounceButton';

export default function RelaxationScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Ready');
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const loopAnim = useRef<Animated.CompositeAnimation | null>(null);

  const startBreathing = () => {
    if (isBreathing) {
      // Stop
      loopAnim.current?.stop();
      Animated.timing(breatheAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      setIsBreathing(false);
      setBreathText('Ready');
      return;
    }

    setIsBreathing(true);
    setBreathText('Breathe In');
    
    const inhale = Animated.timing(breatheAnim, {
      toValue: 1.5,
      duration: 4000,
      easing: Easing.inOut(Easing.sine),
      useNativeDriver: true,
    });
    const hold1 = Animated.timing(breatheAnim, {
      toValue: 1.5,
      duration: 7000,
      useNativeDriver: true,
    });
    const exhale = Animated.timing(breatheAnim, {
      toValue: 1,
      duration: 8000,
      easing: Easing.inOut(Easing.sine),
      useNativeDriver: true,
    });

    const sequence = Animated.sequence([
      Animated.timing(breatheAnim, { toValue: 1, duration: 10, useNativeDriver: true }),
    ]); // trigger start

    loopAnim.current = Animated.loop(
      Animated.sequence([
        inhale,
        hold1,
        exhale
      ])
    );
    
    // We can't easily sync React state perfectly with Animated.loop, so we use setInterval for the text
    let cycle = 0;
    const updateText = () => {
      if (!isBreathing) return;
      // 4-7-8 breathing
      // 0-4s: Inhale
      // 4-11s: Hold
      // 11-19s: Exhale
      setBreathText('Breathe In (4s)');
      setTimeout(() => setBreathText('Hold (7s)'), 4000);
      setTimeout(() => setBreathText('Exhale Slowly (8s)'), 11000);
    };
    
    updateText();
    const interval = setInterval(updateText, 19000);
    
    loopAnim.current.start();
    
    // Override stop to also clear interval
    const oldStop = loopAnim.current.stop.bind(loopAnim.current);
    loopAnim.current.stop = () => {
      clearInterval(interval);
      oldStop();
    };
  };

  useEffect(() => {
    return () => {
      if (loopAnim.current) loopAnim.current.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title3" style={styles.headerTitle}>Relaxation</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient
            colors={isDark ? ['rgba(129,140,248,0.15)', 'rgba(0,0,0,0)'] : ['rgba(129,140,248,0.15)', 'rgba(255,255,255,0)']}
            style={styles.heroCard}
          >
            <View style={{ backgroundColor: 'rgba(129,140,248,0.15)', padding: 16, borderRadius: 24, marginBottom: 16 }}>
              <Flower size={40} color="#818CF8" />
            </View>
            <Typography variant="title1" style={styles.heroTitle}>Manage Stress</Typography>
            <Typography variant="body" style={styles.heroBody}>
              Take a moment for yourself. Stress management is vital for both you and your baby's wellbeing.
            </Typography>
          </LinearGradient>

          {/* Breathing Exercise */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={{ backgroundColor: isDark ? 'rgba(129,140,248,0.3)' : 'rgba(129,140,248,0.15)', padding: 8, borderRadius: 12 }}>
                <Wind size={20} color="#818CF8" />
              </View>
              <Typography variant="title3" style={[styles.sectionTitle, { color: '#818CF8' }]}>
                4-7-8 Breathing
              </Typography>
            </View>

            <View style={styles.card}>
              <Typography variant="body" style={styles.itemDesc}>
                This breathing technique acts as a natural tranquilizer for the nervous system.
              </Typography>

              <View style={styles.breathingContainer}>
                <Animated.View style={[styles.breathingCircle, { transform: [{ scale: breatheAnim }] }]} />
                <View style={styles.breathingCenter}>
                  <Typography variant="headline" style={styles.breathingText}>{breathText}</Typography>
                </View>
              </View>

              <BounceButton style={styles.actionButton} onPress={startBreathing}>
                <Typography variant="headline" style={styles.actionButtonText}>
                  {isBreathing ? 'Stop Exercise' : 'Start Breathing'}
                </Typography>
              </BounceButton>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={{ backgroundColor: isDark ? 'rgba(244,114,182,0.3)' : 'rgba(244,114,182,0.15)', padding: 8, borderRadius: 12 }}>
                <Heart size={20} color="#F472B6" />
              </View>
              <Typography variant="title3" style={[styles.sectionTitle, { color: '#F472B6' }]}>
                Daily De-Stress Tips
              </Typography>
            </View>

            <View style={styles.card}>
              {[
                "Take a warm bath with Epsom salts.",
                "Listen to a calming prenatal meditation podcast.",
                "Journal 3 things you are grateful for today.",
                "Disconnect from screens 1 hour before bed.",
                "Gentle stretching or prenatal yoga for 10 mins."
              ].map((tip, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.bullet, { backgroundColor: '#F472B6' }]} />
                  <Typography variant="body" style={styles.itemTitle}>{tip}</Typography>
                </View>
              ))}
            </View>
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
    alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
  },
  heroTitle: {
    color: theme.colors.textHigh,
    marginBottom: 8,
    textAlign: 'center'
  },
  heroBody: {
    color: theme.colors.textMedium,
    textAlign: 'center',
    lineHeight: 22
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.headingSemibold,
  },
  card: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FAFAFA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#EEEEEE',
  },
  bullet: {
    width: 8, height: 8,
    borderRadius: 4,
  },
  itemTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
    flex: 1,
  },
  itemDesc: {
    color: theme.colors.textMedium,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center'
  },
  breathingContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(129,140,248,0.15)',
    borderWidth: 2,
    borderColor: '#818CF8',
    position: 'absolute'
  },
  breathingCenter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    color: '#818CF8',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#818CF8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
  }
});

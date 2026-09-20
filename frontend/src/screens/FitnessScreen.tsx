import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Dumbbell, Zap } from 'lucide-react-native';
import { BounceButton } from '../components/BounceButton';

export default function FitnessScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  
  const [isKegelActive, setIsKegelActive] = useState(false);
  const [kegelText, setKegelText] = useState('Ready');
  const squeezeAnim = useRef(new Animated.Value(1)).current;
  const loopAnim = useRef<Animated.CompositeAnimation | null>(null);

  const startKegel = () => {
    if (isKegelActive) {
      loopAnim.current?.stop();
      Animated.timing(squeezeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      setIsKegelActive(false);
      setKegelText('Ready');
      return;
    }

    setIsKegelActive(true);
    setKegelText('Squeeze');
    
    const squeeze = Animated.timing(squeezeAnim, {
      toValue: 0.6,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });
    const hold = Animated.timing(squeezeAnim, {
      toValue: 0.6,
      duration: 3000,
      useNativeDriver: true,
    });
    const release = Animated.timing(squeezeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });
    const rest = Animated.timing(squeezeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    });

    loopAnim.current = Animated.loop(
      Animated.sequence([squeeze, hold, release, rest])
    );
    
    let isSqueezing = true;
    const updateText = () => {
      if (!isKegelActive) return;
      setKegelText('Squeeze & Hold (3s)');
      setTimeout(() => setKegelText('Release & Rest (3s)'), 4000);
    };
    
    updateText();
    const interval = setInterval(updateText, 8000);
    
    loopAnim.current.start();
    
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title3" style={styles.headerTitle}>Fitness</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient
            colors={isDark ? ['rgba(80,227,194,0.15)', 'rgba(0,0,0,0)'] : ['rgba(80,227,194,0.15)', 'rgba(255,255,255,0)']}
            style={styles.heroCard}
          >
            <View style={{ backgroundColor: 'rgba(80,227,194,0.15)', padding: 16, borderRadius: 24, marginBottom: 16 }}>
              <Activity size={40} color="#50E3C2" />
            </View>
            <Typography variant="title1" style={styles.heroTitle}>Stay Active</Typography>
            <Typography variant="body" style={styles.heroBody}>
              Safe exercises and Kegels strengthen your muscles to prepare your body for labor and ease recovery.
            </Typography>
          </LinearGradient>

          {/* Kegel Exercise */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={{ backgroundColor: isDark ? 'rgba(80,227,194,0.3)' : 'rgba(80,227,194,0.15)', padding: 8, borderRadius: 12 }}>
                <Zap size={20} color="#50E3C2" />
              </View>
              <Typography variant="title3" style={[styles.sectionTitle, { color: '#50E3C2' }]}>
                Kegel Trainer
              </Typography>
            </View>

            <View style={styles.card}>
              <Typography variant="body" style={styles.itemDesc}>
                Strengthen your pelvic floor muscles. Aim for 3 sets of 10-15 reps daily.
              </Typography>

              <View style={styles.animationContainer}>
                <Animated.View style={[styles.kegelCircle, { transform: [{ scale: squeezeAnim }] }]} />
                <View style={styles.animationCenter}>
                  <Typography variant="headline" style={styles.animationText}>{kegelText}</Typography>
                </View>
              </View>

              <BounceButton style={styles.actionButton} onPress={startKegel}>
                <Typography variant="headline" style={styles.actionButtonText}>
                  {isKegelActive ? 'Stop Exercise' : 'Start Squeezing'}
                </Typography>
              </BounceButton>
            </View>
          </View>

          {/* Safe Workouts */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={{ backgroundColor: isDark ? 'rgba(74,144,226,0.3)' : 'rgba(74,144,226,0.15)', padding: 8, borderRadius: 12 }}>
                <Dumbbell size={20} color="#4A90E2" />
              </View>
              <Typography variant="title3" style={[styles.sectionTitle, { color: '#4A90E2' }]}>
                Safe Pregnancy Workouts
              </Typography>
            </View>

            <View style={styles.card}>
              {[
                { title: "Walking", desc: "A great cardiovascular workout without jarring your knees and ankles." },
                { title: "Swimming", desc: "Water supports your extra weight and provides gentle resistance." },
                { title: "Prenatal Yoga", desc: "Helps maintain flexibility and eases tension, plus teaches breathing techniques." },
                { title: "Stationary Cycling", desc: "Safer than a regular bike as your center of gravity changes." },
              ].map((workout, i) => (
                <View key={i} style={styles.itemRow}>
                  <View style={[styles.bullet, { backgroundColor: '#4A90E2' }]} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="body" style={styles.itemTitle}>{workout.title}</Typography>
                    <Typography variant="caption1" style={styles.itemSubText}>{workout.desc}</Typography>
                  </View>
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
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#EEEEEE',
  },
  bullet: {
    width: 8, height: 8,
    borderRadius: 4,
    marginTop: 6
  },
  itemTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
  },
  itemSubText: {
    color: theme.colors.textMedium,
    marginTop: 4,
    lineHeight: 18,
  },
  itemDesc: {
    color: theme.colors.textMedium,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center'
  },
  animationContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  kegelCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(80,227,194,0.15)',
    borderWidth: 3,
    borderColor: '#50E3C2',
    position: 'absolute'
  },
  animationCenter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationText: {
    color: '#3BAA93',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#3BAA93',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
  }
});

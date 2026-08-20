import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import {
  Activity, Droplet, Stethoscope, Heart, Sun,
  Moon, Zap, ChevronRight, Bell,
} from 'lucide-react-native';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { getAncVisits } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Baby size by week (week → fruit)
const BABY_SIZE_MAP: Record<number, { fruit: string; size: string }> = {
  4: { fruit: 'Poppy Seed', size: '1mm' },
  8: { fruit: 'Raspberry', size: '1.6cm' },
  12: { fruit: 'Lime', size: '5.4cm' },
  16: { fruit: 'Avocado', size: '11.6cm' },
  20: { fruit: 'Banana', size: '25cm' },
  24: { fruit: 'Ear of Corn', size: '30cm' },
  28: { fruit: 'Eggplant', size: '37.6cm' },
  32: { fruit: 'Squash', size: '42.4cm' },
  36: { fruit: 'Honeydew Melon', size: '47.4cm' },
  40: { fruit: 'Watermelon', size: '51cm' },
};

const getBabySize = (weeks: number) => {
  const milestones = Object.keys(BABY_SIZE_MAP)
    .map(Number)
    .sort((a, b) => a - b);
  const closest = milestones.reduce((prev, curr) =>
    Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
  );
  return BABY_SIZE_MAP[closest] ?? { fruit: 'Squash', size: '42cm' };
};

const DAILY_TIPS = [
  'Drink at least 8–10 glasses of water today.',
  'Take a gentle 20-minute walk if you feel up to it.',
  'Practice 5 minutes of deep belly breathing.',
  'Eat a calcium-rich snack like yogurt or cheese.',
  'Rest your feet elevated for 15 minutes this afternoon.',
  'Call or message a friend who lifts your spirit.',
  'Take your prenatal vitamin if you haven\'t today.',
];

const TRIMESTER_MILESTONES: Record<number, string> = {
  1: 'Your baby\'s heart started beating!',
  2: 'Your baby can hear your voice now.',
  3: 'Baby is practicing breathing movements.',
};

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuth();

  const dueDate = user?.due_date || '';
  const rawWeeks = dueDate ? getWeeksPregnant(dueDate) : 0;
  const weeksPregnant = rawWeeks > 0 ? rawWeeks : 32;
  const daysLeft = dueDate ? getDaysUntilDue(dueDate) : 56;
  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;
  const babySize = getBabySize(weeksPregnant);
  const progressPercent = Math.min((weeksPregnant / 40) * 100, 100);
  const todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

  const [nextVisit, setNextVisit] = useState<any>(null);
  const progressAnim = useState(new Animated.Value(0))[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const GreetingIcon = hour < 18 ? Sun : Moon;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    if (user?.id) {
      getAncVisits()
        .then(data => {
          const upcoming = (data || []).find((v: any) => v.status === 'scheduled');
          setNextVisit(upcoming);
        })
        .catch(() => {});
    }
  }, [user]);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.colors.textHigh === '#F5F5F5' ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <View style={styles.greetingRow}>
                <GreetingIcon size={16} color={theme.colors.primaryDark} />
                <Typography variant="subhead" style={styles.greetingText}>
                  {greeting}
                </Typography>
              </View>
              <Typography variant="title1" style={styles.nameText}>
                {user?.name ? user.name.split(' ')[0] : 'Mama'} 👋
              </Typography>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={() => {}}>
              <Bell size={22} color={theme.colors.textHigh} />
            </TouchableOpacity>
          </View>

          {/* ── Pregnancy Progress Hero ── */}
          <View style={styles.heroCard}>
            {/* Week badge */}
            <View style={styles.heroTopRow}>
              <View>
                <Typography variant="caption1" style={styles.heroLabel}>CURRENT WEEK</Typography>
                <Typography variant="largeTitle" style={styles.heroWeek}>
                  {weeksPregnant} <Typography variant="title3" style={styles.heroWeekUnit}>wks</Typography>
                </Typography>
              </View>
              <View style={styles.trimesterBadge}>
                <Typography variant="caption1" style={styles.trimesterText}>
                  T{trimester}
                </Typography>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: barWidth }]} />
            </View>
            <View style={styles.progressLabels}>
              <Typography variant="caption2" style={styles.progressLabel}>Week 1</Typography>
              <Typography variant="caption2" style={styles.progressLabel}>Week 40</Typography>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Typography variant="title2" style={styles.statValue}>{daysLeft}</Typography>
                <Typography variant="caption1" style={styles.statLabel}>Days Left</Typography>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typography variant="title2" style={styles.statValue}>{40 - weeksPregnant}</Typography>
                <Typography variant="caption1" style={styles.statLabel}>Weeks To Go</Typography>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typography variant="title2" style={styles.statValue}>{Math.round(progressPercent)}%</Typography>
                <Typography variant="caption1" style={styles.statLabel}>Complete</Typography>
              </View>
            </View>
          </View>

          {/* ── Baby Development Card ── */}
          <View style={styles.devCard}>
            <LinearGradient
              colors={[theme.colors.primaryLight, theme.colors.surface]}
              style={styles.devGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <View style={styles.devContent}>
              <View>
                <Typography variant="caption1" style={styles.devLabel}>BABY THIS WEEK</Typography>
                <Typography variant="title3" style={styles.devFruit}>
                  Size of a {babySize.fruit}
                </Typography>
                <Typography variant="subhead" style={styles.devSize}>{babySize.size} long</Typography>
                <Typography variant="caption1" style={styles.devMilestone}>
                  {TRIMESTER_MILESTONES[trimester]}
                </Typography>
              </View>
              <View style={styles.devEmoji}>
                <Typography style={{ fontSize: 52 }}>🌱</Typography>
              </View>
            </View>
          </View>

          {/* ── Daily Tip ── */}
          <View style={styles.tipCard}>
            <View style={styles.tipRow}>
              <View style={styles.tipIconBg}>
                <Zap size={18} color={theme.colors.accentOrange} />
              </View>
              <View style={styles.tipTextWrap}>
                <Typography variant="caption1" style={styles.tipLabel}>TIP OF THE DAY</Typography>
                <Typography variant="subhead" style={styles.tipText}>{todayTip}</Typography>
              </View>
            </View>
          </View>

          {/* ── Quick Actions ── */}
          <Typography variant="title3" style={styles.sectionTitle}>Quick Actions</Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsRow}
          >
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => navigation.navigate('Tracker')}
              activeOpacity={0.75}
            >
              <View style={[styles.pillIcon, { backgroundColor: '#FEE2E2' }]}>
                <Activity size={18} color="#DC2626" />
              </View>
              <View>
                <Typography variant="subhead" style={styles.pillTitle}>Log Vitals</Typography>
                <Typography variant="caption1" style={styles.pillSub}>BP & Weight</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => navigation.navigate('Tracker')}
              activeOpacity={0.75}
            >
              <View style={[styles.pillIcon, { backgroundColor: '#FEF3C7' }]}>
                <Heart size={18} color="#D97706" />
              </View>
              <View>
                <Typography variant="subhead" style={styles.pillTitle}>Symptoms</Typography>
                <Typography variant="caption1" style={styles.pillSub}>How you feel</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => navigation.navigate('ANCVisit')}
              activeOpacity={0.75}
            >
              <View style={[styles.pillIcon, { backgroundColor: '#D1FAE5' }]}>
                <Stethoscope size={18} color="#059669" />
              </View>
              <View>
                <Typography variant="subhead" style={styles.pillTitle}>ANC Visit</Typography>
                <Typography variant="caption1" style={styles.pillSub}>
                  {nextVisit ? 'Upcoming' : 'Schedule'}
                </Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => navigation.navigate('Support')}
              activeOpacity={0.75}
            >
              <View style={[styles.pillIcon, { backgroundColor: '#EDE9FE' }]}>
                <Droplet size={18} color="#7C3AED" />
              </View>
              <View>
                <Typography variant="subhead" style={styles.pillTitle}>Ask Bloom</Typography>
                <Typography variant="caption1" style={styles.pillSub}>AI Support</Typography>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* ── Next Appointment ── */}
          {nextVisit && (
            <TouchableOpacity
              style={styles.apptCard}
              onPress={() => navigation.navigate('ANCVisit')}
              activeOpacity={0.8}
            >
              <View>
                <Typography variant="caption1" style={styles.apptLabel}>NEXT APPOINTMENT</Typography>
                <Typography variant="headline" style={styles.apptDate}>
                  {nextVisit.scheduled_date || nextVisit.date || 'Upcoming Visit'}
                </Typography>
                <Typography variant="caption1" style={styles.apptFacility}>
                  {nextVisit.facility || 'Clinic Visit'}
                </Typography>
              </View>
              <ChevronRight size={20} color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 140,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greetingText: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nameText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 26,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Hero progress card
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLabel: {
    color: theme.colors.textMedium,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroWeek: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
  },
  heroWeekUnit: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 18,
  },
  trimesterBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  trimesterText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    letterSpacing: 1,
  },
  progressTrack: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 100,
    backgroundColor: theme.colors.primaryDark,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressLabel: {
    color: theme.colors.textMedium,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 24,
  },
  statLabel: {
    color: theme.colors.textMedium,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },

  // Baby dev card
  devCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  devGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  devContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  devLabel: {
    color: theme.colors.primaryDark,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  devFruit: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 2,
  },
  devSize: {
    color: theme.colors.textMedium,
    marginBottom: 8,
  },
  devMilestone: {
    color: theme.colors.textMedium,
    fontStyle: 'italic',
    maxWidth: 180,
  },
  devEmoji: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Tip card
  tipCard: {
    marginHorizontal: 24,
    marginBottom: 28,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  tipIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextWrap: { flex: 1 },
  tipLabel: {
    color: theme.colors.accentOrange,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  tipText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyMedium,
    lineHeight: 20,
  },

  // Section title
  sectionTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginHorizontal: 24,
    marginBottom: 14,
  },

  // Actions
  actionsRow: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 24,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 100,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  pillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
    marginBottom: 1,
  },
  pillSub: { color: theme.colors.textMedium },

  // Appointment
  apptCard: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryDark,
  },
  apptLabel: {
    color: theme.colors.primaryDark,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  apptDate: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 2,
  },
  apptFacility: { color: theme.colors.textMedium },
});

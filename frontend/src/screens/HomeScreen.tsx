import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Animated, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import {
  Activity, Droplets, Stethoscope, Heart, Sun,
  Moon, Sparkles, Bell, ChevronRight, Zap,
  Baby, Apple, Lightbulb,
} from 'lucide-react-native';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { getAncVisits, getEducationalContent } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

// ── Data ────────────────────────────────────────────────
const BABY_SIZE_MAP: Record<number, { emoji: string; fruit: string; size: string }> = {
  4:  { emoji: '🌸', fruit: 'Poppy Seed',     size: '1 mm' },
  8:  { emoji: '🍇', fruit: 'Raspberry',       size: '1.6 cm' },
  12: { emoji: '🍋', fruit: 'Lime',            size: '5.4 cm' },
  16: { emoji: '🥑', fruit: 'Avocado',         size: '11.6 cm' },
  20: { emoji: '🍌', fruit: 'Banana',          size: '25 cm' },
  24: { emoji: '🌽', fruit: 'Ear of Corn',     size: '30 cm' },
  28: { emoji: '🍆', fruit: 'Eggplant',        size: '37.6 cm' },
  32: { emoji: '🍍', fruit: 'Pineapple',        size: '42.4 cm' },
  36: { emoji: '🍈', fruit: 'Honeydew Melon',  size: '47.4 cm' },
  40: { emoji: '🍉', fruit: 'Watermelon',      size: '51 cm' },
};

const getBabySize = (weeks: number) => {
  const keys = Object.keys(BABY_SIZE_MAP).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
  );
  return BABY_SIZE_MAP[closest] ?? BABY_SIZE_MAP[32];
};

const DAILY_TIPS = [
  { tip: 'Drink at least 8–10 glasses of water today.', icon: '💧' },
  { tip: 'Take a gentle 20-minute walk if you feel up to it.', icon: '🚶‍♀️' },
  { tip: 'Practice 5 minutes of deep belly breathing.', icon: '🧘‍♀️' },
  { tip: 'Eat a calcium-rich snack like yogurt or cheese.', icon: '🥛' },
  { tip: 'Rest with your feet elevated for 15 minutes.', icon: '🛋️' },
  { tip: 'Connect with a friend who lifts your spirit.', icon: '❤️' },
  { tip: 'Take your prenatal vitamin if you haven\'t today.', icon: '💊' },
];

const TRIMESTER_FACTS: Record<number, { title: string; body: string }> = {
  1: { title: 'Heart Beating', body: 'Your baby\'s heart started beating around week 6.' },
  2: { title: 'Can Hear You', body: 'Your baby can hear your voice and respond to sounds.' },
  3: { title: 'Breathing Practice', body: 'Baby is practicing breathing movements to prepare for birth.' },
};

// ── Circular Progress Ring ───────────────────────────────
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const RING_SIZE = 180;
const STROKE = 10;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

function CircularProgress({ percent, isDark, theme }: { percent: number; isDark: boolean; theme: any }) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: percent,
      duration: 1400,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const strokeDashoffset = animVal.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
      {/* Track */}
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={R}
        stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
        strokeWidth={STROKE}
        fill="none"
      />
      {/* Progress */}
      <AnimatedCircle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={R}
        stroke={theme.colors.primaryDark}
        strokeWidth={STROKE}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
      />
    </Svg>
  );
}

// ── Main Screen ──────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();

  const dueDate = user?.due_date || '';
  const rawWeeks = dueDate ? getWeeksPregnant(dueDate) : 0;
  const weeksPregnant = rawWeeks > 0 ? rawWeeks : 32;
  const daysLeft = dueDate ? getDaysUntilDue(dueDate) : 56;
  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;
  const babySize = getBabySize(weeksPregnant);
  const progressPercent = Math.min((weeksPregnant / 40) * 100, 100);

  const dayIndex = new Date().getDay() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[dayIndex];
  const trimesterFact = TRIMESTER_FACTS[trimester];

  const [nextVisit, setNextVisit] = useState<any>(null);
  const [dynamicTip, setDynamicTip] = useState<{title: string, body: string} | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  const hour = new Date().getHours();
  const isMorning = hour < 12;
  const isAfternoon = hour >= 12 && hour < 18;
  const isEvening = hour >= 18;
  const greeting = isMorning ? 'Good Morning' : isAfternoon ? 'Good Afternoon' : 'Good Evening';
  const greetingIconColor = isMorning ? '#F59E0B' : isAfternoon ? '#F97316' : '#818CF8';

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    if (user?.id) {
      getAncVisits()
        .then(data => {
          const upcoming = (data || []).find((v: any) => v.status === 'scheduled');
          setNextVisit(upcoming);
        })
        .catch(() => {});
        
      getEducationalContent(trimester, 'general')
        .then(content => {
          if (content && content.length > 0) {
            // Pick a random tip for today
            const randomArticle = content[Math.floor(Math.random() * content.length)];
            setDynamicTip({ title: randomArticle.title, body: randomArticle.content });
          }
        })
        .catch(() => {});
    }
  }, [user, trimester]);

  const headerStyle = {
    opacity: headerAnim,
    transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };

  const QUICK_ACTIONS = [
    { label: 'Log Vitals',  sub: 'BP & Weight',  icon: Activity,     bg: isDark ? '#3B1F1F' : '#FEE2E2', color: '#DC2626', route: 'Tracker' },
    { label: 'Symptoms',    sub: 'How you feel', icon: Heart,         bg: isDark ? '#1F2A3B' : '#DBEAFE', color: '#2563EB', route: 'Tracker' },
    { label: 'ANC Visit',   sub: 'Appointments', icon: Stethoscope,  bg: isDark ? '#1A2E1F' : '#D1FAE5', color: '#059669', route: 'ANCVisit' },
    { label: 'Hydration',   sub: 'Water intake', icon: Droplets,     bg: isDark ? '#1F2D3B' : '#CFFAFE', color: '#0891B2', route: 'Tracker' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Subtle background tint */}
      <LinearGradient
        colors={isDark
          ? ['#1A1212', '#121212']
          : ['#FDF4F4', '#FAFAFA']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* ── Header ── */}
          <Animated.View style={[styles.header, headerStyle]}>
            <View>
              <View style={styles.greetingRow}>
                {isEvening
                  ? <Moon size={14} color={greetingIconColor} />
                  : <Sun size={14} color={greetingIconColor} />
                }
                <Typography variant="caption1" style={styles.greetingText}>{greeting}</Typography>
              </View>
              <Typography variant="title1" style={styles.nameText}>
                {user?.name ? user.name.split(' ')[0] : 'Mama'} 👋
              </Typography>
            </View>
            <TouchableOpacity style={styles.bellBtn} onPress={() => {}}>
              <Bell size={20} color={theme.colors.textHigh} strokeWidth={1.8} />
            </TouchableOpacity>
          </Animated.View>

          {/* ── Hero Card: Circular Progress ── */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={isDark
                ? ['#2A1518', '#1E1010']
                : ['#FFF0F0', '#FFF8F8']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />

            <View style={styles.heroInner}>
              {/* Left: Ring */}
              <View style={styles.ringContainer}>
                <CircularProgress percent={progressPercent} isDark={isDark} theme={theme} />
                <View style={styles.ringCenter}>
                  <Typography variant="largeTitle" style={styles.ringWeek}>{weeksPregnant}</Typography>
                  <Typography variant="caption1" style={styles.ringLabel}>weeks</Typography>
                </View>
              </View>

              {/* Right: Stats */}
              <View style={styles.heroStats}>
                <View style={styles.trimBadge}>
                  <Typography variant="caption2" style={styles.trimBadgeText}>TRIMESTER {trimester}</Typography>
                </View>

                <View style={styles.statBlock}>
                  <Typography variant="title2" style={styles.statNum}>{daysLeft}</Typography>
                  <Typography variant="caption1" style={styles.statLbl}>days left</Typography>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBlock}>
                  <Typography variant="title2" style={styles.statNum}>{40 - weeksPregnant}</Typography>
                  <Typography variant="caption1" style={styles.statLbl}>weeks to go</Typography>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBlock}>
                  <Typography variant="title2" style={styles.statNum}>{Math.round(progressPercent)}%</Typography>
                  <Typography variant="caption1" style={styles.statLbl}>complete</Typography>
                </View>
              </View>
            </View>
          </View>

          {/* ── Baby Development + Tip (side-by-side row) ── */}
          <View style={styles.rowCards}>
            {/* Baby Size */}
            <View style={styles.halfCard}>
              <LinearGradient
                colors={isDark ? ['#1A1F2A', '#12161E'] : ['#EFF6FF', '#FFFFFF']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
              <Typography variant="caption2" style={styles.halfCardLabel}>BABY SIZE</Typography>
              <Typography style={styles.halfCardEmoji}>{babySize.emoji}</Typography>
              <Typography variant="headline" style={styles.halfCardTitle}>{babySize.fruit}</Typography>
              <Typography variant="caption1" style={styles.halfCardSub}>{babySize.size} long</Typography>
            </View>

            {/* Today's Tip */}
            <View style={styles.halfCard}>
              <LinearGradient
                colors={isDark ? ['#1A1F1A', '#12161A'] : ['#F0FDF4', '#FFFFFF']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
              <Typography variant="caption2" style={[styles.halfCardLabel, { color: '#059669' }]}>TODAY'S TIP</Typography>
              <Typography style={styles.halfCardEmoji}>{todayTip.icon}</Typography>
              <Typography variant="caption1" style={styles.halfCardTipText}>{todayTip.tip}</Typography>
            </View>
          </View>

          {/* ── Weekly Milestone / Dynamic Insight ── */}
          <View style={styles.milestoneCard}>
            <View style={styles.milestoneBadge}>
              <Lightbulb size={14} color={theme.colors.primaryDark} />
              <Typography variant="caption2" style={styles.milestoneBadgeText}>
                {dynamicTip ? "DYNAMIC INSIGHT" : `WEEK ${weeksPregnant} MILESTONE`}
              </Typography>
            </View>
            <Typography variant="title3" style={styles.milestoneTitle}>
              {dynamicTip ? dynamicTip.title : trimesterFact.title}
            </Typography>
            <Typography variant="body" style={styles.milestoneBody}>
              {dynamicTip ? dynamicTip.body : trimesterFact.body}
            </Typography>
          </View>

          {/* ── Quick Actions ── */}
          <View style={styles.sectionHeader}>
            <Typography variant="title3" style={styles.sectionTitle}>Quick Actions</Typography>
          </View>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.route)}
                activeOpacity={0.75}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <action.icon size={20} color={action.color} strokeWidth={2} />
                </View>
                <Typography variant="subhead" style={styles.actionLabel}>{action.label}</Typography>
                <Typography variant="caption2" style={styles.actionSub}>{action.sub}</Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Next Appointment ── */}
          {nextVisit && (
            <TouchableOpacity
              style={styles.apptCard}
              onPress={() => navigation.navigate('ANCVisit')}
              activeOpacity={0.8}
            >
              <View style={styles.apptLeft}>
                <View style={styles.apptIconBg}>
                  <Stethoscope size={18} color={theme.colors.primaryDark} />
                </View>
                <View>
                  <Typography variant="caption1" style={styles.apptLabel}>NEXT APPOINTMENT</Typography>
                  <Typography variant="headline" style={styles.apptDate}>
                    {nextVisit.scheduled_date || nextVisit.date || 'Upcoming Visit'}
                  </Typography>
                  <Typography variant="caption1" style={styles.apptFacility}>
                    {nextVisit.facility || 'Clinic Visit'}
                  </Typography>
                </View>
              </View>
              <ChevronRight size={18} color={theme.colors.textMedium} />
            </TouchableOpacity>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────
const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 140 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  greetingText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingSemibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  nameText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(241,149,155,0.2)',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 20,
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWeek: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 42,
    letterSpacing: -2,
    lineHeight: 46,
  },
  ringLabel: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 12,
  },
  heroStats: {
    flex: 1,
    gap: 4,
  },
  trimBadge: {
    alignSelf: 'flex-start',
    backgroundColor: isDark ? 'rgba(216,122,128,0.2)' : theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
  },
  trimBadgeText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  statBlock: { marginVertical: 2 },
  statNum: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  statLbl: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 11,
  },
  statDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 6,
  },

  // Row Cards
  rowCards: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  halfCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 18,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  halfCardLabel: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 9,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  halfCardEmoji: {
    fontSize: 36,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  halfCardTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 14,
    marginBottom: 2,
  },
  halfCardSub: {
    color: theme.colors.textMedium,
    fontSize: 12,
  },
  halfCardTipText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyMedium,
    fontSize: 12,
    lineHeight: 18,
  },

  // Milestone
  milestoneCard: {
    marginHorizontal: 24,
    marginBottom: 28,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  milestoneBadgeText: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  milestoneTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 6,
  },
  milestoneBody: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyRegular,
    lineHeight: 22,
  },

  // Section header
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  actionLabel: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 14,
    marginBottom: 2,
  },
  actionSub: {
    color: theme.colors.textMedium,
    fontSize: 11,
  },

  // Appointment
  apptCard: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primaryDark,
    marginBottom: 8,
  },
  apptLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  apptIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: isDark ? 'rgba(216,122,128,0.15)' : theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptLabel: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 2,
  },
  apptDate: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 1,
  },
  apptFacility: { color: theme.colors.textMedium, fontSize: 12 },
});

import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Animated, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import {
  Activity, Droplets, Stethoscope, Heart, Sun,
  Moon, Sparkles, Bell, ChevronRight, Zap,
  Baby, Apple, Lightbulb, Calendar, ShoppingBag
} from 'lucide-react-native';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { getAncVisits, getEducationalContent } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

// ── Data ────────────────────────────────────────────────
const CLINICAL_SIZE_MAP: Record<number, { icon: string; weight: string; length: string }> = {
  4:  { icon: '🔬', weight: '< 1 g',      length: '1 mm' },
  8:  { icon: '🧬', weight: '1 g',        length: '1.6 cm' },
  12: { icon: '⚖️', weight: '14 g',       length: '5.4 cm' },
  16: { icon: '⚖️', weight: '100 g',      length: '11.6 cm' },
  20: { icon: '📏', weight: '300 g',      length: '25.6 cm' },
  24: { icon: '📏', weight: '600 g',      length: '30 cm' },
  28: { icon: '📏', weight: '1.0 kg',     length: '37.6 cm' },
  32: { icon: '📏', weight: '1.7 kg',     length: '42.4 cm' },
  36: { icon: '📏', weight: '2.6 kg',     length: '47.4 cm' },
  40: { icon: '📏', weight: '3.5 kg',     length: '51.2 cm' },
};

const getBabySize = (weeks: number) => {
  const keys = Object.keys(CLINICAL_SIZE_MAP).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
  );
  return CLINICAL_SIZE_MAP[closest] ?? CLINICAL_SIZE_MAP[32];
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

const WEEKLY_DATA: Record<number, { fetal: string; maternal: string; todo: string; ancPreview: string }> = {
  12: { fetal: 'Baby\'s vital organs are fully formed.', maternal: 'Nausea might start to subside.', todo: 'Schedule NIPT (Genetic) Screening', ancPreview: 'Nuchal translucency ultrasound & blood test' },
  16: { fetal: 'Baby can make facial expressions.', maternal: 'You might feel a "fluttering" (quickening).', todo: 'Start practicing sleeping on your side', ancPreview: 'Fetal heart rate check & fundal height' },
  20: { fetal: 'Baby is covered in a protective coating (vernix).', maternal: 'Your uterus has reached your belly button.', todo: 'Schedule your 20-week Anatomy Scan', ancPreview: 'Detailed anatomy scan to check baby\'s organs' },
  24: { fetal: 'Inner ear is fully developed; they can hear you!', maternal: 'You may notice Braxton Hicks contractions.', todo: 'Research local pediatrician options', ancPreview: 'Glucose screening for gestational diabetes' },
  28: { fetal: 'Baby\'s eyes can now open and close.', maternal: 'Third trimester begins! Fatigue may return.', todo: 'Take Glucose Tolerance Test', ancPreview: 'Antibody screen (if Rh negative) & iron check' },
  32: { fetal: 'Baby is practicing breathing movements.', maternal: 'Shortness of breath as uterus pushes up.', todo: 'Pack your hospital bag', ancPreview: 'Discuss birth plan & signs of preterm labor' },
  36: { fetal: 'Baby is rapidly gaining fat (1 oz/day).', maternal: 'Baby might "drop" lower into your pelvis.', todo: 'Install the car seat', ancPreview: 'Group B Strep (GBS) swab test' },
  40: { fetal: 'Baby is fully cooked and ready to meet you!', maternal: 'The waiting game. Rest as much as possible.', todo: 'Rest and watch for signs of active labor', ancPreview: 'Cervical check & membrane sweep discussion' },
};

const getWeeklyData = (weeks: number) => {
  const keys = Object.keys(WEEKLY_DATA).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - weeks) < Math.abs(prev - weeks) ? curr : prev
  );
  return WEEKLY_DATA[closest] ?? WEEKLY_DATA[28];
};

const MOTIVATIONS = [
  { quote: "If you educate a man you educate an individual, but if you educate a woman you educate a nation.", author: "Dr. J.E. Kwegyir Aggrey" },
  { quote: "Motherhood is the ultimate act of faith in the future.", author: "Ama Ata Aidoo" },
  { quote: "We are the women who birth nations. Our strength is inherited from the earth itself.", author: "Taiye Selasi" },
  { quote: "There is no tool for development more effective than the empowerment of women.", author: "Kofi Annan" },
  { quote: "To carry a child is to carry the future of our people in your hands.", author: "J.J. Rawlings" },
  { quote: "To be a mother is to be the first teacher, the first guide, and the first love of the next generation.", author: "Kwame Nkrumah" },
  { quote: "A tree has roots in the soil yet reaches to the sky. A mother roots her child in love so they may reach the stars.", author: "Wangari Maathai" },
  { quote: "The true strength of our nation lies in the courageous hearts of its mothers.", author: "Yaa Asantewaa" },
  { quote: "It always seems impossible until it is done. Trust your incredible body.", author: "Nelson Mandela" },
  { quote: "There is no limit to what we, as women, can accomplish.", author: "Ellen Johnson Sirleaf" }
];

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
  const weeklyData = getWeeklyData(weeksPregnant);
  const progressPercent = Math.min((weeksPregnant / 40) * 100, 100);

  const dayIndex = new Date().getDay() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[dayIndex];
  
  const todayDateFormatted = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const [nextVisit, setNextVisit] = useState<any>(null);
  const [dynamicTip, setDynamicTip] = useState<{title: string, body: string} | null>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;
  
  const [motivationIndex, setMotivationIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -15, duration: 400, useNativeDriver: true })
      ]).start(() => {
        setMotivationIndex(prev => (prev + 1) % MOTIVATIONS.length);
        slideAnim.setValue(15);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
        ]).start();
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

  const PREGNANCY_TOOLS = [
    { label: 'Weight\nTracker',   icon: Activity,    bg: '#F5A623' },
    { label: 'Kegel\nExercises',  icon: Heart,       bg: '#50E3C2' },
    { label: 'Kick\nCounter',     icon: Baby,        bg: '#9013FE' },
    { label: 'Contraction\nCounter', icon: Zap,      bg: '#4A90E2' },
    { label: 'Calendar\nand Diary',  icon: Calendar, bg: '#E06253' },
    { label: 'Pregnancy\nItems',  icon: ShoppingBag, bg: '#609B66' },
    { label: 'Meal\nPlan',        icon: Apple,       bg: '#8CC152' },
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

          {/* ── Baby Size (Full Width) ── */}
          <View style={styles.fullCard}>
            <LinearGradient
              colors={isDark ? ['#1A1F2A', '#12161E'] : ['#EFF6FF', '#FFFFFF']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Typography variant="caption2" style={[styles.halfCardLabel, { marginBottom: 12 }]}>BABY SIZE</Typography>
                <Typography variant="title2" style={{ color: theme.colors.textHigh, marginBottom: 4 }}>{babySize.length}</Typography>
                <Typography variant="subhead" style={{ color: theme.colors.textMedium }}>Est. {babySize.weight}</Typography>
              </View>
              <Typography style={{ fontSize: 64 }}>{babySize.icon}</Typography>
            </View>
          </View>

          {/* ── Today's Tip (Full Width Editorial) ── */}
          <View style={[styles.fullCard, { backgroundColor: isDark ? '#2A241A' : '#FDF8F0', padding: 24, paddingTop: 32 }]}>
            <View style={styles.dateBadgeContainer}>
              <View style={styles.dateBadgeBg} />
              <Typography variant="headline" style={styles.dateBadgeText}>{todayDateFormatted}</Typography>
            </View>
            <Typography variant="title2" style={{ color: theme.colors.textHigh, marginBottom: 16 }}>Today's tip</Typography>
            <Typography variant="body" style={{ color: theme.colors.textHigh, lineHeight: 26, fontSize: 16, fontFamily: theme.typography.families.bodyMedium }}>
              {todayTip.tip}
            </Typography>
          </View>

          {/* ── Sliding Motivation ── */}
          <View style={[styles.milestoneCard, { padding: 0, overflow: 'hidden', marginBottom: 16, borderWidth: 0 }]}>
            <LinearGradient
              colors={isDark ? ['#3B0764', '#1E1B4B'] : ['#FAF5FF', '#F3E8FF']}
              style={[StyleSheet.absoluteFillObject]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            {/* Watermark Quote */}
            <Typography style={{ position: 'absolute', right: -20, top: -40, fontSize: 160, color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', fontFamily: 'serif' }}>
              “
            </Typography>
            
            <View style={{ padding: 20 }}>
              <View style={[styles.milestoneBadge, { backgroundColor: 'transparent', alignSelf: 'flex-start', paddingHorizontal: 0 }]}>
                <Heart size={14} color={isDark ? "#D8B4FE" : "#9333EA"} />
                <Typography variant="caption2" style={[styles.milestoneBadgeText, { color: isDark ? '#D8B4FE' : '#9333EA', letterSpacing: 1 }]}>
                  DAILY INSPIRATION
                </Typography>
              </View>
              <Animated.View style={{ marginTop: 12, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                <Typography variant="body" style={{ color: isDark ? '#F3E8FF' : '#4C1D95', fontFamily: theme.typography.families.headingSemibold, fontStyle: 'italic', lineHeight: 24, fontSize: 16 }}>
                  "{MOTIVATIONS[motivationIndex].quote}"
                </Typography>
                <Typography variant="caption1" style={{ color: isDark ? 'rgba(243, 232, 255, 0.7)' : 'rgba(76, 29, 149, 0.7)', marginTop: 12, fontWeight: '600', letterSpacing: 0.5, textAlign: 'center' }}>
                  — {MOTIVATIONS[motivationIndex].author}
                </Typography>
              </Animated.View>
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
            
            {dynamicTip ? (
              <>
                <Typography variant="title3" style={styles.milestoneTitle}>{dynamicTip.title}</Typography>
                <Typography variant="body" style={styles.milestoneBody}>{dynamicTip.body}</Typography>
              </>
            ) : (
              <View>
                <Typography variant="title3" style={styles.milestoneTitle}>Fetal Development</Typography>
                <Typography variant="body" style={styles.milestoneBody}>{weeklyData.fetal}</Typography>
                
                <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB', marginVertical: 12 }} />
                
                <Typography variant="title3" style={styles.milestoneTitle}>Maternal Changes</Typography>
                <Typography variant="body" style={styles.milestoneBody}>{weeklyData.maternal}</Typography>
              </View>
            )}
          </View>



          {/* ── Pregnancy Tools ── */}
          <View style={[styles.sectionHeader, { marginTop: 16 }]}>
            <Typography variant="title2" style={styles.sectionTitle}>Pregnancy tools</Typography>
          </View>
          <View style={styles.actionsGrid}>
            {PREGNANCY_TOOLS.map((tool) => (
              <TouchableOpacity
                key={tool.label}
                style={styles.toolCard}
                onPress={() => Alert.alert('Coming Soon', 'We are building this feature!')}
                activeOpacity={0.75}
              >
                <View style={[styles.toolIconWrapper, { backgroundColor: tool.bg }]}>
                  <tool.icon size={26} color={theme.colors.background} strokeWidth={2.5} />
                </View>
                <Typography variant="caption1" style={styles.toolLabel} numberOfLines={2}>{tool.label}</Typography>
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
                <View style={{ flex: 1 }}>
                  <Typography variant="caption1" style={styles.apptLabel}>NEXT APPOINTMENT</Typography>
                  <Typography variant="headline" style={styles.apptDate}>
                    {nextVisit.scheduled_date || nextVisit.date || 'Upcoming Visit'}
                  </Typography>
                  <Typography variant="caption1" style={styles.apptFacility}>
                    {nextVisit.facility || 'Clinic Visit'}
                  </Typography>
                  
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6', borderRadius: 8 }}>
                    <Typography variant="caption2" style={{ color: theme.colors.textMedium, marginBottom: 2 }}>What to expect:</Typography>
                    <Typography variant="caption1" style={{ color: theme.colors.textHigh }}>{weeklyData.ancPreview}</Typography>
                  </View>
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
    shadowColor: '#000',
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
  fullCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    minHeight: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  dateBadgeContainer: {
    position: 'absolute',
    top: -1,
    right: -1,
    paddingTop: 12,
    paddingRight: 20,
    paddingLeft: 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    zIndex: 10,
    overflow: 'hidden',
  },
  dateBadgeBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#F9C985',
    borderBottomLeftRadius: 40,
    opacity: isDark ? 0.9 : 1,
  },
  dateBadgeText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
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

  // Pregnancy Tools Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  toolCard: {
    width: (width - 72) / 3, // 3 columns, 2 gaps of 12 = 24, 2 padding of 24 = 48. Total 72.
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.2 : 0.04,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 120,
  },
  toolIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolLabel: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    textAlign: 'center',
    lineHeight: 14,
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

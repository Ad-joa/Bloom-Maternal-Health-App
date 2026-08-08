import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Alert, Animated as RNAnimated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { Card } from '../components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet, Heart, CheckCircle, MessageCircle, Calendar, ChevronRight } from 'lucide-react-native';
import { getDaysUntilDue, getWeeksPregnant, getCurrentTrimester } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const getBabySize = (weeks: number) => {
  if (weeks < 4) return { emoji: '🌱', name: 'a Tigernut' };
  if (weeks === 4) return { emoji: '🌾', name: 'a Sesame Seed' };
  if (weeks === 5) return { emoji: '🌰', name: 'a Palm Nut' };
  if (weeks === 6) return { emoji: '🫘', name: 'a Bambara Bean' };
  if (weeks === 7) return { emoji: '🍆', name: 'a small Garden Egg' };
  if (weeks === 8) return { emoji: '🌶️', name: 'a Shito pepper' };
  if (weeks === 9) return { emoji: '🧄', name: 'a clove of Garlic' };
  if (weeks === 10) return { emoji: '🥭', name: 'a small Mango' };
  if (weeks === 11) return { emoji: '🍎', name: 'an African Star Apple (Alasa)' };
  if (weeks === 12) return { emoji: '🍋', name: 'a Lemon' };
  if (weeks === 13) return { emoji: '🍫', name: 'a small Cocoa Pod' };
  if (weeks === 14) return { emoji: '🫘', name: 'a Dawadawa Pod' };
  if (weeks === 15) return { emoji: '🥭', name: 'a medium Mango' };
  if (weeks === 16) return { emoji: '🥑', name: 'an Avocado (Pear)' };
  if (weeks === 17) return { emoji: '🧅', name: 'a large Onion' };
  if (weeks === 18) return { emoji: '🫑', name: 'a Green Pepper' };
  if (weeks === 19) return { emoji: '🍅', name: 'a large Tomato' };
  if (weeks === 20) return { emoji: '🍌', name: 'a Plantain' };
  if (weeks === 21) return { emoji: '🥔', name: 'a piece of Yam' };
  if (weeks === 22) return { emoji: '🥥', name: 'a small Coconut' };
  if (weeks === 23) return { emoji: '🥭', name: 'a large Mango' };
  if (weeks === 24) return { emoji: '🌽', name: 'an Ear of Corn' };
  if (weeks === 25) return { emoji: '🥬', name: 'a bunch of Kontomire' };
  if (weeks === 26) return { emoji: '🍈', name: 'a small Pawpaw' };
  if (weeks === 27) return { emoji: '🥬', name: 'a Cabbage' };
  if (weeks === 28) return { emoji: '🍆', name: 'a large Garden Egg' };
  if (weeks === 29) return { emoji: '🥔', name: 'a medium Yam' };
  if (weeks === 30) return { emoji: '🥔', name: 'a large Cassava' };
  if (weeks === 31) return { emoji: '🥥', name: 'a large Coconut' };
  if (weeks === 32) return { emoji: '🍈', name: 'a medium Pawpaw' };
  if (weeks === 33) return { emoji: '🍍', name: 'a Pineapple' };
  if (weeks === 34) return { emoji: '🍉', name: 'a small Watermelon' };
  if (weeks === 35) return { emoji: '🍈', name: 'a large Pawpaw' };
  if (weeks === 36) return { emoji: '🍌', name: 'a bunch of Plantains' };
  if (weeks === 37) return { emoji: '🥔', name: 'a large Yam tuber' };
  if (weeks === 38) return { emoji: '🍍', name: 'a large Pineapple' };
  if (weeks === 39) return { emoji: '🍉', name: 'a medium Watermelon' };
  return { emoji: '🍉', name: 'a large Watermelon' };
};

type Props = {
  navigation: any; 
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const dueDate = user?.due_date || '';
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 0;
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 0;
  const currentTrimester = dueDate ? getCurrentTrimester(dueDate) : (user?.trimester || 1);
  const babySize = getBabySize(weeksPregnant);

  // Calculate Progress
  const totalDaysPregnancy = 280; // 40 weeks
  const daysPregnant = totalDaysPregnancy - daysUntilDue;
  const progressPercent = Math.min(Math.max((daysPregnant / totalDaysPregnancy) * 100, 0), 100);

  // Generate a mock calendar ribbon for the next 7 days
  const today = new Date();
  const calendarDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 3); // Center around today
    return {
      dayStr: d.toLocaleDateString('en-US', { weekday: 'short' })[0], // 'M', 'T', 'W'
      dateNum: d.getDate(),
      isToday: i === 3,
    };
  });

  const [dailyQuote, setDailyQuote] = useState('');
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const motivations = [
    "Your body is doing incredible things today.",
    "Rest when you need to. You are growing a life.",
    "Every day brings you closer to meeting your baby.",
    "Trust your instincts; you are already a great mother.",
    "It's okay to feel overwhelmed. Take it one breath at a time.",
    "You are strong, resilient, and capable."
  ];

  useEffect(() => {
    // Initial random quote
    setDailyQuote(motivations[Math.floor(Math.random() * motivations.length)]);

    const intervalId = setInterval(() => {
      // Fade out
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change quote while invisible
        setDailyQuote(motivations[Math.floor(Math.random() * motivations.length)]);
        // Fade in
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const actionButtons = [
    { id: 'checkin', label: 'Check-In', icon: <CheckCircle color="#fff" size={24} />, route: 'CheckIn', color: theme.colors.primary },
    { id: 'symptoms', label: 'Symptoms', icon: <Heart color={theme.colors.primaryDark} size={24} />, route: 'Tracker', color: theme.colors.surface },
    { id: 'ai', label: 'Bloom AI', icon: <MessageCircle color={theme.colors.primaryDark} size={24} />, route: 'BloomAI', color: theme.colors.surface },
    { id: 'anc', label: 'ANC Visits', icon: <Calendar color={theme.colors.primaryDark} size={24} />, route: 'ANCVisit', color: theme.colors.surface },
  ];

  const insights = [
    { id: '1', title: 'Today\'s chance\nof symptoms', subtitle: 'View Insights', color: theme.colors.primaryLight, route: 'Tracker', textLight: false },
    { id: '2', title: 'What makes you\nfeel loved?', subtitle: 'QUIZ', color: theme.colors.accentPurple, textLight: false, route: 'BloomAI' },
    { id: '3', title: 'Nutrition Check', subtitle: 'Drink Water', color: theme.colors.accentPink, route: 'Tracker', textLight: false },
  ];

  return (
    <LinearGradient
      colors={[theme.colors.accentPink, theme.colors.primaryLight, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.6 }}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Row */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
              <Typography variant="headline" color="#fff">
                {user?.name ? user.name[0].toUpperCase() : 'B'}
              </Typography>
            </TouchableOpacity>
            <View style={styles.dateSelector}>
              <Typography variant="headline" color={theme.colors.textHigh} style={{ marginRight: 8 }}>
                {today.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
              </Typography>
              <Calendar color={theme.colors.textHigh} size={20} />
            </View>
          </View>

          {/* Calendar Ribbon */}
          <View  style={styles.calendarRibbon}>
            {calendarDays.map((day, idx) => (
              <View key={idx} style={[styles.dayColumn, day.isToday && styles.todayColumn]}>
                <Typography variant="caption1" color={theme.colors.textMedium} style={styles.dayStr}>
                  {day.dayStr}
                </Typography>
                <Typography variant="title3" color={theme.colors.textHigh} style={styles.dateNum}>
                  {day.dateNum}
                </Typography>
              </View>
            ))}
          </View>

          {/* Main Content Layout */}
          <View  style={styles.contentLayout}>
            
            {/* 1. Pregnancy Status Card */}
            <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Trimester', { trimesterId: currentTrimester })}>
              <Card variant="glass" style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <Typography variant="headline" color={theme.colors.primaryDark}>
                    {t('home.trimester')} {currentTrimester}
                  </Typography>
                  <ChevronRight size={20} color={theme.colors.primaryDark} />
                </View>

                {dueDate ? (
                  <>
                    <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.heroTitle}>
                      {t('home.week')} {weeksPregnant}
                    </Typography>
                    <Typography variant="body" color={theme.colors.textMedium} style={styles.heroSubtitle}>
                      {daysUntilDue} {t('home.untilDue')}
                    </Typography>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
                    </View>

                    <View style={styles.babySizeChip}>
                      <Typography variant="title3">{babySize.emoji}</Typography>
                      <Typography variant="caption1" color={theme.colors.textHigh} style={{ marginLeft: 6 }}>
                        {t('home.babySize')} {babySize.name}
                      </Typography>
                    </View>
                  </>
                ) : (
                  <>
                    <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.heroTitle}>
                      {t('home.welcome')}
                    </Typography>
                    <Typography variant="body" color={theme.colors.textMedium} style={styles.heroSubtitle}>
                      {t('home.setupProfile')}
                    </Typography>
                  </>
                )}
              </Card>
            </TouchableOpacity>

            {/* 2. Quick Actions Grid Card */}
            <Card variant="glass" style={styles.actionsCard}>
              <Typography variant="headline" color={theme.colors.textHigh} style={{ marginBottom: theme.spacing[4] }}>
                {t('home.quickActions')}
              </Typography>
              <View style={styles.actionGrid}>
                {actionButtons.map(btn => (
                  <BounceButton 
                    key={btn.id} 
                    style={styles.actionGridItem} 
                    onPress={() => navigation.navigate(btn.route)}
                    accessibilityLabel={`Navigate to ${btn.label}`}
                    accessibilityRole="button"
                  >
                    <View style={[styles.circleButton, { backgroundColor: btn.color }]}>
                      {btn.icon}
                    </View>
                    <Typography variant="caption1" color={theme.colors.textHigh} style={{ marginTop: 8 }}>
                      {btn.label}
                    </Typography>
                  </BounceButton>
                ))}
              </View>
            </Card>

            {/* 3. Daily Reflection Card */}
            <Card variant="glass" style={styles.reflectionCard}>
              <Typography variant="headline" color={theme.colors.primaryDark} style={{ marginBottom: theme.spacing[2] }}>
                {t('home.dailyReflection')}
              </Typography>
              <RNAnimated.View style={{ opacity: fadeAnim }}>
                <Typography variant="body" color={theme.colors.textMedium} style={{ fontStyle: 'italic' }}>
                  "{dailyQuote}"
                </Typography>
              </RNAnimated.View>
            </Card>

          </View>

          {/* Daily Insights */}
          <View  style={styles.insightsSection}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              {t('home.insightsTitle')}
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsScroll}>
              {insights.map(item => (
                <BounceButton 
                  key={item.id} 
                  onPress={() => navigation.navigate(item.route)}
                >
                  <View style={[styles.insightCard, { backgroundColor: item.color }]}>
                    <Typography variant="headline" color={item.textLight ? '#fff' : theme.colors.textHigh} style={styles.insightTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="subhead" color={item.textLight ? '#ffffffa0' : theme.colors.primaryDark}>
                      {item.subtitle}
                    </Typography>
                  </View>
                </BounceButton>
              ))}
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  dayColumn: {
    alignItems: 'center',
    width: 44,
    height: 60,
    justifyContent: 'center',
    borderRadius: 22,
  },
  todayColumn: {
    backgroundColor: '#E5E5EA', // Or a very light gray shadow
  },
  dayStr: {
    marginBottom: 4,
  },
  dateNum: {
    fontFamily: theme.typography.families.bodyBold,
  },
  contentLayout: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  statusCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing[6],
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing[4],
  },
  heroTitle: {
    fontFamily: theme.typography.families.headingBold,
    fontSize: 48,
    lineHeight: 56,
  },
  heroSubtitle: {
    marginTop: theme.spacing[1],
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  babySizeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing[3],
  },
  actionsCard: {
    padding: theme.spacing[5],
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionGridItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: theme.spacing[4],
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  reflectionCard: {
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surface,
  },
  insightsSection: {
    paddingLeft: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
  },
  insightsScroll: {
    paddingRight: theme.spacing[4],
    gap: theme.spacing[3],
  },
  insightCard: {
    width: 140,
    height: 140,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    justifyContent: 'space-between',
  },
  insightTitle: {
    lineHeight: 22,
    fontFamily: theme.typography.families.headingBold,
  }
});

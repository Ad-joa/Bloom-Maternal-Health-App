import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet, Heart, CheckCircle, MessageCircle, Calendar } from 'lucide-react-native';
import { getDaysUntilDue, getWeeksPregnant, getCurrentTrimester } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

type Props = {
  navigation: any; 
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  
  const dueDate = user?.due_date || '';
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 0;
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 0;
  const currentTrimester = dueDate ? getCurrentTrimester(dueDate) : (user?.trimester || 1);

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

  const actionButtons = [
    { id: 'tracker', label: 'Log', icon: <Droplet color="#fff" size={24} />, route: 'Tracker', color: theme.colors.primary },
    { id: 'symptoms', label: 'Symptoms', icon: <Heart color={theme.colors.textHigh} size={24} />, route: 'Advisory', color: '#fff' },
    { id: 'ai', label: 'Bloom AI', icon: <MessageCircle color={theme.colors.textHigh} size={24} />, route: 'BloomAI', color: '#fff' },
    { id: 'checkin', label: 'Check-in', icon: <CheckCircle color={theme.colors.textHigh} size={24} />, route: 'Tracker', color: '#fff' },
  ];

  const insights = [
    { id: '1', title: 'Today\'s chance\nof symptoms', subtitle: 'Updating ...', color: theme.colors.primaryLight },
    { id: '2', title: 'What makes you\nfeel loved?', subtitle: 'QUIZ', color: theme.colors.primaryDark, textLight: true },
    { id: '3', title: 'Nutrition Check', subtitle: 'Drink Water', color: '#F3E8FF' },
  ];

  return (
    <LinearGradient
      colors={['#ffffff', '#fdf2f4', '#fce7eb']}
      style={styles.container}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Typography variant="headline" color="#fff">
                {user?.name ? user.name[0].toUpperCase() : 'B'}
              </Typography>
            </View>
            <View style={styles.dateSelector}>
              <Typography variant="headline" color={theme.colors.textHigh} style={{ marginRight: 8 }}>
                {today.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
              </Typography>
              <Calendar color={theme.colors.textHigh} size={20} />
            </View>
          </View>

          {/* Calendar Ribbon */}
          <View style={styles.calendarRibbon}>
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

          {/* Huge Hero Typography */}
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={styles.heroSection}
            onPress={() => navigation.navigate('Trimester', { trimesterId: currentTrimester })}
          >
            {dueDate ? (
              <>
                <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.heroTitle}>
                  Week {weeksPregnant}
                </Typography>
                <Typography variant="body" color={theme.colors.textMedium} style={styles.heroSubtitle}>
                  {daysUntilDue} days until due date ⓘ
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.heroTitle}>
                  No Due Date
                </Typography>
                <Typography variant="body" color={theme.colors.textMedium} style={styles.heroSubtitle}>
                  Tap to set your due date ⓘ
                </Typography>
              </>
            )}
          </TouchableOpacity>

          {/* Circular Action Buttons */}
          <View style={styles.actionRow}>
            {actionButtons.map(btn => (
              <TouchableOpacity key={btn.id} style={styles.actionItem} onPress={() => navigation.navigate(btn.route)}>
                <View style={[styles.circleButton, { backgroundColor: btn.color }]}>
                  {btn.icon}
                </View>
                <Typography variant="caption1" color={theme.colors.textHigh} style={{ marginTop: 8 }}>
                  {btn.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* Daily Insights */}
          <View style={styles.insightsSection}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              My daily insights • Today
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.insightsScroll}>
              {insights.map(item => (
                <TouchableOpacity key={item.id} style={[styles.insightCard, { backgroundColor: item.color }]}>
                  <Typography variant="headline" color={item.textLight ? '#fff' : theme.colors.textHigh} style={styles.insightTitle}>
                    {item.title}
                  </Typography>
                  <Typography variant="subhead" color={item.textLight ? '#ffffffa0' : theme.colors.primaryDark}>
                    {item.subtitle}
                  </Typography>
                </TouchableOpacity>
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
    paddingHorizontal: theme.spacing[2],
    marginBottom: theme.spacing[8],
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
    fontFamily: theme.typography.families.headingBold,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  heroTitle: {
    fontSize: 42,
    fontFamily: theme.typography.families.headingBold,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  heroSubtitle: {
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[5],
    marginBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
  },
  actionItem: {
    alignItems: 'center',
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  insightsSection: {
    paddingLeft: theme.spacing[4],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.families.headingBold,
  },
  insightsScroll: {
    paddingRight: theme.spacing[4],
    gap: theme.spacing[3],
  },
  insightCard: {
    width: width * 0.4,
    height: 180,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    justifyContent: 'space-between',
  },
  insightTitle: {
    fontFamily: theme.typography.families.headingBold,
  }
});

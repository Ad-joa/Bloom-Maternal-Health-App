import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

type Props = {
  navigation: any; 
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const dueDate = user?.due_date || '';
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 32; // Fallback to 32
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 56; // Fallback to 56 days
  const remainingWeeks = Math.ceil(daysUntilDue / 7);
  
  let currentTrimester = 1;
  if (weeksPregnant >= 13 && weeksPregnant <= 26) currentTrimester = 2;
  if (weeksPregnant >= 27) currentTrimester = 3;
  
  const today = new Date();
  
  // Generate 7 days around today for the calendar strip
  const calendarDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 3 + i);
    return {
      date: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: i === 3,
    };
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
                <Typography variant="headline" color="#fff">
                  {user?.name ? user.name[0].toUpperCase() : 'B'}
                </Typography>
              </TouchableOpacity>
              <View style={styles.headerTextContainer}>
                <Typography variant="caption1" color={theme.colors.textMedium}>
                  Good Morning
                </Typography>
                <Typography variant="headline" color={theme.colors.textHigh} style={styles.greeting}>
                  Hello {user?.name ? user.name.split(' ')[0] : 'Mummy'}!
                </Typography>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Reminders')}>
                <Ionicons name="notifications-outline" size={22} color={theme.colors.textHigh} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Flo-style Calendar Strip */}
          <View style={styles.calendarStrip}>
            {calendarDays.map((day, idx) => (
              <TouchableOpacity key={idx} style={[styles.calendarDay, day.isToday && styles.calendarDayActive]}>
                <Typography variant="caption1" color={day.isToday ? '#fff' : theme.colors.textMedium} style={styles.calendarDayName}>
                  {day.dayName[0]}
                </Typography>
                <Typography variant="subhead" color={day.isToday ? '#fff' : theme.colors.textHigh} style={styles.calendarDayNumber}>
                  {day.dayNumber}
                </Typography>
                {day.isToday && <View style={styles.calendarDot} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Section Title & Controls */}
          <View style={styles.sectionHeader}>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Pregnancy{'\n'}Journey
            </Typography>
            <View style={styles.sectionControls}>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => navigation.navigate('Trimester', { trimesterId: currentTrimester })}>
                <Typography variant="subhead" color={theme.colors.textMedium} style={{marginRight: 4}}>Trimester</Typography>
                <Ionicons name="chevron-down" size={16} color={theme.colors.textMedium} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('Tracker')}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3D Baby Hero Area */}
          <View style={styles.heroArea}>
            <Image 
              source={require('../../assets/baby.png')} 
              style={styles.babyImage} 
              resizeMode="contain"
            />
            
            {/* Floating Info Cards */}
            <View style={[styles.floatingCard, styles.cardTopRight]}>
              <Typography variant="title1" style={styles.floatingNumber}>{weeksPregnant}</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{marginTop: -4}}>
                Completed{'\n'}Week
              </Typography>
              <View style={styles.smallIconWrap}>
                <Ionicons name="happy-outline" size={14} color={theme.colors.textMedium} />
              </View>
            </View>

            <View style={[styles.floatingCard, styles.cardBottomLeft]}>
              <Typography variant="title2" style={styles.floatingNumber}>{remainingWeeks.toString().padStart(2, '0')}</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{marginTop: -4}}>
                Remaining{'\n'}Week
              </Typography>
              <View style={styles.smallIconWrapTop}>
                <Ionicons name="time-outline" size={14} color={theme.colors.textMedium} />
              </View>
            </View>
          </View>

          {/* Symptoms Cards */}
          <View style={styles.symptomsRow}>
            {/* Purple Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.symptomCard, styles.symptomCardPurple]} onPress={() => navigation.navigate('Analysis')}>
              <View style={styles.symptomIconWrap}>
                <Ionicons name="snow-outline" size={20} color={theme.colors.primaryDark} />
              </View>
              <View>
                <View style={styles.statusDotRow}>
                  <View style={[styles.dot, {backgroundColor: '#fff'}]} />
                  <Typography variant="caption1" color="#fff">Normal</Typography>
                </View>
                <Typography variant="title3" color="#fff" style={styles.symptomTitle}>
                  Back pain
                </Typography>
              </View>
            </TouchableOpacity>

            {/* White Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.symptomCard, styles.symptomCardWhite]} onPress={() => navigation.navigate('Analysis')}>
              <View style={[styles.symptomIconWrap, {backgroundColor: '#F8F9FA'}]}>
                <Ionicons name="fitness-outline" size={20} color={theme.colors.textMedium} />
              </View>
              <View>
                <View style={styles.statusDotRow}>
                  <View style={[styles.dot, {backgroundColor: theme.colors.textMedium}]} />
                  <Typography variant="caption1" color={theme.colors.textMedium}>Normal</Typography>
                </View>
                <Typography variant="title3" color={theme.colors.textHigh} style={styles.symptomTitle}>
                  Fatigue
                </Typography>
              </View>
            </TouchableOpacity>
          </View>

          {/* Upcoming & Actions */}
          <View style={[styles.sectionHeader, { marginTop: 0, marginBottom: theme.spacing[3] }]}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Upcoming & Actions
            </Typography>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScrollContent}>
            
            {/* ANC Visit Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.actionCard, {backgroundColor: '#fff'}]} onPress={() => navigation.navigate('ANCVisit')}>
              <View style={[styles.actionIconWrap, {backgroundColor: theme.colors.primaryLight + '20'}]}>
                <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Next ANC Visit</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>Oct 12, 10:00 AM</Typography>
            </TouchableOpacity>

            {/* Daily Check-In Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.actionCard, {backgroundColor: '#fff'}]} onPress={() => navigation.navigate('CheckIn')}>
              <View style={[styles.actionIconWrap, {backgroundColor: theme.colors.info + '20'}]}>
                <Ionicons name="checkbox-outline" size={24} color={theme.colors.info} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Daily Check-In</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>Log your vitals</Typography>
            </TouchableOpacity>

            {/* Partner Mode Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.actionCard, {backgroundColor: '#fff'}]} onPress={() => navigation.navigate('PartnerMode')}>
              <View style={[styles.actionIconWrap, {backgroundColor: theme.colors.success + '20'}]}>
                <Ionicons name="heart-half-outline" size={24} color={theme.colors.success} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Partner Mode</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>Share journey</Typography>
            </TouchableOpacity>

          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[4],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontFamily: theme.typography.families.headingBold,
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[5],
    marginBottom: theme.spacing[4],
  },
  calendarDay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  calendarDayActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.medium,
  },
  calendarDayName: {
    marginBottom: 4,
    fontFamily: theme.typography.families.bodySemibold,
  },
  calendarDayNumber: {
    fontFamily: theme.typography.families.headingBold,
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing[5],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: theme.typography.families.headingBold,
    lineHeight: 32,
  },
  sectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[1],
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: theme.spacing[3],
    ...theme.shadows.soft,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  heroArea: {
    width: '100%',
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: theme.spacing[4],
  },
  babyImage: {
    width: width * 0.7,
    height: 300,
  },
  floatingCard: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: theme.spacing[4],
    borderRadius: 20,
    width: 130,
    ...theme.shadows.medium,
  },
  cardTopRight: {
    top: 30,
    right: 20,
    transform: [{ rotate: '5deg' }],
  },
  cardBottomLeft: {
    bottom: 20,
    left: 20,
    transform: [{ rotate: '-8deg' }],
  },
  floatingNumber: {
    fontFamily: theme.typography.families.headingBold,
  },
  smallIconWrap: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIconWrapTop: {
    position: 'absolute',
    right: 12,
    top: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.soft,
  },
  symptomsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[5],
    justifyContent: 'space-between',
    marginBottom: theme.spacing[8],
  },
  symptomCard: {
    width: '47%',
    height: 180,
    borderRadius: 24,
    padding: theme.spacing[4],
    justifyContent: 'space-between',
    ...theme.shadows.soft,
  },
  symptomCardPurple: {
    backgroundColor: theme.colors.primary,
  },
  symptomCardWhite: {
    backgroundColor: '#fff',
  },
  symptomIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  symptomTitle: {
    fontFamily: theme.typography.families.headingBold,
  },
  actionsScrollContent: {
    paddingHorizontal: theme.spacing[5],
    paddingBottom: theme.spacing[6],
  },
  actionCard: {
    width: 140,
    padding: theme.spacing[4],
    borderRadius: 20,
    marginRight: theme.spacing[4],
    ...theme.shadows.soft,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  actionTitle: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 2,
  },
});

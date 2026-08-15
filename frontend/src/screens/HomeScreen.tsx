import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Apple, Flower, Activity, Heart, ChevronRight, Bell, ChevronDown, ArrowRight, Smile, Clock, Sparkles, Stethoscope, CheckSquare, HeartPulse } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { LineChart } from 'react-native-chart-kit';
import { getSymptomLogs, getAncVisits } from '../api/api';

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
  
  const [logs, setLogs] = React.useState<any[]>([]);
  const [nextVisit, setNextVisit] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (user?.id) {
      getSymptomLogs(user.id).then(data => setLogs(data || []));
      getAncVisits(user.id).then(data => {
        const visits = data || [];
        const upcoming = visits.find((v: any) => v.status === 'scheduled');
        setNextVisit(upcoming);
      });
    }
  }, [user]);

  const getSeverityScore = (symptomsStr: string) => {
    if (!symptomsStr) return 0;
    if (symptomsStr.toLowerCase().includes('severe') || symptomsStr.toLowerCase().includes('n3') || symptomsStr.toLowerCase().includes('c3')) return 3;
    if (symptomsStr.toLowerCase().includes('moderate') || symptomsStr.toLowerCase().includes('n2') || symptomsStr.toLowerCase().includes('c2')) return 2;
    if (symptomsStr.toLowerCase().includes('mild') || symptomsStr.toLowerCase().includes('n1') || symptomsStr.toLowerCase().includes('c1')) return 1;
    return 1;
  };

  const chartData = {
    labels: logs.length > 1 ? logs.slice(-5).map(l => new Date(l.created_at).toLocaleDateString('en-US', {weekday: 'short'})) : ["M", "T", "W", "T", "F"],
    datasets: [
      {
        data: logs.length > 1 ? logs.slice(-5).map(l => getSeverityScore(l.symptoms)) : [1, 2, 1, 3, 2],
        color: (opacity = 1) => theme.colors.primaryDark,
        strokeWidth: 3
      }
    ]
  };

  const hour = new Date().getHours();
  let greeting = 'Good Evening,';
  if (hour < 12) greeting = 'Good Morning,';
  else if (hour < 18) greeting = 'Good Afternoon,';
  
  let currentTrimester = 1;
  if (weeksPregnant >= 13 && weeksPregnant <= 26) currentTrimester = 2;
  if (weeksPregnant >= 27) currentTrimester = 3;
  
  const today = new Date();
  
  const renderGoalWidget = () => {
    const goal = user?.primary_goal;

    if (goal === "Healthy Diet") {
      return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.goalWidget, { backgroundColor: '#E8F5E9' }]} onPress={() => navigation.navigate('Advisory')}>
          <View style={[styles.goalIconWrap, { backgroundColor: theme.colors.success }]}>
            <Apple size={24} color="#fff" />
          </View>
          <View style={styles.goalTextWrap}>
            <Typography variant="caption1" color={theme.colors.success} style={{fontFamily: theme.typography.families.headingBold}}>DAILY FOCUS: HEALTHY DIET</Typography>
            <Typography variant="subhead" color={theme.colors.textHigh} style={{marginTop: 4}}>Remember your folic acid and stay hydrated today.</Typography>
          </View>
          <ChevronRight size={20} color={theme.colors.success} />
        </TouchableOpacity>
      );
    } else if (goal === "Manage Stress") {
      return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.goalWidget, { backgroundColor: '#E3F2FD' }]} onPress={() => navigation.navigate('Advisory')}>
          <View style={[styles.goalIconWrap, { backgroundColor: theme.colors.info }]}>
            <Flower size={24} color="#fff" />
          </View>
          <View style={styles.goalTextWrap}>
            <Typography variant="caption1" color={theme.colors.info} style={{fontFamily: theme.typography.families.headingBold}}>DAILY FOCUS: MANAGE STRESS</Typography>
            <Typography variant="subhead" color={theme.colors.textHigh} style={{marginTop: 4}}>Take 5 deep breaths. You are doing great, mama.</Typography>
          </View>
          <ChevronRight size={20} color={theme.colors.info} />
        </TouchableOpacity>
      );
    } else if (goal === "Stay Active") {
      return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.goalWidget, { backgroundColor: '#FFF3E0' }]} onPress={() => navigation.navigate('Advisory')}>
          <View style={[styles.goalIconWrap, { backgroundColor: theme.colors.warning }]}>
            <Activity size={24} color="#fff" />
          </View>
          <View style={styles.goalTextWrap}>
            <Typography variant="caption1" color={theme.colors.warning} style={{fontFamily: theme.typography.families.headingBold}}>DAILY FOCUS: STAY ACTIVE</Typography>
            <Typography variant="subhead" color={theme.colors.textHigh} style={{marginTop: 4}}>Try a 10-minute safe prenatal stretch today.</Typography>
          </View>
          <ChevronRight size={20} color={theme.colors.warning} />
        </TouchableOpacity>
      );
    } else if (goal === "Prepare for Birth") {
      return (
        <TouchableOpacity activeOpacity={0.8} style={[styles.goalWidget, { backgroundColor: '#FCE4EC' }]} onPress={() => navigation.navigate('Advisory')}>
          <View style={[styles.goalIconWrap, { backgroundColor: '#E91E63' }]}>
            <Stethoscope size={24} color="#fff" />
          </View>
          <View style={styles.goalTextWrap}>
            <Typography variant="caption1" color="#E91E63" style={{fontFamily: theme.typography.families.headingBold}}>DAILY FOCUS: PREPARE FOR BIRTH</Typography>
            <Typography variant="subhead" color={theme.colors.textHigh} style={{marginTop: 4}}>Time to start reviewing your hospital bag checklist.</Typography>
          </View>
          <ChevronRight size={20} color="#E91E63" />
        </TouchableOpacity>
      );
    }

    // Fallback if no goal is set
    return (
      <TouchableOpacity activeOpacity={0.8} style={[styles.goalWidget, { backgroundColor: theme.colors.primaryLight + '40' }]} onPress={() => navigation.navigate('Profile')}>
        <View style={[styles.goalIconWrap, { backgroundColor: theme.colors.primary }]}>
          <Heart size={24} color="#fff" />
        </View>
        <View style={styles.goalTextWrap}>
          <Typography variant="caption1" color={theme.colors.primary} style={{fontFamily: theme.typography.families.headingBold}}>WELLNESS</Typography>
          <Typography variant="subhead" color={theme.colors.textHigh} style={{marginTop: 4}}>Set your primary pregnancy goal in your Profile.</Typography>
        </View>
        <ChevronRight size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    );
  };
  
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
                  {greeting}
                </Typography>
                <Typography variant="title3" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
                  {user?.name ? user.name.split(' ')[0] : 'Mama'}
                </Typography>
              </View>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Reminders')}>
              <Bell size={24} color={theme.colors.textHigh} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Flo-Style Calendar Strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarStrip}>
            {calendarDays.map((day, idx) => (
              <TouchableOpacity key={idx} style={[styles.calendarDay, day.isToday && styles.calendarDayActive]}>
                <Typography variant="caption1" color={day.isToday ? '#fff' : theme.colors.textMedium} style={{ fontFamily: theme.typography.families.bodySemibold }}>
                  {day.dayName}
                </Typography>
                <Typography variant="headline" color={day.isToday ? '#fff' : theme.colors.textHigh} style={{ marginTop: 4 }}>
                  {day.dayNumber}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section Title & Controls */}
          <View style={styles.sectionHeader}>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Pregnancy{'\n'}Journey
            </Typography>
            <View style={styles.sectionControls}>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => navigation.navigate('Trimester', { trimesterId: currentTrimester })}>
                <Typography variant="subhead" color={theme.colors.textMedium} style={{marginRight: 4}}>Trimester</Typography>
                <ChevronDown size={16} color={theme.colors.textMedium} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('Tracker')}>
                <ArrowRight size={20} color="#fff" />
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
                <Smile size={14} color={theme.colors.textMedium} />
              </View>
            </View>

            <View style={[styles.floatingCard, styles.cardBottomLeft]}>
              <Typography variant="title2" style={styles.floatingNumber}>{remainingWeeks.toString().padStart(2, '0')}</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{marginTop: -4}}>
                Remaining{'\n'}Week
              </Typography>
              <View style={styles.smallIconWrapTop}>
                <Clock size={14} color={theme.colors.textMedium} />
              </View>
            </View>
          </View>

          {/* Baby Size Fact */}
          <View style={styles.babyFactCard}>
            <Sparkles size={18} color={theme.colors.primaryDark} style={{ marginRight: 8, marginTop: 2 }} />
            <Typography variant="subhead" color={theme.colors.textHigh} style={{ flex: 1, lineHeight: 20 }}>
              <Text style={{ fontFamily: theme.typography.families.headingBold }}>Week {weeksPregnant}:</Text> Your baby is the size of a squash! They are practicing opening and closing their eyes.
            </Typography>
          </View>

          {/* Daily Focus Goal Widget */}
          {renderGoalWidget()}

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
                <Stethoscope size={24} color={theme.colors.primary} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Next ANC Visit</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>{nextVisit ? `${nextVisit.date.split(' ')[0]}, ${nextVisit.time}` : 'Schedule Now'}</Typography>
            </TouchableOpacity>

            {/* Daily Check-In Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.actionCard, {backgroundColor: '#fff'}]} onPress={() => navigation.navigate('CheckIn')}>
              <View style={[styles.actionIconWrap, {backgroundColor: theme.colors.info + '20'}]}>
                <CheckSquare size={24} color={theme.colors.info} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Daily Check-In</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>Log your vitals</Typography>
            </TouchableOpacity>

            {/* Partner Mode Card */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.actionCard, {backgroundColor: '#fff'}]} onPress={() => navigation.navigate('PartnerMode')}>
              <View style={[styles.actionIconWrap, {backgroundColor: theme.colors.success + '20'}]}>
                <HeartPulse size={24} color={theme.colors.success} />
              </View>
              <Typography variant="subhead" style={styles.actionTitle}>Partner Mode</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium}>Share journey</Typography>
            </TouchableOpacity>

          </ScrollView>

          {/* Vitals Mini-Chart */}
          <View style={[styles.sectionHeader, { marginTop: theme.spacing[6], marginBottom: theme.spacing[3] }]}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              My Vitals
            </Typography>
            <TouchableOpacity onPress={() => navigation.navigate('Analysis')}>
              <Typography variant="subhead" color={theme.colors.primary}>View All</Typography>
            </TouchableOpacity>
          </View>
          
          <View style={{ marginHorizontal: theme.spacing[5], marginBottom: theme.spacing[6], backgroundColor: '#fff', borderRadius: 24, padding: theme.spacing[4], ...theme.shadows.medium }}>
            <Typography variant="subhead" color={theme.colors.textMedium} style={{marginBottom: theme.spacing[2]}}>
              Symptom Intensity (Last 5 Logs)
            </Typography>
            <LineChart
              data={chartData}
              width={width - 72} 
              height={180}
              segments={2}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.primaryLight,
                labelColor: (opacity = 1) => theme.colors.textMedium,
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: theme.colors.primaryDark
                }
              }}
              bezier
              style={{
                marginLeft: -16
              }}
            />
          </View>

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
    paddingBottom: theme.spacing[6],
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
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    borderWidth: 1,
    borderColor: '#F8F9FA',
  },
  calendarStrip: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  calendarDay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radii.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 54,
  },
  calendarDayActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
  babyFactCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryLight + '30',
    padding: theme.spacing[4],
    borderRadius: theme.radii.lg,
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[6],
    alignItems: 'flex-start',
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
    marginTop: theme.spacing[3],
    marginBottom: 2,
    fontFamily: theme.typography.families.headingBold,
  },
  goalWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[4],
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing[6],
  },
  goalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
  },
  goalTextWrap: {
    flex: 1,
  }
});

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Text, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Bell, Activity, Apple, CheckSquare, Stethoscope, Clock, Smile, Flower, Heart, ArrowRight } from 'lucide-react-native';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { getAncVisits } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const dueDate = user?.due_date || '';
  const calculatedWeeks = dueDate ? getWeeksPregnant(dueDate) : 0;
  const weeksPregnant = calculatedWeeks > 0 ? calculatedWeeks : 32; 
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 0;
  const remainingWeeks = daysUntilDue > 0 ? Math.ceil(daysUntilDue / 7) : 8;
  
  const [nextVisit, setNextVisit] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (user?.id) {
      getAncVisits().then(data => {
        const visits = data || [];
        const upcoming = visits.find((v: any) => v.status === 'scheduled');
        setNextVisit(upcoming);
      });
    }
  }, [user]);

  const hour = new Date().getHours();
  let greeting = 'Good Evening,';
  if (hour < 12) greeting = 'Good Morning,';
  else if (hour < 18) greeting = 'Good Afternoon,';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Editorial Background Gradient */}
      <LinearGradient 
        colors={['#FFF5F5', '#FFFFFF', '#FAFAFA']} 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Typography variant="subhead" style={styles.greetingText}>
                {greeting}
              </Typography>
              <Typography variant="title1" style={styles.nameText}>
                {user?.name ? user.name.split(' ')[0] : 'Mama'}
              </Typography>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
              <Typography variant="headline" style={{color: '#fff', fontFamily: theme.typography.families.headingSemibold}}>
                {user?.name ? user.name[0].toUpperCase() : 'B'}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Premium Hero Dashboard */}
          <View style={styles.heroSection}>
            <Typography variant="largeTitle" style={styles.heroTitle}>Week {weeksPregnant}</Typography>
            <Typography variant="body" style={styles.heroSubtitle}>
              Your baby is the size of a <Text style={{fontFamily: theme.typography.families.headingBold, color: theme.colors.primaryDark}}>squash</Text>. They are practicing opening and closing their eyes!
            </Typography>

            <View style={styles.imageWrapper}>
              <Image 
                source={require('../../assets/baby.png')} 
                style={styles.heroImage} 
                resizeMode="cover" 
              />
              <LinearGradient 
                colors={['transparent', 'rgba(0,0,0,0.5)']} 
                style={styles.imageOverlay} 
              />
              <View style={styles.imageDetails}>
                <Typography variant="headline" style={{color: '#FFF'}}>{remainingWeeks} Weeks Left</Typography>
                <Typography variant="subhead" style={{color: 'rgba(255,255,255,0.8)'}}>3rd Trimester</Typography>
              </View>
            </View>
          </View>

          {/* Editorial Tip Card */}
          <View style={styles.tipContainer}>
            <View style={styles.tipHeader}>
              <Flower size={18} color={theme.colors.primaryDark} />
              <Typography variant="caption1" style={styles.tipTitle}>DAILY FOCUS</Typography>
            </View>
            <Typography variant="title3" style={styles.tipText}>
              Take 5 deep breaths today. You are doing great, mama.
            </Typography>
          </View>

          {/* Quick Actions (Horizontal Pills) */}
          <View style={styles.sectionHeader}>
            <Typography variant="title2" style={styles.sectionTitle}>Quick Actions</Typography>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
            
            <TouchableOpacity style={styles.actionPill} activeOpacity={0.8} onPress={() => navigation.navigate('Tracker')}>
              <View style={[styles.pillIconBg, { backgroundColor: '#FEE2E2' }]}>
                <Activity size={20} color="#DC2626" />
              </View>
              <View style={styles.pillTextWrap}>
                <Typography variant="subhead" style={styles.pillTitle}>Log Vitals</Typography>
                <Typography variant="caption1" style={styles.pillDesc}>BP & Weight</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionPill} activeOpacity={0.8} onPress={() => navigation.navigate('CheckIn')}>
              <View style={[styles.pillIconBg, { backgroundColor: '#FEF3C7' }]}>
                <CheckSquare size={20} color="#D97706" />
              </View>
              <View style={styles.pillTextWrap}>
                <Typography variant="subhead" style={styles.pillTitle}>Symptoms</Typography>
                <Typography variant="caption1" style={styles.pillDesc}>How you feel</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionPill} activeOpacity={0.8} onPress={() => navigation.navigate('ANCVisit')}>
              <View style={[styles.pillIconBg, { backgroundColor: '#D1FAE5' }]}>
                <Stethoscope size={20} color="#059669" />
              </View>
              <View style={styles.pillTextWrap}>
                <Typography variant="subhead" style={styles.pillTitle}>Next Visit</Typography>
                <Typography variant="caption1" style={styles.pillDesc}>{nextVisit ? nextVisit.date.split(' ')[0] : 'Schedule'}</Typography>
              </View>
            </TouchableOpacity>

          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 140, // Important padding for floating custom tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyMedium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nameText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 56,
    lineHeight: 60,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: '90%',
  },
  imageWrapper: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  imageDetails: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  tipContainer: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  tipText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingMedium,
    lineHeight: 26,
    fontSize: 18,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
  },
  actionsScroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100, // Pill shape
    padding: 8,
    paddingRight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  pillIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextWrap: {
    marginLeft: 12,
  },
  pillTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
    marginBottom: 2,
  },
  pillDesc: {
    color: theme.colors.textMedium,
  }
});

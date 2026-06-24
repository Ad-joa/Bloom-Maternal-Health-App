import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedCard from '../components/AnimatedCard';
import PregnancyRing from '../components/PregnancyRing';
import { useAuth } from '../hooks/useAuth';
import { calculatePregnancyDetails } from '../utils/pregnancyCalculator';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useAuth();

  const userName = profile?.name ? profile.name.split(' ')[0] : "Mama";
  const pregnancyDetails = profile?.lmpDate ? calculatePregnancyDetails(profile.lmpDate) : null;

  const currentTrimester = pregnancyDetails?.trimester || 1;
  const weeksProgress = pregnancyDetails?.weeks ?? 0;
  const daysProgress = pregnancyDetails?.days ?? 0;
  
  // Calculate progress ratio (40 weeks is standard full term)
  const progressRatio = pregnancyDetails ? Math.min((weeksProgress * 7 + daysProgress) / 280, 1) : 0;
  
  const profileInitial = profile?.name ? profile.name.charAt(0).toUpperCase() : 'M';

  const quickActions = [
    { title: 'Symptoms', icon: 'medical', color: Colors.primary, route: 'Symptoms' },
    { title: 'Danger Signs', icon: 'warning', color: Colors.error, route: 'DangerSigns' },
    { title: 'Calendar', icon: 'calendar', color: Colors.brandOrange, route: 'Visits' },
    { title: 'Library', icon: 'book', color: Colors.accent, route: 'Trimester' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader 
        title={`Hello, ${userName}`} 
        largeTitle={true}
        subtitle="Your baby is growing beautifully."
        rightElement={
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>{profileInitial}</Text>
            </View>
          </TouchableOpacity>
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pregnancy Ring Section */}
        <View style={styles.heroSection}>
          <PregnancyRing 
            progress={progressRatio} 
            weeks={weeksProgress} 
            days={daysProgress} 
          />
          <View style={styles.trimesterBadge}>
            <Text style={styles.trimesterText}>Trimester {currentTrimester}</Text>
          </View>
        </View>

        {/* Quick Actions Grids */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {quickActions.map((action, index) => (
              <AnimatedCard 
                key={index} 
                style={styles.actionTileWrapper}
                onPress={() => navigation.navigate(action.route)}
              >
                <View style={styles.actionTile}>
                  <View style={[styles.iconBox, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon as any} size={28} color={action.color} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </View>
              </AnimatedCard>
            ))}
          </View>
        </View>

        {/* Tip of the Day */}
        <View style={styles.tipContainer}>
          <AnimatedCard onPress={() => navigation.navigate('Trimester')}>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="sparkles" size={20} color={Colors.primary} />
                <Text style={styles.tipTitle}>Daily Insight</Text>
              </View>
              <Text style={styles.tipText}>
                Stay hydrated! Drinking at least 8-10 glasses of water daily helps maintain amniotic fluid levels and reduces swelling.
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbfb',
  },
  scrollContent: {
    paddingBottom: 120, // Space for floating tab bar
  },
  profileButton: {
    padding: 2,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.soft,
  },
  profileInitial: {
    ...Typography.h3,
    fontWeight: '800',
    color: Colors.primary,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  trimesterBadge: {
    marginTop: -20,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...Shadow.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  trimesterText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.brandOrange,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionTileWrapper: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    height: 110,
    marginBottom: Spacing.md,
  },
  actionTile: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.soft,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  tipContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  tipCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    ...Shadow.soft,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipTitle: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tipText: {
    ...Typography.body,
    color: Colors.textLight,
    lineHeight: 24,
  },
});

export default HomeScreen;

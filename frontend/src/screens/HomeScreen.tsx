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
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 32; // Mocking 32 for the UI
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 56; // Mocking 8 weeks left

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
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.textMedium} />
            </TouchableOpacity>
          </View>

          {/* Section Title & Controls */}
          <View style={styles.sectionHeader}>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Pregnancy{'\n'}Journey
            </Typography>
            <View style={styles.sectionControls}>
              <TouchableOpacity style={styles.dropdownButton}>
                <Typography variant="subhead" color={theme.colors.textMedium} style={{marginRight: 4}}>Months</Typography>
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
              <Typography variant="title2" style={styles.floatingNumber}>08</Typography>
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
            <View style={[styles.symptomCard, styles.symptomCardPurple]}>
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
            </View>

            {/* White Card */}
            <View style={[styles.symptomCard, styles.symptomCardWhite]}>
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
            </View>
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
});

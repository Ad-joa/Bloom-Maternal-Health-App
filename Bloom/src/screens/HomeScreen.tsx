import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import TrimesterBadge from '../components/TrimesterBadge';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const userName = "Sarah"; // Hardcoded as per requirements
  const currentTrimester = 2; // Hardcoded example

  const quickActions = [
    { title: 'Symptom Checker', icon: 'medical', color: Colors.primary, route: 'Symptoms' },
    { title: 'Danger Signs', icon: 'warning', color: Colors.high, route: 'DangerSigns' },
    { title: 'Next Visit', icon: 'calendar', color: Colors.accent, route: 'Visits' },
    { title: 'Health Tips', icon: 'leaf', color: Colors.success, route: 'Trimester' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader 
          title={`Hello, ${userName}`} 
          subtitle="How are you feeling today?" 
          rightElement={
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileCircle}>
                <Text style={styles.profileInitial}>S</Text>
              </View>
            </TouchableOpacity>
          }
        />

        {/* Trimester Card */}
        <View style={styles.trimesterCard}>
          <View style={styles.trimesterInfo}>
            <Text style={styles.trimesterLabel}>Current Trimester</Text>
            <Text style={styles.trimesterValue}>Second Trimester</Text>
            <Text style={styles.weeksText}>24 Weeks, 3 Days</Text>
            <TrimesterBadge trimester={currentTrimester} />
          </View>
          <View style={styles.trimesterIconContainer}>
             <Ionicons name="heart" size={60} color={Colors.white} />
          </View>
        </View>

        {/* Quick Actions Grids */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionTile}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tip of the Day */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color={Colors.accent} />
            <Text style={styles.tipTitle}>Tip of the Day</Text>
          </View>
          <Text style={styles.tipText}>
            "Stay hydrated! Drinking at least 8-10 glasses of water daily helps maintain amniotic fluid levels and reduces swelling."
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  profileButton: {
    padding: 2,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileInitial: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  trimesterCard: {
    margin: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.medium,
  },
  trimesterInfo: {
    flex: 1,
  },
  trimesterLabel: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  trimesterValue: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: 4,
  },
  weeksText: {
    ...Typography.body,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: Spacing.md,
  },
  trimesterIconContainer: {
    marginLeft: Spacing.md,
    opacity: 0.3,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  actionTile: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.soft,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  tipCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
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
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});

export default HomeScreen;

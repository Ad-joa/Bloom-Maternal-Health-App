import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Stethoscope, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { getDaysUntilDue, getWeeksPregnant, getCurrentTrimester, getTrimesterName } from '../utils/dateUtils';

// We have to ignore the strict type for navigating to a nested Tab for now, 
// or define the composite type. For simplicity, we use `any` to navigate to tabs.
type Props = {
  navigation: any; 
};

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  
  const dueDate = user?.due_date || '';
  const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : 0;
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 0;
  const currentTrimester = dueDate ? getCurrentTrimester(dueDate) : (user?.trimester || 1);
  const trimesterName = getTrimesterName(currentTrimester);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="body" color={theme.colors.textMedium}>
            Good morning,
          </Typography>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>
            {user?.name ? user.name.split(' ')[0] : 'Bloom User'}
          </Typography>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Typography variant="title2" color={theme.colors.primaryDark}>
            {user?.name ? user.name[0].toUpperCase() : 'B'}
          </Typography>
        </View>
      </View>

      {/* Hero Card: Current Trimester */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => navigation.navigate('Trimester', { trimesterId: currentTrimester })}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View>
              <Typography variant="subhead" color="#ffffffa0">
                CURRENT STAGE
              </Typography>
              <Typography variant="title2" color="#fff" style={styles.heroTitle}>
                {trimesterName}
              </Typography>
              <Typography variant="body" color="#ffffffd0">
                {dueDate ? `Week ${weeksPregnant} • ${daysUntilDue} days until due date` : 'No due date set'}
              </Typography>
            </View>
            <View style={styles.heroIconContainer}>
              <Typography style={{fontSize: 40}}>👶</Typography>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Typography variant="title3" style={styles.sectionTitle}>
          Quick Actions
        </Typography>
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Advisory')}
          >
            <Card style={styles.actionCard}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.colors.danger + '20' }]}>
                <Stethoscope color={theme.colors.danger} size={24} />
              </View>
              <Typography variant="subhead" style={styles.actionText}>Symptom Check</Typography>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigation.navigate('Tracker')}
          >
            <Card style={styles.actionCard}>
              <View style={[styles.iconWrapper, { backgroundColor: theme.colors.success + '20' }]}>
                <Calendar color={theme.colors.success} size={24} />
              </View>
              <Typography variant="subhead" style={styles.actionText}>Log Symptoms</Typography>
            </Card>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Danger Signs */}
      <View style={styles.section}>
        <Typography variant="title3" style={styles.sectionTitle}>
          Emergency Danger Signs
        </Typography>
        <Card variant="outlined" style={styles.dangerCard}>
          <View style={styles.dangerHeader}>
            <AlertTriangle color={theme.colors.danger} size={24} />
            <Typography variant="headline" style={styles.dangerTitle}>Go to hospital immediately if you have:</Typography>
          </View>
          <View style={styles.dangerList}>
            <Typography variant="body" color={theme.colors.textMedium}>• Heavy vaginal bleeding</Typography>
            <Typography variant="body" color={theme.colors.textMedium}>• Convulsions or fits</Typography>
            <Typography variant="body" color={theme.colors.textMedium}>• Severe headache with blurred vision</Typography>
            <Typography variant="body" color={theme.colors.textMedium}>• Fever and too weak to get out of bed</Typography>
          </View>
          <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.8}>
            <Typography variant="headline" color="#fff">Emergency Contacts</Typography>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Daily Tip */}
      <View style={styles.section}>
        <Typography variant="title3" style={styles.sectionTitle}>
          Today's Tip
        </Typography>
        <Card variant="outlined" style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Typography style={{fontSize: 24}}>💧</Typography>
            <Typography variant="headline" style={styles.tipTitle}>Stay Hydrated</Typography>
          </View>
          <Typography variant="body" color={theme.colors.textMedium}>
            Drinking 8-10 glasses of water helps form the amniotic fluid around the baby and carries extra nutrients!
          </Typography>
        </Card>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing[5],
    paddingTop: theme.spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  heroCard: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[6],
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    marginVertical: theme.spacing[1],
  },
  heroIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    color: theme.colors.textHigh,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  actionButton: {
    flex: 1,
  },
  actionCard: {
    alignItems: 'center',
    padding: theme.spacing[4],
    marginBottom: 0,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  actionText: {
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: theme.spacing[5],
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
    gap: theme.spacing[2],
  },
  tipTitle: {
    color: theme.colors.primaryDark,
  },
  dangerCard: {
    borderColor: theme.colors.danger + '40',
    backgroundColor: theme.colors.danger + '05',
    padding: theme.spacing[5],
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  dangerTitle: {
    color: theme.colors.danger,
    flex: 1,
  },
  dangerList: {
    paddingLeft: theme.spacing[2],
    gap: theme.spacing[1],
    marginBottom: theme.spacing[4],
  },
  emergencyBtn: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing[3],
    borderRadius: theme.radii.lg,
    alignItems: 'center',
  }
});

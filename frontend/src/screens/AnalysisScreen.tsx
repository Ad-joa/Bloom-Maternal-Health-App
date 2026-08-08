import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { LineChart, CalendarHeart, TrendingUp } from 'lucide-react-native';

export default function AnalysisScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Trends & Analysis
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 8}}>
          Insights based on your recent daily logs.
        </Typography>
      </View>

      <Card style={styles.vibeCard} variant="filled">
        <View style={styles.row}>
          <TrendingUp color={theme.colors.success} size={28} />
          <View style={{marginLeft: theme.spacing[4], flex: 1}}>
            <Typography variant="headline">Improving Trend</Typography>
            <Typography variant="subhead" color={theme.colors.textMedium}>
              Your morning sickness has reduced from 'Severe' to 'Mild' over the last 7 days.
            </Typography>
          </View>
        </View>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        Symptom History
      </Typography>
      
      <Card style={styles.historyCard} variant="elevated">
        <View style={styles.historyRow}>
          <Typography variant="subhead" color={theme.colors.textMedium}>Yesterday, 2:30 PM</Typography>
          <View style={styles.tag}>
            <Typography variant="caption1" color={theme.colors.primaryDark}>Headache (Mild)</Typography>
          </View>
        </View>
        
        <View style={styles.historyRow}>
          <Typography variant="subhead" color={theme.colors.textMedium}>Oct 4, 9:00 AM</Typography>
          <View style={styles.tagSevere}>
            <Typography variant="caption1" color={theme.colors.danger}>Nausea (Severe)</Typography>
          </View>
        </View>
        
        <View style={styles.historyRow}>
          <Typography variant="subhead" color={theme.colors.textMedium}>Oct 2, 8:15 PM</Typography>
          <View style={styles.tag}>
            <Typography variant="caption1" color={theme.colors.primaryDark}>Cramps (Mild)</Typography>
          </View>
        </View>
      </Card>

      <Card style={styles.placeholderCard} variant="outlined">
        <LineChart color={theme.colors.textMedium} size={48} />
        <Typography variant="headline" style={{marginTop: theme.spacing[4]}}>
          More Data Needed
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} align="center" style={{marginTop: theme.spacing[2]}}>
          Keep logging your daily check-ins to unlock detailed intensity graphs!
        </Typography>
      </Card>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surfaceVariant,
  },
  header: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[4],
  },
  vibeCard: {
    marginBottom: theme.spacing[6],
    backgroundColor: theme.colors.success + '15',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
  },
  historyCard: {
    marginBottom: theme.spacing[6],
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  tag: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.pill,
  },
  tagSevere: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.danger + '20',
    borderRadius: theme.radii.pill,
  },
  placeholderCard: {
    alignItems: 'center',
    padding: theme.spacing[8],
    borderStyle: 'dashed',
  }
});

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';

export default function InsightsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Your Insights
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium}>
          Track your symptoms and well-being over time.
        </Typography>
      </View>

      <Card style={styles.chartCard}>
        <Typography variant="headline" style={styles.chartTitle}>Symptom Frequency</Typography>
        <View style={styles.mockChart}>
          {/* Mock Bar Chart */}
          <View style={styles.barContainer}>
            <View style={[styles.bar, { height: '80%', backgroundColor: theme.colors.primaryLight }]} />
            <Typography variant="caption2" color={theme.colors.textMedium}>Mon</Typography>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.bar, { height: '50%', backgroundColor: theme.colors.primaryLight }]} />
            <Typography variant="caption2" color={theme.colors.textMedium}>Tue</Typography>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.bar, { height: '90%', backgroundColor: theme.colors.primary }]} />
            <Typography variant="caption2" color={theme.colors.textMedium}>Wed</Typography>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.bar, { height: '30%', backgroundColor: theme.colors.primaryLight }]} />
            <Typography variant="caption2" color={theme.colors.textMedium}>Thu</Typography>
          </View>
          <View style={styles.barContainer}>
            <View style={[styles.bar, { height: '40%', backgroundColor: theme.colors.primaryLight }]} />
            <Typography variant="caption2" color={theme.colors.textMedium}>Fri</Typography>
          </View>
        </View>
      </Card>

      <View style={styles.row}>
        <Card style={styles.statCard}>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>12</Typography>
          <Typography variant="subhead" color={theme.colors.textMedium}>Logs This Week</Typography>
        </Card>
        <Card style={styles.statCard}>
          <Typography variant="largeTitle" color={theme.colors.success}>Good</Typography>
          <Typography variant="subhead" color={theme.colors.textMedium}>Overall Vibe</Typography>
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
  },
  header: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[4],
  },
  chartCard: {
    padding: theme.spacing[5],
    marginBottom: theme.spacing[4],
  },
  chartTitle: {
    marginBottom: theme.spacing[6],
  },
  mockChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingBottom: theme.spacing[2],
  },
  barContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 32,
  },
  bar: {
    width: '100%',
    borderRadius: theme.radii.sm,
    marginBottom: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing[5],
  }
});

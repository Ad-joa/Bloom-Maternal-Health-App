import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getInsights } from '../api/api';

export default function InsightsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({ totalLogs: 0, overallVibe: 'Unknown' });

  useEffect(() => {
    const fetchInsights = async () => {
      if (user) {
        try {
          const data = await getInsights(user.id);
          setInsights(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          {user ? `${user.name}'s Insights` : 'Your Insights'}
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
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>{insights.totalLogs}</Typography>
          <Typography variant="subhead" color={theme.colors.textMedium}>Total Logs</Typography>
        </Card>
        <Card style={styles.statCard}>
          <Typography variant="largeTitle" color={insights.overallVibe === 'Good' ? theme.colors.success : theme.colors.warning}>
            {insights.overallVibe}
          </Typography>
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

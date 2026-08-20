import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';
import { getSymptomLogs } from '../api/api';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getSymptomLogs(user.id).then(data => {
        setLogs(data || []);
        setLoading(false);
      });
    }
  }, [user]);

  // Transform logs into chart data
  // Assign simple numerical weights to severities: Mild=1, Moderate=2, Severe=3
  const getSeverityScore = (symptomsStr: string) => {
    if (!symptomsStr) return 0;
    if (symptomsStr.toLowerCase().includes('severe') || symptomsStr.toLowerCase().includes('n3') || symptomsStr.toLowerCase().includes('c3')) return 3;
    if (symptomsStr.toLowerCase().includes('moderate') || symptomsStr.toLowerCase().includes('n2') || symptomsStr.toLowerCase().includes('c2')) return 2;
    if (symptomsStr.toLowerCase().includes('mild') || symptomsStr.toLowerCase().includes('n1') || symptomsStr.toLowerCase().includes('c1')) return 1;
    return 1;
  };

  const chartData = {
    labels: logs.length > 0 ? logs.map(l => new Date(l.created_at).toLocaleDateString('en-US', {weekday: 'short'})) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: logs.length > 0 ? logs.map(l => getSeverityScore(l.symptoms)) : [1, 2, 1, 3, 2, 1, 1],
        color: (opacity = 1) => `rgba(192, 132, 252, ${opacity})`, // primary purple
        strokeWidth: 3
      }
    ]
  };
  return (
    <View style={styles.container}>

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          <Ionicons name="trending-up" color={theme.colors.success} size={28} />
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
      
      <Card style={styles.historyCard} variant="glass">
          <Typography variant="subhead" color={theme.colors.textMedium}>
            Based on your tracked logs, here is the intensity of your symptoms over time.
          </Typography>
          <View style={{ marginTop: theme.spacing[4], alignItems: 'center' }}>
            <LineChart
              data={chartData}
              width={width - 64} // from padding
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(192, 132, 252, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.textMedium,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: theme.colors.primaryDark
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
      </Card>

      
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing[5],
    paddingBottom: 120, // Space for floating tab bar
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

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
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
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

  const getSeverityScore = (severity: string) => {
    if (!severity) return 1;
    if (severity.toLowerCase() === 'severe') return 3;
    if (severity.toLowerCase() === 'moderate') return 2;
    return 1;
  };

  const chartData = {
    labels: logs.length > 0 ? logs.map(l => new Date(l.created_at).toLocaleDateString('en-US', {weekday: 'short'})) : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: logs.length > 0 ? logs.map(l => getSeverityScore(l.severity)) : [1, 2, 1, 3, 2, 1, 1],
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
                backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
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

      <Typography variant="title3" style={[styles.sectionTitle, { marginTop: theme.spacing[4] }]}>
        Recent Logs
      </Typography>
      
      {logs.length > 0 ? (
        logs.map((log: any, index: number) => (
          <Card key={index} style={styles.historyCard} variant="glass">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography variant="headline">
                {new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Typography>
              <View style={log.severity === 'severe' ? styles.tagSevere : styles.tag}>
                <Typography variant="caption1" color={log.severity === 'severe' ? theme.colors.danger : theme.colors.primaryDark}>
                  {log.severity ? log.severity.toUpperCase() : 'MILD'}
                </Typography>
              </View>
            </View>
            <Typography variant="body" color={theme.colors.textMedium} style={{ marginBottom: 4 }}>
              Symptoms: {log.symptoms || 'None'}
            </Typography>
            {log.blood_pressure && (
              <Typography variant="caption1" color={theme.colors.textMedium}>
                BP: {log.blood_pressure}
              </Typography>
            )}
            {log.notes && (
              <View style={{ marginTop: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 8 }}>
                <Typography variant="caption2" color={theme.colors.textMedium}>Note: {log.notes}</Typography>
              </View>
            )}
          </Card>
        ))
      ) : (
        <Card style={styles.placeholderCard} variant="glass">
          <Typography variant="body" color={theme.colors.textMedium}>
            No logs recorded yet.
          </Typography>
        </Card>
      )}

      
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
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

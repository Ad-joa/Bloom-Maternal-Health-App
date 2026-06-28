import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { useAuth } from '../context/AuthContext';
import { getInsights } from '../api/api';
import { getWeeksPregnant } from '../utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function InsightsScreen() {
  const { user } = useAuth();
  const [insights, setInsights] = useState({ totalLogs: 0, overallVibe: '...' });

  useEffect(() => {
    const fetchInsights = async () => {
      if (user) {
        try {
          const data = await getInsights(user.id);
          setInsights(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchInsights();
  }, [user]);

  const weeks = user?.due_date ? getWeeksPregnant(user.due_date) : 0;

  const articles = [
    {
      id: '1',
      title: 'Nutrition during pregnancy',
      category: 'Diet',
      color: theme.colors.primaryLight,
      height: 200,
    },
    {
      id: '2',
      title: 'What to expect in week ' + weeks,
      category: 'Weekly Guide',
      color: '#fff',
      height: 160,
    },
    {
      id: '3',
      title: 'Managing Stress',
      category: 'Mental Health',
      color: theme.colors.primaryDark,
      textLight: true,
      height: 160,
    },
    {
      id: '4',
      title: 'Safe Exercises',
      category: 'Fitness',
      color: '#F3E8FF',
      height: 200,
    }
  ];

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
              For you
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium}>
              Personalized insights & articles
            </Typography>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: '#fff' }]}>
              <Typography variant="headline" color={theme.colors.textMedium}>Symptom Logs</Typography>
              <Typography variant="largeTitle" color={theme.colors.primaryDark}>{insights.totalLogs}</Typography>
            </View>
            <View style={[styles.statBox, { backgroundColor: theme.colors.primary }]}>
              <Typography variant="headline" color="#ffffffa0">Vibe Check</Typography>
              <Typography variant="largeTitle" color="#fff">{insights.overallVibe}</Typography>
            </View>
          </View>

          {/* Masonry Layout Mockup using two columns */}
          <View style={styles.masonryContainer}>
            <View style={styles.column}>
              {articles.filter((_, i) => i % 2 === 0).map(item => (
                <TouchableOpacity key={item.id} style={[styles.articleCard, { backgroundColor: item.color, height: item.height }]}>
                  <Typography variant="caption1" color={item.textLight ? '#ffffffa0' : theme.colors.textMedium} style={styles.category}>
                    {item.category.toUpperCase()}
                  </Typography>
                  <Typography variant="title3" color={item.textLight ? '#fff' : theme.colors.textHigh} style={styles.title}>
                    {item.title}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.column}>
              {articles.filter((_, i) => i % 2 !== 0).map(item => (
                <TouchableOpacity key={item.id} style={[styles.articleCard, { backgroundColor: item.color, height: item.height }]}>
                  <Typography variant="caption1" color={item.textLight ? '#ffffffa0' : theme.colors.textMedium} style={styles.category}>
                    {item.category.toUpperCase()}
                  </Typography>
                  <Typography variant="title3" color={item.textLight ? '#fff' : theme.colors.textHigh} style={styles.title}>
                    {item.title}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  header: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[2],
  },
  headerTitle: {
    fontFamily: theme.typography.families.headingBold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[6],
  },
  statBox: {
    flex: 1,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'center',
    height: 100,
  },
  masonryContainer: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  column: {
    flex: 1,
    gap: theme.spacing[3],
  },
  articleCard: {
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'flex-end',
  },
  category: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
  }
});

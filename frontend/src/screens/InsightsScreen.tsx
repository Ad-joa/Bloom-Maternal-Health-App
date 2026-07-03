import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { useAuth } from '../context/AuthContext';
import { getInsights } from '../api/api';
import { getWeeksPregnant } from '../utils/dateUtils';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
};

export default function InsightsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [insights, setInsights] = useState({ totalLogs: 0, overallVibe: '...' });

  useFocusEffect(
    useCallback(() => {
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
    }, [user])
  );

  const weeks = user?.due_date ? getWeeksPregnant(user.due_date) : 0;

  const articles = [
    {
      id: '1',
      title: 'Nutrition during pregnancy',
      category: 'Diet',
      color: theme.colors.primaryLight,
      icon: <BookOpen color={theme.colors.primaryDark} size={20} />
    },
    {
      id: '2',
      title: 'What to expect in week ' + weeks,
      category: 'Weekly Guide',
      color: '#fff',
      icon: <BookOpen color={theme.colors.textMedium} size={20} />
    },
    {
      id: '3',
      title: 'Managing Stress',
      category: 'Mental Health',
      color: theme.colors.primaryDark,
      textLight: true,
      icon: <BookOpen color="#ffffffa0" size={20} />
    },
    {
      id: '4',
      title: 'Safe Exercises',
      category: 'Fitness',
      color: '#F3E8FF',
      icon: <BookOpen color={theme.colors.primaryDark} size={20} />
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

          {/* Section 1: Health Trends */}
          <View style={styles.sectionHeader}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Your Health Trends
            </Typography>
            <Typography variant="caption1" color={theme.colors.textMedium}>
              Based on your Daily Logs
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

          <View style={styles.divider} />

          {/* Section 2: Educational Library */}
          <View style={styles.sectionHeader}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Educational Library
            </Typography>
            <Typography variant="caption1" color={theme.colors.textMedium}>
              Curated articles for Week {weeks}
            </Typography>
          </View>

          {/* Vertical Article List */}
          <View style={styles.articleList}>
            {articles.map(item => (
              <BounceButton 
                key={item.id}
                onPress={() => navigation.navigate('Article', { 
                  articleId: item.id, 
                  title: item.title,
                  content: "Your baby is currently experiencing rapid growth this week. You might notice some extra fatigue. Taking short walks, eating small frequent meals, and staying hydrated will help alleviate the common symptoms associated with this developmental leap."
                })}
              >
                <View style={[styles.articleCardHorizontal, { backgroundColor: item.color }]}>
                  <View style={styles.articleIconBox}>
                    {item.icon}
                  </View>
                  <View style={styles.articleContent}>
                    <Typography variant="caption1" color={item.textLight ? '#ffffffa0' : theme.colors.textMedium} style={styles.category}>
                      {item.category.toUpperCase()}
                    </Typography>
                    <Typography variant="title3" color={item.textLight ? '#fff' : theme.colors.textHigh} style={styles.title}>
                      {item.title}
                    </Typography>
                  </View>
                  <ChevronRight color={item.textLight ? '#fff' : theme.colors.textMedium} size={20} />
                </View>
              </BounceButton>
            ))}
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
  sectionHeader: {
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: theme.spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing[6],
  },
  articleList: {
    gap: theme.spacing[3],
  },
  articleCardHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  articleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  articleContent: {
    flex: 1,
  },
  category: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
  }
});

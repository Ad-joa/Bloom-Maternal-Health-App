import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { Tag } from '../components/Tag';
import { FloatingActionButton } from '../components/FloatingActionButton';

// Define the navigation param list shape inline here for convenience, 
// though typically this should be exported from App.tsx or a types file.
type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
  DailyLog: undefined;
};

type DailyLogNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DailyLog'>;

interface Props {
  navigation: DailyLogNavigationProp;
}

const COMMON_SYMPTOMS = [
  'Nausea', 'Fatigue', 'Headache', 'Heartburn',
  'Backache', 'Swollen Feet', 'Cramps', 'Spotting',
  'Happy', 'Anxious', 'Trouble Sleeping'
];

export default function DailyLogScreen({ navigation }: Props) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => 
      prev.includes(symptom) 
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    // In a real app, we would save this data to an API or local storage here
    Alert.alert(
      "Log Saved!", 
      "Your symptoms for today have been securely logged.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  // Get current date formatted nicely
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="title1" color={theme.colors.primaryDark}>
            Daily Log
          </Typography>
          <Typography variant="subhead" color={theme.colors.textMedium}>
            {today}
          </Typography>
        </View>

        <Card style={styles.progressCard}>
          <Typography variant="headline" style={styles.progressTitle}>
            Week 14, Day 2
          </Typography>
          <ProgressBar progress={35} color={theme.colors.success} trackColor={theme.colors.surfaceVariant} />
          <Typography variant="caption1" color={theme.colors.textMedium} style={styles.progressText}>
            Second Trimester (35% complete)
          </Typography>
        </Card>

        <View style={styles.section}>
          <Typography variant="title2" style={styles.sectionTitle}>
            How are you feeling today?
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium} style={styles.sectionSubtitle}>
            Select all that apply to track your trends.
          </Typography>

          <View style={styles.tagContainer}>
            {COMMON_SYMPTOMS.map((symptom) => (
              <Tag 
                key={symptom}
                label={symptom}
                selected={selectedSymptoms.includes(symptom)}
                onPress={() => toggleSymptom(symptom)}
                style={styles.tag}
              />
            ))}
          </View>
        </View>
        
        {/* Extra padding at bottom to ensure scrolling content isn't hidden by FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <FloatingActionButton 
        onPress={handleSave}
        label="Save Log"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing[4],
  },
  header: {
    marginBottom: theme.spacing[5],
  },
  progressCard: {
    marginBottom: theme.spacing[6],
  },
  progressTitle: {
    marginBottom: theme.spacing[2],
  },
  progressText: {
    marginTop: theme.spacing[2],
    textAlign: 'right',
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[1],
  },
  sectionSubtitle: {
    marginBottom: theme.spacing[4],
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[3],
  }
});

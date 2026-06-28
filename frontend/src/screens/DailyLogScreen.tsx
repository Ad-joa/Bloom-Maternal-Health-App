import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { BounceButton } from '../components/BounceButton';
import { Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { saveSymptomLog } from '../api/api';
import { LinearGradient } from 'expo-linear-gradient';

const symptomsList = [
  'Nausea', 'Fatigue', 'Headache', 'Back Pain', 'Cramps', 'Heartburn', 'Swelling', 'Dizziness', 'Mood Swings'
];

export default function DailyLogScreen() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  const handleSave = async () => {
    if (selectedSymptoms.length === 0) return;
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a log.");
      return;
    }

    setLoading(true);
    try {
      await saveSymptomLog(user.id, selectedSymptoms.join(', '));
      Alert.alert("Success", "Your daily log has been saved!");
      setSelectedSymptoms([]); // Reset
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save log. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
              Log period
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium}>
              Or any symptoms you're feeling today
            </Typography>
          </View>

          <View style={styles.section}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Symptoms
            </Typography>
            <View style={styles.chipContainer}>
              {symptomsList.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <BounceButton 
                    key={symptom} 
                    onPress={() => toggleSymptom(symptom)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    {isSelected && <Check size={16} color="#fff" style={{ marginRight: 6 }} />}
                    <Typography 
                      variant="subhead" 
                      color={isSelected ? '#fff' : theme.colors.textHigh}
                    >
                      {symptom}
                    </Typography>
                  </BounceButton>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            <Button 
              title="Save Log" 
              onPress={handleSave}
              loading={loading}
              disabled={selectedSymptoms.length === 0}
            />
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
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
    fontFamily: theme.typography.families.headingBold,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii.pill,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  footer: {
    marginTop: theme.spacing[4],
  }
});

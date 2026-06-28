import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { saveSymptomLog } from '../api/api';

const symptomsList = [
  'Nausea', 'Fatigue', 'Headache', 'Back Pain', 'Cramps', 'Heartburn'
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Daily Tracker
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium}>
          Log how you're feeling today
        </Typography>
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Common Symptoms
      </Typography>
      
      <View style={styles.grid}>
        {symptomsList.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);
          return (
            <TouchableOpacity 
              key={symptom} 
              onPress={() => toggleSymptom(symptom)}
              activeOpacity={0.8}
              style={styles.gridItem}
            >
              <Card 
                style={[
                  styles.symptomCard, 
                  isSelected && styles.symptomCardSelected
                ]}
                variant={isSelected ? 'elevated' : 'outlined'}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Check size={12} color="#fff" />
                  </View>
                )}
                <Typography 
                  variant={isSelected ? 'headline' : 'body'} 
                  color={isSelected ? theme.colors.primaryDark : theme.colors.textMedium}
                  align="center"
                >
                  {symptom}
                </Typography>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button 
        title="Save Log" 
        onPress={handleSave}
        loading={loading}
        style={styles.submitButton}
        disabled={selectedSymptoms.length === 0}
      />
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
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[6],
  },
  gridItem: {
    width: '47%', // roughly half width with gap
  },
  symptomCard: {
    padding: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    marginBottom: 0,
    backgroundColor: theme.colors.surface,
  },
  symptomCardSelected: {
    backgroundColor: theme.colors.primaryLight + '50',
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 'auto',
  }
});

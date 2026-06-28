import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getAdvisory } from '../api/api';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Card } from '../components/Card';
import { AlertTriangle, Info, Check } from 'lucide-react-native';

const COMMON_SYMPTOMS = [
  "Nausea", "Headache", "Swollen Feet", "Fever", "Back Pain", 
  "Cramping", "Spotting", "Fatigue", "Heartburn"
];

export default function AdvisoryScreen() {
  const { user } = useAuth();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleChip = (symptom: string) => {
    if (selectedChips.includes(symptom)) {
      setSelectedChips(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedChips(prev => [...prev, symptom]);
    }
  };

  const handleSubmit = async () => {
    const allSymptoms = [
      ...selectedChips,
      ...additionalSymptoms.split(',').map(s => s.trim()).filter(s => s)
    ];

    if (allSymptoms.length === 0) {
      Alert.alert("Input Required", "Please select or enter your symptoms.");
      return;
    }

    setLoading(true);
    setAdvice(null);
    try {
      const response = await getAdvisory(allSymptoms, user?.id);
      // Mocking a severity logic if the backend doesn't provide it yet
      // If the backend just returns a string, we map it into an object
      const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice.text;
      
      // Super naive danger check for demo purposes (usually backend does this)
      const isDanger = allSymptoms.some(s => ['fever', 'spotting', 'cramping'].includes(s.toLowerCase()));
      
      setAdvice({
        text: adviceStr || "Please consult a healthcare provider.",
        severity: isDanger ? 'danger' : 'normal'
      });

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch advisory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Symptom Checker
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
          Select common symptoms or describe what you are feeling to get intelligent advisory guidance.
        </Typography>
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Common Symptoms
      </Typography>
      <View style={styles.chipContainer}>
        {COMMON_SYMPTOMS.map((symptom) => {
          const isSelected = selectedChips.includes(symptom);
          return (
            <TouchableOpacity
              key={symptom}
              activeOpacity={0.8}
              onPress={() => toggleChip(symptom)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              {isSelected && <Check size={14} color={theme.colors.primaryDark} style={styles.chipIcon} />}
              <Typography 
                variant="subhead" 
                color={isSelected ? theme.colors.primaryDark : theme.colors.textMedium}
              >
                {symptom}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Other Symptoms
      </Typography>
      <TextInput
        placeholder="E.g. blurry vision, dizziness..."
        value={additionalSymptoms}
        onChangeText={setAdditionalSymptoms}
        multiline
        style={styles.textArea}
      />

      <Button 
        title="Analyze Symptoms" 
        onPress={handleSubmit} 
        loading={loading} 
        style={styles.button}
      />

      {advice && (
        <Card 
          style={[
            styles.resultCard, 
            { borderLeftColor: advice.severity === 'danger' ? theme.colors.danger : theme.colors.success }
          ]}
        >
          <View style={styles.resultHeader}>
            {advice.severity === 'danger' ? (
              <AlertTriangle color={theme.colors.danger} size={24} />
            ) : (
              <Info color={theme.colors.success} size={24} />
            )}
            <Typography 
              variant="title3" 
              color={advice.severity === 'danger' ? theme.colors.danger : theme.colors.success}
              style={styles.resultTitle}
            >
              {advice.severity === 'danger' ? "Medical Attention Recommended" : "Advisory"}
            </Typography>
          </View>
          <Typography variant="body" style={styles.resultText}>
            {advice.text}
          </Typography>
          
          {advice.severity === 'danger' && (
            <TouchableOpacity style={styles.emergencyCallBtn}>
              <Typography variant="headline" color="#fff">Call Hospital</Typography>
            </TouchableOpacity>
          )}
        </Card>
      )}
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
    marginBottom: theme.spacing[5],
  },
  subtitle: {
    marginTop: theme.spacing[2],
    lineHeight: 22,
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    color: theme.colors.textHigh,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[6],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radii.full,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: theme.colors.primaryLight + '30',
    borderColor: theme.colors.primary,
  },
  chipIcon: {
    marginRight: theme.spacing[2],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: theme.spacing[5],
  },
  button: {
    marginBottom: theme.spacing[6],
  },
  resultCard: {
    borderLeftWidth: 6,
    padding: theme.spacing[5],
    backgroundColor: '#fff',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    gap: theme.spacing[2],
  },
  resultTitle: {
    flex: 1,
  },
  resultText: {
    lineHeight: 24,
    color: theme.colors.textHigh,
  },
  emergencyCallBtn: {
    marginTop: theme.spacing[4],
    backgroundColor: theme.colors.danger,
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    alignItems: 'center',
  }
});

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAdvisory } from '../api/api';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { BounceButton } from '../components/BounceButton';
import { Card } from '../components/Card';
import { AlertTriangle, Info, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
      const adviceStr = typeof response.advice === 'string' ? response.advice : response.advice.text;
      
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
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
              Symptom Checker
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
              Select common symptoms or describe what you are feeling to get intelligent advisory guidance.
            </Typography>
          </View>

          <View style={styles.section}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Common Symptoms
            </Typography>
            <View style={styles.chipContainer}>
              {COMMON_SYMPTOMS.map((symptom) => {
                const isSelected = selectedChips.includes(symptom);
                return (
                  <BounceButton
                    key={symptom}
                    onPress={() => toggleChip(symptom)}
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

          <View style={styles.section}>
            <Typography variant="title3" color={theme.colors.textHigh} style={styles.sectionTitle}>
              Other Symptoms
            </Typography>
            <TextInput
              placeholder="E.g. blurry vision, dizziness..."
              value={additionalSymptoms}
              onChangeText={setAdditionalSymptoms}
              multiline
              style={styles.textArea}
            />
          </View>

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
              <Typography variant="body" color={theme.colors.textHigh} style={styles.resultText}>
                {advice.text}
              </Typography>
            </Card>
          )}

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
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    lineHeight: 24,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    borderWidth: 0,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[6],
  },
  resultCard: {
    borderLeftWidth: 4,
    backgroundColor: '#fff',
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  resultTitle: {
    marginLeft: theme.spacing[2],
    fontFamily: theme.typography.families.headingBold,
  },
  resultText: {
    lineHeight: 24,
  }
});

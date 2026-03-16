import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import RiskBadge from '../components/RiskBadge';
import { AllSymptoms, SymptomRules } from '../constants/symptomRules';

const SymptomCheckerScreen = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<{ risk: string; advisory: string } | null>(null);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setResult(null);
  };

  const checkSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    // Find the matching rule. We'll look for rules where some symptoms match.
    // In a real app, this would be more sophisticated.
    let bestMatch: any = null;
    let maxMatchCount = 0;

    for (const rule of SymptomRules) {
      const matchCount = rule.symptoms.filter(s => selectedSymptoms.includes(s)).length;
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatch = rule;
      }
    }

    if (bestMatch) {
      setResult({ risk: bestMatch.risk, advisory: bestMatch.advisory });
    } else {
      setResult({ 
        risk: 'Low', 
        advisory: 'No specific risk patterns detected for the selected symptoms. Please continue to monitor and contact your doctor if concerned.' 
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Symptom Checker" subtitle="Select what you are feeling" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.textLight} />
          <Text style={styles.infoText}>
            This tool is for educational purposes only and does not replace professional medical advice.
          </Text>
        </View>

        <View style={styles.symptomsGrid}>
          {AllSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomChip,
                selectedSymptoms.includes(symptom) && styles.selectedChip
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text style={[
                styles.symptomText,
                selectedSymptoms.includes(symptom) && styles.selectedSymptomText
              ]}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <AppButton 
          title="Check Symptoms" 
          onPress={checkSymptoms} 
          disabled={selectedSymptoms.length === 0}
          style={styles.checkButton}
        />

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Assessment Result</Text>
              <RiskBadge level={result.risk as any} />
            </View>
            <Text style={styles.advisoryText}>{result.advisory}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xl,
  },
  symptomChip: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  symptomText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.text,
  },
  selectedSymptomText: {
    color: Colors.white,
    fontWeight: '600',
  },
  checkButton: {
    marginBottom: Spacing.xl,
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    ...Shadow.medium,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  advisoryText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
});

export default SymptomCheckerScreen;

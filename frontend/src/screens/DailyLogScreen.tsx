import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { saveSymptomLog, getInsights } from '../api/api';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Check, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SYMPTOMS = [
  {
    id: 'headache',
    name: 'Headache',
    question: 'How would you describe your headache?',
    options: [
      { id: 'h1', label: 'Mild and manageable', level: 1 },
      { id: 'h2', label: 'Persistent and not going away', level: 2 },
      { id: 'h3', label: 'Severe or sudden', level: 3 },
    ]
  },
  {
    id: 'nausea',
    name: 'Nausea / Morning Sickness',
    question: 'How intense is your nausea today?',
    options: [
      { id: 'n1', label: 'Mild, just passing', level: 1 },
      { id: 'n2', label: 'Moderate, affecting meals', level: 2 },
      { id: 'n3', label: 'Severe, unable to keep food down', level: 3 },
    ]
  },
  {
    id: 'cramps',
    name: 'Abdominal Cramping',
    question: 'Describe the cramping you are experiencing:',
    options: [
      { id: 'c1', label: 'Mild, similar to a dull ache', level: 1 },
      { id: 'c2', label: 'Moderate, causing discomfort', level: 2 },
      { id: 'c3', label: 'Severe, sharp or accompanied by bleeding', level: 3 },
    ]
  }
];

export default function DailyLogScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuth();
  
  // Track expanded accordion state
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null);
  // Track selected intensities: { symptomId: optionId }
  const [selections, setSelections] = useState<Record<string, string>>({});
  
  // Vitals State
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');

  const [daysSinceLastLog, setDaysSinceLastLog] = useState(0); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getInsights(user.id)
        .then(data => {
          // If we have totalLogs > 0 we can assume they logged recently. 
          // For now, if totalLogs is 0, we show a nudge.
          if (data.totalLogs === 0) setDaysSinceLastLog(8);
        })
        .catch(console.error);
    }
  }, [user]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSymptom(prev => prev === id ? null : id);
  };

  const selectIntensity = (symptomId: string, optionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelections(prev => ({
      ...prev,
      [symptomId]: optionId
    }));
    // Auto-close after selection
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedSymptom(null);
    }, 300);
  };

  const handleSave = async () => {
    if (Object.keys(selections).length === 0) {
      Alert.alert("No symptoms selected", "Please select at least one symptom to log.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to save logs.");
      return;
    }

    setIsSaving(true);
    try {
      // Map selections to an array of strings e.g. ["headache: h1", "nausea: n2"]
      const selectedLabels = Object.entries(selections).map(([key, val]) => `${key}:${val}`);
      const maxSeverity = Math.max(...Object.entries(selections).map(([key, val]) => {
          const symptom = SYMPTOMS.find(s => s.id === key);
          return symptom?.options.find(o => o.id === val)?.level || 0;
      }), 0);

      const logData = {
        symptoms: selectedLabels.join(', '),
        severity: maxSeverity,
        blood_pressure: bloodPressure || undefined,
        weight: weight ? parseFloat(weight) : undefined
      };
      
      await saveSymptomLog(user.id, logData);
      Alert.alert("Success", "Your symptom log has been saved securely.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save symptom log. It may have been saved offline.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {daysSinceLastLog > 7 && (
        <Card style={styles.nudgeCard} variant="filled">
          <View style={styles.nudgeRow}>
            <AlertCircle color={theme.colors.warning} size={24} />
            <View style={styles.nudgeText}>
              <Typography variant="headline">It's been a while!</Typography>
              <Typography variant="subhead" color={theme.colors.textMedium}>
                You haven't logged any symptoms in {daysSinceLastLog} days. Tracking helps us keep you and your baby safe.
              </Typography>
            </View>
          </View>
        </Card>
      )}

      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.textHigh}>
          Symptom Tracker
        </Typography>
        <View style={styles.timestampRow}>
          <Clock size={16} color={theme.colors.textMedium} />
          <Typography variant="footnote" color={theme.colors.textMedium} style={{marginLeft: 4}}>
            Recording for today, {new Date().toLocaleDateString()}
          </Typography>
        </View>
      </View>

      <View style={styles.list}>
        {SYMPTOMS.map((symptom) => {
          const isExpanded = expandedSymptom === symptom.id;
          const selectedOptionId = selections[symptom.id];
          const hasSelection = !!selectedOptionId;
          const selectedOptionLabel = symptom.options.find(o => o.id === selectedOptionId)?.label;

          return (
            <Card key={symptom.id} style={styles.symptomCard} variant="elevated">
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => toggleExpand(symptom.id)}
                style={styles.symptomHeader}
              >
                <View style={styles.symptomHeaderLeft}>
                  <View style={[styles.statusIndicator, hasSelection && styles.statusActive]} />
                  <View>
                    <Typography variant="headline">{symptom.name}</Typography>
                    {hasSelection && (
                      <Typography variant="caption1" color={theme.colors.primary}>
                        {selectedOptionLabel}
                      </Typography>
                    )}
                  </View>
                </View>
                {isExpanded ? <ChevronUp size={20} color={theme.colors.textMedium} /> : <ChevronDown size={20} color={theme.colors.textMedium} />}
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Typography variant="subhead" color={theme.colors.textMedium} style={styles.question}>
                    {symptom.question}
                  </Typography>
                  
                  {symptom.options.map(option => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <TouchableOpacity 
                        key={option.id}
                        activeOpacity={0.8}
                        onPress={() => selectIntensity(symptom.id, option.id)}
                        style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                      >
                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <Typography 
                          variant="body" 
                          color={isSelected ? theme.colors.primaryDark : theme.colors.textHigh}
                        >
                          {option.label}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Card>
          );
        })}
      </View>

        <Button 
          title="Save Daily Log" 
          onPress={handleSave} 
          variant="primary" 
          disabled={isSaving}
          style={styles.saveButton}
        />
    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.surfaceVariant, // Apple grouped background
    padding: theme.spacing[5],
    paddingTop: theme.spacing[8],
    paddingBottom: 120, // Space for floating tab bar
  },
  nudgeCard: {
    backgroundColor: theme.colors.warning + '15',
    marginBottom: theme.spacing[5],
    borderColor: theme.colors.warning,
    borderWidth: 1,
  },
  nudgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  nudgeText: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  list: {
    gap: theme.spacing[4],
  },
  symptomCard: {
    padding: 0,
    overflow: 'hidden',
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  symptomHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.border,
  },
  statusActive: {
    backgroundColor: theme.colors.primary,
  },
  expandedContent: {
    padding: theme.spacing[4],
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  question: {
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radii.md,
    gap: theme.spacing[3],
  },
  optionRowSelected: {
    backgroundColor: theme.colors.primaryLight + '40',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.textMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  saveButton: {
    marginTop: theme.spacing[8],
    marginBottom: theme.spacing[4],
  }
});

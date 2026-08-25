import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { saveSymptomLog, getInsights } from '../api/api';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { TextInput } from '../components/TextInput';
import { Activity, Droplet, Thermometer, Wind, AlertCircle, Save, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { KickCounter } from '../components/KickCounter';
import { getWeeksPregnant } from '../utils/dateUtils';

const SYMPTOMS_GRID = [
  { id: 'nausea', label: 'Nausea', icon: Droplet, color: '#3B82F6' },
  { id: 'headache', label: 'Headache', icon: Thermometer, color: '#EF4444' },
  { id: 'fatigue', label: 'Fatigue', icon: Wind, color: '#8B5CF6' },
  { id: 'cramps', label: 'Cramping', icon: Activity, color: '#F59E0B' },
];

export default function TrackerScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  
  const dueDate = user?.due_date || '';
  const weeksPregnant = dueDate ? getWeeksPregnant(dueDate) : 0;
  const isThirdTrimester = weeksPregnant >= 28;

  // State
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [daysSinceLastLog, setDaysSinceLastLog] = useState(0);

  useEffect(() => {
    if (user?.id) {
      getInsights(user.id)
        .then(data => {
          if (data.totalLogs === 0) setDaysSinceLastLog(8);
        })
        .catch(console.error);
    }
  }, [user]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedSymptoms.length === 0 && !bloodPressure && !weight) {
      Alert.alert("Empty Log", "Please add at least one symptom or vital sign to save.");
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      const logData = {
        symptoms: selectedSymptoms.join(', '),
        severity: selectedSymptoms.length > 2 ? 2 : 1, // Basic severity calculation
        blood_pressure: bloodPressure || undefined,
        weight: weight ? parseFloat(weight) : undefined
      };
      
      const response = await saveSymptomLog(user.id, logData);
      
      // If the backend expert system triggered a health alert, show it prominently
      if (response && response.alerts && response.alerts.length > 0) {
        const primaryAlert = response.alerts[0];
        Alert.alert(
          "⚠️ Medical Advisory", 
          primaryAlert.alert_message,
          [{ text: "I Understand", style: "destructive" }]
        );
      } else {
        // Show normal success and clear form
        Alert.alert("Saved", "Your log has been securely saved.", [{ text: "OK" }]);
      }

      setSelectedSymptoms([]);
      setBloodPressure('');
      setWeight('');
    } catch (error) {
      Alert.alert("Error", "Failed to save. It will sync when you are back online.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient 
        colors={isDark
          ? ['#1A1A1A', '#121212', '#121212']
          : ['#FFF5F5', '#FFFFFF', '#FAFAFA']
        } 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="largeTitle" style={styles.headerTitle}>Tracker</Typography>
          <Typography variant="body" style={styles.headerSubtitle}>Log your daily vitals and symptoms for a healthier pregnancy.</Typography>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {daysSinceLastLog > 7 && (
            <View style={styles.nudgeCard}>
              <AlertCircle color="#F59E0B" size={24} />
              <View style={styles.nudgeTextWrap}>
              <Typography variant="subhead" style={{color: isDark ? '#FCD34D' : '#92400E', fontFamily: theme.typography.families.headingBold}}>It's been a while!</Typography>
                <Typography variant="caption1" style={{color: isDark ? '#FDE68A' : '#B45309'}}>Logging helps your care team monitor your health.</Typography>
              </View>
            </View>
          )}

          {/* Kick Counter (3rd Trimester Only) */}
          {isThirdTrimester && (
            <View style={styles.section}>
              <Typography variant="title3" style={styles.sectionTitle}>Kick Counter</Typography>
              <KickCounter />
            </View>
          )}

          {/* Vitals Section */}
          <View style={styles.section}>
            <Typography variant="title3" style={styles.sectionTitle}>Vitals</Typography>
            <View style={styles.glassCard}>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Typography variant="caption1" style={styles.inputLabel}>Weight (kg)</Typography>
                  <TextInput 
                    placeholder="e.g. 65.5"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    style={styles.minimalInput}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.inputHalf}>
                  <Typography variant="caption1" style={styles.inputLabel}>Blood Pressure</Typography>
                  <TextInput 
                    placeholder="120/80"
                    value={bloodPressure}
                    onChangeText={setBloodPressure}
                    keyboardType="default"
                    style={styles.minimalInput}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Symptoms Section */}
          <View style={styles.section}>
            <Typography variant="title3" style={styles.sectionTitle}>Quick Symptoms</Typography>
            <View style={styles.symptomsGrid}>
              {SYMPTOMS_GRID.map(symptom => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <TouchableOpacity 
                    key={symptom.id}
                    activeOpacity={0.7}
                    onPress={() => toggleSymptom(symptom.id)}
                    style={[
                      styles.symptomCard,
                      isSelected && { borderColor: symptom.color, backgroundColor: symptom.color + '10' }
                    ]}
                  >
                    <View style={[styles.symptomIconBg, { backgroundColor: isSelected ? symptom.color : (isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6') }]}>
                      <symptom.icon size={20} color={isSelected ? '#FFF' : (isDark ? 'rgba(255,255,255,0.6)' : '#6B7280')} />
                    </View>
                    <Typography variant="subhead" style={[styles.symptomLabel, isSelected && { color: symptom.color, fontFamily: theme.typography.families.headingBold }]}>
                      {symptom.label}
                    </Typography>
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: symptom.color }]}>
                        <Check size={12} color="#FFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (selectedSymptoms.length === 0 && !bloodPressure && !weight) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={isSaving || (selectedSymptoms.length === 0 && !bloodPressure && !weight)}
          >
            <LinearGradient 
              colors={
                (selectedSymptoms.length === 0 && !bloodPressure && !weight)
                  ? ['#E5E7EB', '#D1D5DB']
                  : [theme.colors.primary, theme.colors.primaryDark]
              } 
              style={styles.saveGradient}
              start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            >
              <Save size={20} color={(selectedSymptoms.length === 0 && !bloodPressure && !weight) ? '#9CA3AF' : '#FFF'} />
              <Typography variant="headline" style={[styles.saveText, (selectedSymptoms.length === 0 && !bloodPressure && !weight) && {color: '#9CA3AF'}]}>
                {isSaving ? 'Saving...' : 'Save Log'}
              </Typography>
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 40,
    lineHeight: 44,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 8,
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: theme.colors.textMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  nudgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(245,158,11,0.15)' : '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(245,158,11,0.25)' : '#FDE68A',
  },
  nudgeTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 16,
  },
  glassCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputHalf: {
    flex: 1,
    padding: 20,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: theme.colors.border,
  },
  inputLabel: {
    color: theme.colors.textMedium,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  minimalInput: {
    fontSize: 20,
    fontFamily: theme.typography.families.headingSemibold,
    color: theme.colors.textHigh,
    padding: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  symptomCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  symptomIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  symptomLabel: {
    color: theme.colors.textHigh,
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    borderRadius: 100,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  saveText: {
    color: '#FFF',
    marginLeft: 8,
    fontFamily: theme.typography.families.headingBold,
  }
});

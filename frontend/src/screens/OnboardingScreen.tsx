import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { BounceButton } from '../components/BounceButton';
import { LinearGradient } from 'expo-linear-gradient';
import { onboardUser } from '../api/api';
import { ChevronLeft, Calendar, Activity, CheckCircle2, User, Salad, HeartPulse, Phone, CheckSquare, Target, Smile, Baby } from 'lucide-react-native';
import { TermLoader } from '../components/TermLoader';
import { BlurView } from 'expo-blur';
import { BackgroundMesh } from '../components/BackgroundMesh';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
type Props = {
  navigation: OnboardingScreenNavigationProp;
};

const TOTAL_STEPS = 8;

export default function OnboardingScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user, token, login, logout } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDeterminingTerm, setIsDeterminingTerm] = useState(false);

  // Form State
  const [dueDate, setDueDate] = useState('');
  const [trimester, setTrimester] = useState('');
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(null);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');

  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const animateTransition = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -20, duration: 150, useNativeDriver: true })
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true })
      ]).start();
    });
  };

  const handleNext = () => {
    if (step === 1 && lastPeriodDate) {
      const lmpParts = lastPeriodDate.split('/');
      if (lmpParts.length === 3) {
        const lmpDate = new Date(`${lmpParts[2]}-${lmpParts[0]}-${lmpParts[1]}T12:00:00Z`);
        if (!isNaN(lmpDate.getTime())) {
          const calculatedDueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
          const month = String(calculatedDueDate.getUTCMonth() + 1).padStart(2, '0');
          const day = String(calculatedDueDate.getUTCDate()).padStart(2, '0');
          const year = calculatedDueDate.getUTCFullYear();
          const isoDueDate = `${year}-${month}-${day}`;
          
          if (dueDate !== isoDueDate) {
            setDueDate(isoDueDate);
            setIsDeterminingTerm(true);
            return;
          }
        }
      }
    }
    
    if (step < TOTAL_STEPS) animateTransition(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition(step - 1);
    } else {
      logout();
    }
  };

  const handleComplete = async () => {
    if (user) {
      setLoading(true);
      try {
        const payload: any = {};
        const formatToISO = (dateStr: string) => {
          if (!dateStr) return dateStr;
          if (dateStr.includes('/')) {
             const [m, d, y] = dateStr.split('/');
             if (y && m && d) return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          }
          return dateStr;
        };

        if (trimester) payload.trimester = parseInt(trimester, 10);
        if (dueDate) payload.due_date = formatToISO(dueDate);
        if (isFirstPregnancy !== null) payload.is_first_pregnancy = isFirstPregnancy;
        if (age) payload.age = parseInt(age, 10);
        if (weight) payload.weight = weight;
        if (primaryGoal) payload.primary_goal = primaryGoal;
        if (dietaryPreferences) payload.dietary_preferences = dietaryPreferences;
        if (medicalConditions) payload.medical_conditions = medicalConditions;
        if (emergencyName) payload.emergency_contact_name = emergencyName;
        if (emergencyPhone) payload.emergency_contact_phone = emergencyPhone;
        if (lastPeriodDate) {
          payload.last_period_date = lastPeriodDate;
          // Standard medical calculation (Naegele's rule): LMP + 280 days
          const lmpParts = lastPeriodDate.split('/');
          if (lmpParts.length === 3) {
            const lmpDate = new Date(`${lmpParts[2]}-${lmpParts[0]}-${lmpParts[1]}T12:00:00Z`);
            if (!isNaN(lmpDate.getTime())) {
              const calculatedDueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
              // Format back to YYYY-MM-DD
              const month = String(calculatedDueDate.getUTCMonth() + 1).padStart(2, '0');
              const day = String(calculatedDueDate.getUTCDate()).padStart(2, '0');
              const year = calculatedDueDate.getUTCFullYear();
              payload.due_date = `${year}-${month}-${day}`;
            }
          }
        }
        if (bloodGroup) payload.blood_group = bloodGroup;
        if (height) payload.height = height;

        const updatedUser = await onboardUser(user.id, payload);
        login(updatedUser, token || '');
      } catch (error) {
        console.error(error);
        login(user, token || ''); // fallback
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < step;
          const isActive = stepNumber === step;
          
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.stepSegment,
                isActive && styles.activeSegment,
                isCompleted && styles.completedSegment,
                !isActive && !isCompleted && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
              ]}
              onPress={() => {
                // Allow users to go back to previous steps to edit inputs
                if (stepNumber < step) {
                  animateTransition(stepNumber);
                }
              }}
              activeOpacity={stepNumber < step ? 0.7 : 1}
            />
          );
        })}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Calendar size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              When was the first day of your last period?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              We'll use this to safely calculate your expected due date.
            </Typography>
            <TextInput label="Last Period Date" placeholder="MM/DD/YYYY" value={lastPeriodDate} onChangeText={setLastPeriodDate} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Activity size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Which trimester are you in?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              We'll customize your daily tips based on this.
            </Typography>
            <View style={styles.optionsContainer}>
              {[1, 2, 3].map(t => (
                <BounceButton 
                  key={t}
                  onPress={() => setTrimester(String(t))}
                >
                  <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.optionCard, trimester === String(t) && styles.optionCardActive]}>
                    <Typography variant="headline" color={trimester === String(t) ? theme.colors.primaryDark : theme.colors.textHigh}>
                      Trimester {t}
                    </Typography>
                    {trimester === String(t) && <CheckCircle2 size={20} color={theme.colors.primaryDark} />}
                  </BlurView>
                </BounceButton>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Baby size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Is this your first pregnancy?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              We adapt our advice for first-time mothers.
            </Typography>
            <View style={styles.optionsContainer}>
              <BounceButton onPress={() => setIsFirstPregnancy(true)}>
                <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.optionCard, isFirstPregnancy === true && styles.optionCardActive]}>
                  <Typography variant="headline" color={isFirstPregnancy === true ? theme.colors.primaryDark : theme.colors.textHigh}>Yes, it is</Typography>
                  {isFirstPregnancy === true && <CheckCircle2 size={20} color={theme.colors.primaryDark} />}
                </BlurView>
              </BounceButton>
              <BounceButton onPress={() => setIsFirstPregnancy(false)}>
                <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.optionCard, isFirstPregnancy === false && styles.optionCardActive]}>
                  <Typography variant="headline" color={isFirstPregnancy === false ? theme.colors.primaryDark : theme.colors.textHigh}>No, I've had a baby before</Typography>
                  {isFirstPregnancy === false && <CheckCircle2 size={20} color={theme.colors.primaryDark} />}
                </BlurView>
              </BounceButton>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <User size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Age & Weight
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              For a healthy baseline tracking.
            </Typography>
            <TextInput label="Age" placeholder="e.g. 28" keyboardType="number-pad" value={age} onChangeText={setAge} />
            <View style={{height: 16}} />
            <TextInput label="Weight" placeholder="e.g. 65 kg" value={weight} onChangeText={setWeight} />
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Target size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Primary Goal
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              What is your main focus right now?
            </Typography>
            <View style={styles.optionsContainer}>
              {["Healthy Diet", "Manage Stress", "Stay Active", "Prepare for Birth"].map(goal => (
                <BounceButton 
                  key={goal}
                  onPress={() => setPrimaryGoal(goal)}
                >
                  <BlurView intensity={isDark ? 40 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.optionCard, primaryGoal === goal && styles.optionCardActive]}>
                    <Typography variant="headline" color={primaryGoal === goal ? theme.colors.primaryDark : theme.colors.textHigh}>{goal}</Typography>
                    {primaryGoal === goal && <CheckCircle2 size={20} color={theme.colors.primaryDark} />}
                  </BlurView>
                </BounceButton>
              ))}
            </View>
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Salad size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Dietary Preferences
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              Any restrictions we should know about? (Optional)
            </Typography>
            <TextInput label="Diet" placeholder="e.g. Vegetarian, Gluten-free, None" value={dietaryPreferences} onChangeText={setDietaryPreferences} />
          </View>
        );
      case 7:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <HeartPulse size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Pre-existing Medical Conditions
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              (Optional) E.g., Asthma, Gestational Diabetes. Helps our AI give safer answers.
            </Typography>
            <TextInput label="Conditions" placeholder="None" value={medicalConditions} onChangeText={setMedicalConditions} multiline />
          </View>
        );
      case 8:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Phone size={32} color={theme.colors.primaryDark} strokeWidth={2} />
            </View>
            <Typography variant="title2" color={theme.colors.textHigh} style={styles.questionTitle}>
              Emergency Contact
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              Who should we reach in case of an emergency? (Optional)
            </Typography>
            <TextInput label="Name" placeholder="e.g. Mawuli Asare" value={emergencyName} onChangeText={setEmergencyName} />
            <View style={{height: 16}} />
            <TextInput label="Phone Number" placeholder="+233..." keyboardType="phone-pad" value={emergencyPhone} onChangeText={setEmergencyPhone} />
          </View>
        );
      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !dueDate) return true;
    if (step === 2 && !trimester) return true;
    if (step === 3 && isFirstPregnancy === null) return true;
    if (step === 4 && (!age || !weight)) return true;
    if (step === 5 && !primaryGoal) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <BackgroundMesh />
      
      <SafeAreaView style={styles.safeArea}>
        
        {isDeterminingTerm ? (
          <TermLoader onComplete={() => {
            setIsDeterminingTerm(false);
            animateTransition(2);
            navigation.navigate('DueDateReveal', { dueDate });
          }} />
        ) : (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <BlurView intensity={isDark ? 40 : 70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <ChevronLeft color={theme.colors.textHigh} size={28} />
              </TouchableOpacity>
              <View style={{ flex: 1, paddingHorizontal: 16 }}>
                {renderProgressDots()}
              </View>
              <View style={{width: 40}} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                {renderStepContent()}
              </Animated.View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Button 
                title={loading ? "Saving..." : (step === TOTAL_STEPS ? "Complete Profile" : "Continue")} 
                onPress={handleNext}
                disabled={loading}
              />
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, backgroundColor: 'transparent' },
  orb: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing[2], paddingTop: theme.spacing[2], height: 60 },
  backBtn: { padding: theme.spacing[2], width: 44, alignItems: 'center' },
  progressContainer: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center' },
  stepSegment: { flex: 1, height: 6, borderRadius: 3, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
  activeSegment: { backgroundColor: theme.colors.primaryDark, shadowColor: theme.colors.primaryDark, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4, elevation: 2 },
  completedSegment: { backgroundColor: theme.colors.primary },
  scrollContent: { flexGrow: 1, padding: theme.spacing[5], justifyContent: 'center' },
  stepContainer: { flex: 1, justifyContent: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  questionTitle: { marginBottom: theme.spacing[2], textAlign: 'center' },
  questionSubtitle: { marginBottom: theme.spacing[8], textAlign: 'center' },
  optionsContainer: { gap: theme.spacing[3] },
  optionCard: { flexDirection: 'row', justifyContent: 'space-between', padding: theme.spacing[5], borderRadius: theme.radii.lg, borderWidth: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', alignItems: 'center', overflow: 'hidden' },
  optionCardActive: { borderColor: theme.colors.primaryDark, backgroundColor: isDark ? 'rgba(216,122,128,0.1)' : 'rgba(241,149,155,0.1)' },
  footer: { padding: theme.spacing[5], paddingBottom: Platform.OS === 'ios' ? 0 : theme.spacing[5] }
});

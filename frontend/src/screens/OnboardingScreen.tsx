import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { onboardUser } from '../api/api';
import { ChevronLeft } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

const TOTAL_STEPS = 8;

export default function OnboardingScreen({ navigation, route }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const user = route.params?.user;

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
    if (step < TOTAL_STEPS) animateTransition(step + 1);
    else handleComplete();
  };

  const handleBack = () => {
    if (step > 1) animateTransition(step - 1);
  };

  const handleComplete = async () => {
    if (user) {
      setLoading(true);
      try {
        const payload: any = {};
        if (trimester) payload.trimester = parseInt(trimester, 10);
        if (dueDate) payload.due_date = dueDate;
        if (isFirstPregnancy !== null) payload.is_first_pregnancy = isFirstPregnancy;
        if (age) payload.age = parseInt(age, 10);
        if (weight) payload.weight = weight;
        if (primaryGoal) payload.primary_goal = primaryGoal;
        if (dietaryPreferences) payload.dietary_preferences = dietaryPreferences;
        if (medicalConditions) payload.medical_conditions = medicalConditions;
        if (emergencyName) payload.emergency_contact_name = emergencyName;
        if (emergencyPhone) payload.emergency_contact_phone = emergencyPhone;

        const updatedUser = await onboardUser(user.id, payload);
        login(updatedUser);
      } catch (error) {
        console.error(error);
        login(user); // fallback
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProgressDots = () => (
    <View style={styles.progressContainer}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View 
          key={index} 
          style={[styles.dot, index + 1 === step && styles.activeDot, index + 1 < step && styles.completedDot]} 
        />
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              When is your expected due date?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              This helps us track your baby's development.
            </Typography>
            <TextInput label="Due Date" placeholder="MM/DD/YYYY" value={dueDate} onChangeText={setDueDate} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Which trimester are you in?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              We'll customize your daily tips based on this.
            </Typography>
            <View style={styles.optionsContainer}>
              {[1, 2, 3].map(t => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.optionCard, trimester === String(t) && styles.optionCardActive]}
                  onPress={() => setTrimester(String(t))}
                >
                  <Typography variant="headline" color={trimester === String(t) ? '#fff' : theme.colors.primaryDark}>
                    Trimester {t}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Is this your first pregnancy?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              We adapt our advice for first-time mothers.
            </Typography>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.optionCard, isFirstPregnancy === true && styles.optionCardActive]}
                onPress={() => setIsFirstPregnancy(true)}
              >
                <Typography variant="headline" color={isFirstPregnancy === true ? '#fff' : theme.colors.primaryDark}>Yes, it is</Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionCard, isFirstPregnancy === false && styles.optionCardActive]}
                onPress={() => setIsFirstPregnancy(false)}
              >
                <Typography variant="headline" color={isFirstPregnancy === false ? '#fff' : theme.colors.primaryDark}>No, I've had a baby before</Typography>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
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
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Primary Goal
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              What is your main focus right now?
            </Typography>
            <View style={styles.optionsContainer}>
              {["Healthy Diet", "Manage Stress", "Stay Active", "Prepare for Birth"].map(goal => (
                <TouchableOpacity 
                  key={goal}
                  style={[styles.optionCard, primaryGoal === goal && styles.optionCardActive]}
                  onPress={() => setPrimaryGoal(goal)}
                >
                  <Typography variant="headline" color={primaryGoal === goal ? '#fff' : theme.colors.primaryDark}>{goal}</Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
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
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
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
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Emergency Contact
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              Who should we reach in case of an emergency? (Optional)
            </Typography>
            <TextInput label="Name" placeholder="e.g. John Doe" value={emergencyName} onChangeText={setEmergencyName} />
            <View style={{height: 16}} />
            <TextInput label="Phone Number" placeholder="+1..." keyboardType="phone-pad" value={emergencyPhone} onChangeText={setEmergencyPhone} />
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.topNav}>
          {step > 1 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}><ChevronLeft size={24} color={theme.colors.textMedium} /></TouchableOpacity>
          ) : <View style={styles.backBtnPlaceholder} />}
          {renderProgressDots()}
          <View style={styles.backBtnPlaceholder} />
        </View>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
          {renderStepContent()}
        </Animated.View>
        <View style={styles.footer}>
          <Button title={step === TOTAL_STEPS ? "Complete Setup" : "Next"} onPress={handleNext} disabled={isNextDisabled() || loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.surfaceVariant },
  container: { flex: 1 },
  topNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing[4], paddingTop: theme.spacing[2], height: 60 },
  backBtn: { padding: theme.spacing[2] },
  backBtnPlaceholder: { width: 40 },
  progressContainer: { flexDirection: 'row', gap: theme.spacing[1] },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.border },
  activeDot: { backgroundColor: theme.colors.primary, width: 20 },
  completedDot: { backgroundColor: theme.colors.primaryLight },
  content: { flex: 1, padding: theme.spacing[5], justifyContent: 'center' },
  stepContainer: { flex: 1, justifyContent: 'center' },
  questionTitle: { marginBottom: theme.spacing[2], textAlign: 'center' },
  questionSubtitle: { marginBottom: theme.spacing[8], textAlign: 'center' },
  optionsContainer: { gap: theme.spacing[3] },
  optionCard: { backgroundColor: theme.colors.surface, padding: theme.spacing[4], borderRadius: theme.radii.lg, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  optionCardActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryDark },
  footer: { padding: theme.spacing[5], paddingBottom: Platform.OS === 'ios' ? 0 : theme.spacing[5] }
});

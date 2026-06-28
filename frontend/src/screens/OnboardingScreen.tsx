import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, LayoutAnimation, UIManager } from 'react-native';
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
import { ChevronRight, ChevronLeft } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

const TOTAL_STEPS = 4;

export default function OnboardingScreen({ navigation, route }: Props) {
  const [step, setStep] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [trimester, setTrimester] = useState('');
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(null);
  const [medicalConditions, setMedicalConditions] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const user = route.params?.user;

  // Animation values
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const animateTransition = (nextStep: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    });
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      animateTransition(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition(step - 1);
    }
  };

  const handleComplete = async () => {
    if (user) {
      setLoading(true);
      try {
        const payload: any = {};
        if (trimester) payload.trimester = parseInt(trimester, 10);
        if (dueDate) payload.due_date = dueDate;
        if (isFirstPregnancy !== null) payload.is_first_pregnancy = isFirstPregnancy;
        if (medicalConditions) payload.medical_conditions = medicalConditions;

        const updatedUser = await onboardUser(user.id, payload);
        login(updatedUser);
      } catch (error) {
        console.error(error);
        // fallback log in anyway
        login(user);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              index + 1 === step ? styles.activeDot : null,
              index + 1 < step ? styles.completedDot : null
            ]} 
          />
        ))}
      </View>
    );
  };

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
            <TextInput
              label="Due Date"
              placeholder="MM/DD/YYYY"
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Which trimester are you currently in?
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
                  activeOpacity={0.7}
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
                activeOpacity={0.7}
              >
                <Typography variant="headline" color={isFirstPregnancy === true ? '#fff' : theme.colors.primaryDark}>
                  Yes, it is
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.optionCard, isFirstPregnancy === false && styles.optionCardActive]}
                onPress={() => setIsFirstPregnancy(false)}
                activeOpacity={0.7}
              >
                <Typography variant="headline" color={isFirstPregnancy === false ? '#fff' : theme.colors.primaryDark}>
                  No, I've had a baby before
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Typography variant="title2" color={theme.colors.primaryDark} style={styles.questionTitle}>
              Any pre-existing medical conditions?
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.questionSubtitle}>
              (Optional) E.g., Hypertension, Diabetes. This helps our AI advisor give safer answers.
            </Typography>
            <TextInput
              label="Conditions"
              placeholder="e.g. Asthma, Gestational Diabetes..."
              value={medicalConditions}
              onChangeText={setMedicalConditions}
              multiline
            />
          </View>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !dueDate) return true;
    if (step === 2 && !trimester) return true;
    if (step === 3 && isFirstPregnancy === null) return true;
    return false;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.topNav}>
          {step > 1 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <ChevronLeft size={24} color={theme.colors.textMedium} />
            </TouchableOpacity>
          ) : <View style={styles.backBtnPlaceholder} />}
          {renderProgressDots()}
          <View style={styles.backBtnPlaceholder} />
        </View>

        <Animated.View style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
        ]}>
          {renderStepContent()}
        </Animated.View>

        <View style={styles.footer}>
          <Button 
            title={step === TOTAL_STEPS ? "Complete Setup" : "Next"} 
            onPress={handleNext} 
            disabled={isNextDisabled() || loading}
          />
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
    height: 60,
  },
  backBtn: {
    padding: theme.spacing[2],
  },
  backBtnPlaceholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  completedDot: {
    backgroundColor: theme.colors.primaryLight,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
    justifyContent: 'center',
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionTitle: {
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  questionSubtitle: {
    marginBottom: theme.spacing[8],
    textAlign: 'center',
  },
  optionsContainer: {
    gap: theme.spacing[4],
  },
  optionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[5],
    borderRadius: theme.radii.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  footer: {
    padding: theme.spacing[5],
    paddingBottom: Platform.OS === 'ios' ? 0 : theme.spacing[5],
  }
});

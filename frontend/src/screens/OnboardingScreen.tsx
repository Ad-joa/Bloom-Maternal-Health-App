import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { onboardUser } from '../api/api';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
type OnboardingScreenRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
  route: OnboardingScreenRouteProp;
};

export default function OnboardingScreen({ navigation, route }: Props) {
  const [trimester, setTrimester] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const user = route.params?.user;

  const handleComplete = async () => {
    if (trimester && dueDate && user) {
      setLoading(true);
      try {
        const updatedUser = await onboardUser(user.id, { 
          trimester: parseInt(trimester, 10) || 1, 
          due_date: dueDate 
        });
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.primaryDark}>
              Personalize
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
              Help us customize your Bloom experience
            </Typography>
          </View>
          
          <View style={styles.form}>
            <TextInput
              label="Current Trimester"
              placeholder="e.g. 1, 2, or 3"
              value={trimester}
              onChangeText={setTrimester}
              keyboardType="number-pad"
            />
            <TextInput
              label="Expected Due Date"
              placeholder="MM/DD/YYYY"
              value={dueDate}
              onChangeText={setDueDate}
            />
            
            <Button 
              title="Complete Setup" 
              onPress={handleComplete} 
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  subtitle: {
    marginTop: theme.spacing[1],
  },
  form: {
    gap: theme.spacing[2],
  },
  submitButton: {
    marginTop: theme.spacing[4],
  },
});

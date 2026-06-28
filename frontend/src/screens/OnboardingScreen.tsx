import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';

export default function OnboardingScreen() {
  const [trimester, setTrimester] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { login } = useAuth();

  const handleComplete = () => {
    // In a real app, save this data to the backend before logging in
    login();
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

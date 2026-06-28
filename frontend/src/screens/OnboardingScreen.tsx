import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

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
          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>Help us personalize your Bloom experience</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Current Trimester (e.g. 1, 2, or 3)"
              placeholderTextColor={theme.colors.textMedium}
              value={trimester}
              onChangeText={setTrimester}
              keyboardType="number-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Expected Due Date (MM/DD/YYYY)"
              placeholderTextColor={theme.colors.textMedium}
              value={dueDate}
              onChangeText={setDueDate}
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
              <Text style={styles.primaryButtonText}>Complete Setup</Text>
            </TouchableOpacity>
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
    padding: theme.spacing[4],
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
    fontSize: theme.typography.sizes.largeTitle,
    color: theme.colors.textHigh,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMedium,
    marginBottom: theme.spacing[6],
  },
  form: {
    gap: theme.spacing[3],
  },
  input: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textHigh,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  primaryButtonText: {
    fontFamily: theme.typography.families.bodyBold,
    color: '#fff',
    fontSize: theme.typography.sizes.body,
  },
});

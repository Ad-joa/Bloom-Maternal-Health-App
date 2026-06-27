import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { getAdvisory } from '../api/api';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Card } from '../components/Card';

export default function AdvisoryScreen() {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!symptomsInput.trim()) {
      Alert.alert("Input Required", "Please enter your symptoms.");
      return;
    }

    setLoading(true);
    setAdvice(null);
    try {
      const symptomsArray = symptomsInput.split(',').map(s => s.trim()).filter(s => s);
      const response = await getAdvisory(symptomsArray);
      setAdvice(response.advice);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch advisory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="title1" color={theme.colors.primaryDark}>
          Symptom Checker
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
          Enter your symptoms separated by commas (e.g., headache, swollen feet, fever).
        </Typography>
      </View>

      <TextInput
        label="Your Symptoms"
        placeholder="Type your symptoms here..."
        value={symptomsInput}
        onChangeText={setSymptomsInput}
        multiline
        style={styles.textArea}
      />

      <Button 
        title="Get Advice" 
        onPress={handleSubmit} 
        loading={loading} 
        style={styles.button}
      />

      {advice && (
        <Card variant="elevated" style={styles.resultCard}>
          <Typography variant="title3" style={styles.resultTitle}>
            Advisory
          </Typography>
          <Typography variant="body">
            {advice}
          </Typography>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surfaceVariant,
  },
  header: {
    marginBottom: theme.spacing[5],
  },
  subtitle: {
    marginTop: theme.spacing[2],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[5],
  },
  resultCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resultTitle: {
    marginBottom: theme.spacing[2],
  }
});

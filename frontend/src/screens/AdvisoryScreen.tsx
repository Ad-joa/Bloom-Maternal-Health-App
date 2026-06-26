import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { getAdvisory } from '../api/api';

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
      // Split by comma and clean up whitespace
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
      <Text style={styles.title}>Symptom Checker</Text>
      <Text style={styles.subtitle}>Enter your symptoms separated by commas (e.g., headache, swollen feet, fever).</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your symptoms here..."
          value={symptomsInput}
          onChangeText={setSymptomsInput}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Get Advice</Text>
        )}
      </TouchableOpacity>

      {advice && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Advisory:</Text>
          <Text style={styles.resultText}>{advice}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FDFBF7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D47285',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D47285',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#D47285',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  }
});

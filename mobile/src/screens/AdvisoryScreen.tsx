import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

export const AdvisoryScreen = () => {
  const [symptom, setSymptom] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);

  const addSymptom = () => {
    if (symptom) {
      setSymptoms([...symptoms, symptom]);
      setSymptom('');
    }
  };

  const checkAdvisory = async () => {
    try {
      const response = await axios.post('YOUR_BACKEND_URL/api/v1/advisory/check', {
        symptoms: symptoms
      });
      setAdvice(response.data.advice);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Symptom Checker</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter symptom (e.g. headache)"
        value={symptom}
        onChangeText={setSymptom}
      />
      <Button title="Add Symptom" onPress={addSymptom} />
      
      <View style={styles.list}>
        {symptoms.map((s, i) => (
          <Text key={i} style={styles.item}>• {s}</Text>
        ))}
      </View>

      <Button title="Get Medical Advice" onPress={checkAdvisory} color="#E91E63" />

      {advice && (
        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  list: { marginVertical: 20 },
  item: { fontSize: 16 },
  adviceBox: { marginTop: 20, padding: 15, backgroundColor: '#FFF9C4', borderRadius: 8 },
  adviceText: { fontSize: 16, textAlign: 'center' }
});

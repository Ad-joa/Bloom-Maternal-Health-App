import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bloom Maternal Health</Text>
      <Text style={styles.subtitle}>Empowering expectant mothers with knowledge and timely advice.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Pregnancy Journey</Text>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Trimester', { trimesterId: 1 })}>
          <Text style={styles.cardText}>First Trimester (Weeks 1-12)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Trimester', { trimesterId: 2 })}>
          <Text style={styles.cardText}>Second Trimester (Weeks 13-26)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Trimester', { trimesterId: 3 })}>
          <Text style={styles.cardText}>Third Trimester (Weeks 27+)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Advisory</Text>
        <Text style={styles.description}>
          Feeling unwell or experiencing unfamiliar symptoms? Check our smart advisory system for guidance.
        </Text>
        <TouchableOpacity style={[styles.card, styles.primaryCard]} onPress={() => navigation.navigate('Advisory')}>
          <Text style={styles.primaryCardText}>Check Symptoms Now</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D47285',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  primaryCard: {
    backgroundColor: '#D47285',
    alignItems: 'center',
  },
  primaryCardText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

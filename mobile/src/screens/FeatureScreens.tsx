import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

export const OnboardingScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BLOOM</Text>
      <Text style={styles.text}>Your companion for a healthy pregnancy journey in Ghana.</Text>
      {/* Add Button to navigate to Login/Register */}
    </View>
  );
};

export const TrimesterInfoScreen = () => {
    const data = [
        { id: '1', title: 'Nutrition in the 1st Trimester', content: 'Focus on folic acid and hydration.' },
        { id: '2', title: 'Morning Sickness Tips', content: 'Eat small, frequent meals.' },
    ];

    return (
        <FlatList 
            data={data}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }: { item: any }) => (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </View>
            )}
            style={styles.container}
        />
    );
};

export const DangerSignsScreen = () => {
    const signs = [
        "Vaginal bleeding",
        "Severe headache",
        "Blurred vision",
        "Severe abdominal pain",
        "Swelling of hands and face"
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Pregnancy Danger Signs</Text>
            <Text style={styles.warning}>If you experience any of these, PLEASE go to the nearest health facility immediately.</Text>
            {signs.map((sign, index) => (
                <View key={index} style={styles.signItem}>
                    <Text style={styles.signText}>⚠️ {sign}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export const VisitTrackerScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Antenatal Visits</Text>
            <Text>Track your clinical appointments here.</Text>
            {/* List components for visits */}
        </View>
    );
};

export const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>
            <View style={styles.card}>
                <Text>Name: Ama Mensah</Text>
                <Text>LMP: 2024-01-15</Text>
                <Text>Estimated Due Date: 2024-10-22</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32' },
  text: { fontSize: 16, textAlign: 'center' },
  card: { padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  warning: { color: 'red', fontWeight: 'bold', marginBottom: 20 },
  signItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  signText: { fontSize: 16, color: '#333' }
});

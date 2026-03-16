import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export const DashboardScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome back,</Text>
                <Text style={styles.brand}>BLOOM</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Your Progress</Text>
                <Text style={styles.cardBody}>Trimester: 2nd (Week 18)</Text>
                <Text style={styles.cardDetail}>Due Date: August 14, 2024</Text>
            </View>

            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.grid}>
                <TouchableOpacity style={styles.actionCard}><Text>Info Library</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionCard}><Text>Visit Tracker</Text></TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 30, backgroundColor: '#2E7D32' },
    welcome: { color: '#fff', fontSize: 16 },
    brand: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    card: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 12, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    cardBody: { fontSize: 16, color: '#333' },
    cardDetail: { color: '#666', marginTop: 5 },
    sectionTitle: { marginLeft: 20, fontSize: 18, fontWeight: 'bold' },
    grid: { flexDirection: 'row', padding: 10, justifyContent: 'space-around' },
    actionCard: { width: '45%', height: 100, backgroundColor: '#fff', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }
});

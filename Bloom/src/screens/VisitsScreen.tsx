import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import VisitCard from '../components/VisitCard';
import EmptyState from '../components/EmptyState';

const MOCK_VISITS = [
  {
    id: '1',
    date: '2026-02-15',
    notes: 'First prenatal visit. Ultrasound confirmed 8 weeks. Heartbeat strong.',
    nextVisit: '2026-03-15',
  },
  {
    id: '2',
    date: '2026-03-15',
    notes: 'Routine checkup. Blood tests normal. Weight gain on track.',
    nextVisit: '2026-04-12',
  },
];

const VisitsScreen = () => {
  const visits = MOCK_VISITS; // Hardcoded as per requirements

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="My Visits" 
        subtitle="Track your prenatal appointments" 
        rightElement={
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
          </TouchableOpacity>
        }
      />
      
      {visits.length === 0 ? (
        <EmptyState 
          icon="calendar-outline" 
          heading="No visits yet" 
          subtext="Start tracking your journey by adding your first prenatal appointment." 
        />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VisitCard
              date={item.date}
              notes={item.notes}
              nextVisit={item.nextVisit}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100, // For FAB
  },
  addButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.medium,
  },
});

export default VisitsScreen;

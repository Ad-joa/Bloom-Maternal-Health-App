import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import VisitCard from '../components/VisitCard';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

type Visit = {
  id: string;
  date: string;
  notes: string;
  nextVisit?: string;
};

const VisitsScreen = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newVisit, setNewVisit] = useState({ date: '', notes: '', nextVisit: '' });
  const [modalError, setModalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchVisits = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'users', user.uid, 'visits'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedVisits: Visit[] = [];
      querySnapshot.forEach((docSnap: any) => {
        fetchedVisits.push({ id: docSnap.id, ...docSnap.data() } as Visit);
      });
      setVisits(fetchedVisits);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user]);

  const handleAddVisit = async () => {
    if (!newVisit.date || !newVisit.notes) {
      setModalError('Date and Notes are required');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newVisit.date)) {
      setModalError('Date must be in YYYY-MM-DD format');
      return;
    }
    if (newVisit.nextVisit && !/^\d{4}-\d{2}-\d{2}$/.test(newVisit.nextVisit)) {
      setModalError('Next visit date must be in YYYY-MM-DD format');
      return;
    }

    setModalError('');
    setIsSaving(true);
    try {
      if (!user) return;
      const dataToSave: Omit<Visit, 'id'> = {
        date: newVisit.date,
        notes: newVisit.notes,
        ...(newVisit.nextVisit ? { nextVisit: newVisit.nextVisit } : {})
      };

      const docRef = await addDoc(collection(db, 'users', user.uid, 'visits'), {
        ...dataToSave,
        createdAt: new Date().toISOString()
      });

      // Insert new visit at the top of local array
      setVisits([{ id: docRef.id, ...dataToSave } as Visit, ...visits]);
      setModalVisible(false);
      setNewVisit({ date: '', notes: '', nextVisit: '' });
    } catch (error) {
      console.error('Error adding visit:', error);
      setModalError('Failed to save visit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVisit = (id: string) => {
    Alert.alert(
      "Delete Visit",
      "Are you sure you want to delete this prenatal visit record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            try {
              await deleteDoc(doc(db, 'users', user.uid, 'visits', id));
              setVisits(visits.filter(v => v.id !== id));
            } catch (error) {
              console.error('Error deleting visit:', error);
              Alert.alert('Error', 'Failed to delete visit record');
            }
          }
        }
      ]
    );
  };

  const openAddModal = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setNewVisit({ date: `${yyyy}-${mm}-${dd}`, notes: '', nextVisit: '' });
    setModalError('');
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title="My Visits" 
        subtitle="Track your prenatal appointments" 
        rightElement={
          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add-circle" size={32} color={Colors.primary} />
          </TouchableOpacity>
        }
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : visits.length === 0 ? (
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
              onPress={() => handleDeleteVisit(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      {/* Add Visit Premium Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Prenatal Visit</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {modalError ? <Text style={styles.modalErrorText}>{modalError}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visit Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-06-24"
                placeholderTextColor="#999"
                value={newVisit.date}
                onChangeText={(text) => setNewVisit({ ...newVisit, date: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Visit Notes & Medical Feedback</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ultrasound details, prescriptions, weight gain, blood pressure, etc."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={newVisit.notes}
                onChangeText={(text) => setNewVisit({ ...newVisit, notes: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Next Appointment Date (Optional - YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2026-07-24"
                placeholderTextColor="#999"
                value={newVisit.nextVisit}
                onChangeText={(text) => setNewVisit({ ...newVisit, nextVisit: text })}
              />
            </View>

            <View style={styles.modalButtons}>
              <AppButton 
                title="Cancel" 
                variant="outline" 
                onPress={() => setModalVisible(false)} 
                style={styles.modalButton}
              />
              <AppButton 
                title={isSaving ? "Saving..." : "Save Visit"} 
                onPress={handleAddVisit} 
                disabled={isSaving}
                style={styles.modalButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    ...Shadow.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  modalErrorText: {
    color: Colors.error,
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
  },
});

export default VisitsScreen;

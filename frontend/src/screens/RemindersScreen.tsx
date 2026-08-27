import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { scheduleHydrationReminder, scheduleMedicationReminder, registerForPushNotificationsAsync } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { TextInput } from '../components/TextInput';

import { Bell, Droplet, Pill, Clock } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getReminders, createReminder, deleteReminder } from '../api/api';

function parseTimeString(timeStr: string) {
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return { hour: 10, minute: 0 };
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hour < 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;

  return { hour, minute };
}

export default function RemindersScreen() {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Custom Times
  const [hydrationTime, setHydrationTime] = useState('10:00 AM');
  const [medicationTime, setMedicationTime] = useState('08:00 AM');
  const [generalTime, setGeneralTime] = useState('12:00 PM');

  // Modal State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalTime, setModalTime] = useState('');
  
  // Optimistic switch state for instant visual feedback
  const [optimisticSwitches, setOptimisticSwitches] = useState<{ [key: string]: boolean }>({});

  // Derive switch states from backend data
  const hydrationReminder = remindersList.find(r => r.type === 'hydration');
  const medicationReminder = remindersList.find(r => r.type === 'medication');
  const generalReminder = remindersList.find(r => r.type === 'generic');

  const hydrationEnabled = optimisticSwitches.hydration !== undefined ? optimisticSwitches.hydration : !!hydrationReminder?.is_active;
  const medicationEnabled = optimisticSwitches.medication !== undefined ? optimisticSwitches.medication : !!medicationReminder?.is_active;
  const generalEnabled = optimisticSwitches.generic !== undefined ? optimisticSwitches.generic : !!generalReminder?.is_active;

  useEffect(() => {
    const fetchReminders = async () => {
      if (user?.id) {
        const data = await getReminders(user.id);
        setRemindersList(data || []);
      }
      setLoading(false);
    };
    fetchReminders();
  }, [user]);

  const handleToggle = async (type: string, value: boolean, existingReminder: any) => {
    if (!user?.id) return;
    
    // Immediately set optimistic state so switch feels instant
    setOptimisticSwitches(prev => ({ ...prev, [type]: value }));
    
    if (value) {
      // Open modal to pick time instead of creating immediately
      setActiveModal(type);
      if (type === 'hydration') setModalTime(hydrationTime);
      else if (type === 'medication') setModalTime(medicationTime);
      else if (type === 'generic') setModalTime(generalTime);
    } else {
      // Toggle off
      if (existingReminder) {
        setRemindersList(prev => prev.filter(r => r.id !== existingReminder.id));
        try {
          await deleteReminder(user.id, existingReminder.id);
        } catch (e) {
          console.error("Failed to delete reminder:", e);
          // Revert optimistic state on failure
          setRemindersList(prev => [...prev, existingReminder]);
          setOptimisticSwitches(prev => ({ ...prev, [type]: true }));
        }
      }
    }
  };

  const handleModalSave = async () => {
    if (!user?.id || !activeModal) return;
    
    try {
      try { await registerForPushNotificationsAsync(); } catch (e) {}
      
      let title = "";
      const { hour, minute } = parseTimeString(modalTime);

      if (activeModal === 'hydration') {
        title = "Stay Hydrated";
        await scheduleHydrationReminder(hour, minute); 
        setHydrationTime(modalTime);
      } else if (activeModal === 'medication') {
        title = "Prenatal Vitamins";
        await scheduleMedicationReminder(hour, minute);
        setMedicationTime(modalTime);
      } else if (activeModal === 'generic') {
        title = "Daily Check-in";
        setGeneralTime(modalTime);
      }
      
      const newRem = await createReminder(user.id, { title, type: activeModal, time: modalTime });
      setRemindersList(prev => [...prev, newRem]);
      
      // Clean up optimistic state
      setOptimisticSwitches(prev => {
        const next = { ...prev };
        delete next[activeModal];
        return next;
      });
      
    } catch (e) {
      console.error("Failed to setup reminder:", e);
      // Revert optimistic state on failure
      setOptimisticSwitches(prev => ({ ...prev, [activeModal]: false }));
    } finally {
      setActiveModal(null);
    }
  };

  const handleModalCancel = () => {
    if (activeModal) {
      // Revert optimistic toggle if they cancel the setup
      setOptimisticSwitches(prev => ({ ...prev, [activeModal]: false }));
    }
    setActiveModal(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BackgroundMesh />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View  style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.title}>
              Daily Goals
            </Typography>
            <Typography variant="body" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              Custom reminders to keep you on track.
            </Typography>
          </View>

          {/* Hydration Card */}
          <View style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Droplet color="#0284C7" size={24} />
                </View>
                <View style={styles.cardContent}>
                  <Typography variant="title2" color={theme.colors.textHigh} style={styles.cardTitle}>Hydration</Typography>
                </View>
                <Switch 
                  value={hydrationEnabled} 
                  onValueChange={(v) => handleToggle('hydration', v, hydrationReminder)} 
                  trackColor={{ false: 'rgba(0,0,0,0.1)', true: theme.colors.primary }}
                />
              </View>
            </BlurView>
          </View>

          {/* Medication Card */}
          <View style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
                  <Pill color="#BE185D" size={24} />
                </View>
                <View style={styles.cardContent}>
                  <Typography variant="title2" color={theme.colors.textHigh} style={styles.cardTitle}>Vitamins</Typography>
                </View>
                <Switch 
                  value={medicationEnabled} 
                  onValueChange={(v) => handleToggle('medication', v, medicationReminder)} 
                  trackColor={{ false: 'rgba(0,0,0,0.1)', true: theme.colors.primary }}
                />
              </View>
            </BlurView>
          </View>

          {/* General Card */}
          <View style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Bell color="#B45309" size={24} />
                </View>
                <View style={styles.cardContent}>
                  <Typography variant="title2" color={theme.colors.textHigh} style={styles.cardTitle}>Daily Check-in</Typography>
                </View>
                <Switch 
                  value={generalEnabled} 
                  onValueChange={(v) => handleToggle('generic', v, generalReminder)} 
                  trackColor={{ false: 'rgba(0,0,0,0.1)', true: theme.colors.primary }}
                />
              </View>
            </BlurView>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Time Picker Modal */}
      <Modal
        visible={!!activeModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Typography variant="title3" style={{ marginBottom: 16 }}>Set Reminder Time</Typography>
            <View style={styles.modalInputWrapper}>
              <TextInput
                value={modalTime}
                onChangeText={setModalTime}
                style={styles.modalInput}
                placeholder="e.g. 10:00 AM"
                placeholderTextColor={theme.colors.textMedium}
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleModalCancel} style={styles.modalBtn}>
                <Typography variant="body" color={theme.colors.textMedium}>Cancel</Typography>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleModalSave} style={[styles.modalBtn, { backgroundColor: theme.colors.primary }]}>
                <Typography variant="body" color={theme.colors.background}>Save</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: theme.spacing[5] },
  header: { marginBottom: theme.spacing[6] },
  title: { marginBottom: theme.spacing[2], fontFamily: theme.typography.families.headingBold },
  premiumCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  premiumCard: {
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  cardTitle: {
    fontFamily: theme.typography.families.headingBold,
    flexShrink: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 4,
  },
  modalInputWrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  modalInput: {
    fontSize: 18,
    fontFamily: theme.typography.families.headingBold,
    color: theme.colors.textHigh,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  }
});

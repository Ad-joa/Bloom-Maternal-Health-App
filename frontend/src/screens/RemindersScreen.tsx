import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
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

  // Derive switch states from backend data
  const hydrationReminder = remindersList.find(r => r.type === 'hydration');
  const medicationReminder = remindersList.find(r => r.type === 'medication');
  const generalReminder = remindersList.find(r => r.type === 'generic');

  const hydrationEnabled = !!hydrationReminder?.is_active;
  const medicationEnabled = !!medicationReminder?.is_active;
  const generalEnabled = !!generalReminder?.is_active;

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

  const handleToggleHydration = async (value: boolean) => {
    if (!user?.id) return;
    try {
      if (value) {
        // Try push notifications, but proceed even if it fails
        try { await registerForPushNotificationsAsync(); } catch (e) {}
        await scheduleHydrationReminder(parseInt(hydrationTime.split(':')[0]) || 10, 0); 
        const newRem = await createReminder(user.id, { title: "Stay Hydrated", type: "hydration", time: hydrationTime });
        setRemindersList(prev => [...prev, newRem]);
      } else {
        if (hydrationReminder) {
          await deleteReminder(user.id, hydrationReminder.id);
          setRemindersList(prev => prev.filter(r => r.id !== hydrationReminder.id));
        }
      }
    } catch (e) {
      console.error("Failed to toggle hydration reminder:", e);
    }
  };

  const handleToggleMedication = async (value: boolean) => {
    if (!user?.id) return;
    try {
      if (value) {
        try { await registerForPushNotificationsAsync(); } catch (e) {}
        await scheduleMedicationReminder(parseInt(medicationTime.split(':')[0]) || 8, 0);
        const newRem = await createReminder(user.id, { title: "Prenatal Vitamins", type: "medication", time: medicationTime });
        setRemindersList(prev => [...prev, newRem]);
      } else {
        if (medicationReminder) {
          await deleteReminder(user.id, medicationReminder.id);
          setRemindersList(prev => prev.filter(r => r.id !== medicationReminder.id));
        }
      }
    } catch (e) {
      console.error("Failed to toggle medication reminder:", e);
    }
  };

  const handleToggleGeneral = async (value: boolean) => {
    if (!user?.id) return;
    try {
      if (value) {
        const newRem = await createReminder(user.id, { title: "Daily Check-in", type: "generic", time: generalTime });
        setRemindersList(prev => [...prev, newRem]);
      } else {
        if (generalReminder) {
          await deleteReminder(user.id, generalReminder.id);
          setRemindersList(prev => prev.filter(r => r.id !== generalReminder.id));
        }
      }
    } catch (e) {
      console.error("Failed to toggle general reminder:", e);
    }
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
                  <View style={styles.timeInline}>
                    <Clock color={theme.colors.textMedium} size={14} />
                    <TextInput
                      value={hydrationTime}
                      onChangeText={setHydrationTime}
                      style={styles.timeInlineInput}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  </View>
                </View>
                <Switch 
                  value={hydrationEnabled} 
                  onValueChange={handleToggleHydration} 
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
                  <View style={styles.timeInline}>
                    <Clock color={theme.colors.textMedium} size={14} />
                    <TextInput
                      value={medicationTime}
                      onChangeText={setMedicationTime}
                      style={styles.timeInlineInput}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  </View>
                </View>
                <Switch 
                  value={medicationEnabled} 
                  onValueChange={handleToggleMedication} 
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
                  <View style={styles.timeInline}>
                    <Clock color={theme.colors.textMedium} size={14} />
                    <TextInput
                      value={generalTime}
                      onChangeText={setGeneralTime}
                      style={styles.timeInlineInput}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  </View>
                </View>
                <Switch 
                  value={generalEnabled} 
                  onValueChange={handleToggleGeneral} 
                  trackColor={{ false: 'rgba(0,0,0,0.1)', true: theme.colors.primary }}
                />
              </View>
            </BlurView>
          </View>

        </ScrollView>
      </SafeAreaView>
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
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 4,
  },
  timeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeInlineInput: {
    fontSize: 14,
    fontFamily: theme.typography.families.headingSemibold,
    color: theme.colors.textMedium,
    minWidth: 80,
    paddingVertical: 0,
    marginTop: 2,
  }
});

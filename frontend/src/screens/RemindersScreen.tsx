import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useTheme } from '../theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { scheduleHydrationReminder, scheduleMedicationReminder, registerForPushNotificationsAsync } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

import { Bell, Droplet, Pill } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getReminders, createReminder, deleteReminder } from '../api/api';

export default function RemindersScreen() {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    
    if (value) {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        await scheduleHydrationReminder(10, 0); // Local notification
        const newRem = await createReminder(user.id, { title: "Stay Hydrated", type: "hydration", time: "10:00" });
        setRemindersList(prev => [...prev, newRem]);
      }
    } else {
      if (hydrationReminder) {
        await deleteReminder(user.id, hydrationReminder.id);
        setRemindersList(prev => prev.filter(r => r.id !== hydrationReminder.id));
      }
    }
  };

  const handleToggleMedication = async (value: boolean) => {
    if (!user?.id) return;
    
    if (value) {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        await scheduleMedicationReminder(8, 0);
        const newRem = await createReminder(user.id, { title: "Prenatal Vitamins", type: "medication", time: "08:00" });
        setRemindersList(prev => [...prev, newRem]);
      }
    } else {
      if (medicationReminder) {
        await deleteReminder(user.id, medicationReminder.id);
        setRemindersList(prev => prev.filter(r => r.id !== medicationReminder.id));
      }
    }
  };

  const handleToggleGeneral = async (value: boolean) => {
    if (!user?.id) return;
    if (value) {
      const newRem = await createReminder(user.id, { title: "Daily Check-in", type: "generic", time: "12:00" });
      setRemindersList(prev => [...prev, newRem]);
    } else {
      if (generalReminder) {
        await deleteReminder(user.id, generalReminder.id);
        setRemindersList(prev => prev.filter(r => r.id !== generalReminder.id));
      }
    }
  };

  return (
    <LinearGradient colors={[theme.colors.background, theme.colors.surfaceVariant, theme.colors.primaryLight]} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View  style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.title}>
              Reminders
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium}>
              Manage your daily health alerts.
            </Typography>
          </View>

          <View >
            <Card style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Droplet color="#0284C7" size={24} />
                </View>
                <View style={styles.reminderText}>
                  <Typography variant="headline" color={theme.colors.textHigh}>Stay Hydrated</Typography>
                  <Typography variant="caption1" color={theme.colors.textMedium}>Daily at 10:00 AM</Typography>
                </View>
              </View>
              <Switch 
                value={hydrationEnabled} 
                onValueChange={handleToggleHydration} 
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </Card>
          </View>

          <View >
            <Card style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <View style={[styles.iconBox, { backgroundColor: '#FCE7F3' }]}>
                  <Pill color="#BE185D" size={24} />
                </View>
                <View style={styles.reminderText}>
                  <Typography variant="headline" color={theme.colors.textHigh}>Prenatal Vitamins</Typography>
                  <Typography variant="caption1" color={theme.colors.textMedium}>Daily at 8:00 AM</Typography>
                </View>
              </View>
              <Switch 
                value={medicationEnabled} 
                onValueChange={handleToggleMedication}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </Card>
          </View>

          <View >
            <Card style={styles.reminderCard}>
              <View style={styles.reminderInfo}>
                <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Bell color="#B45309" size={24} />
                </View>
                <View style={styles.reminderText}>
                  <Typography variant="headline" color={theme.colors.textHigh}>Daily Check-in</Typography>
                  <Typography variant="caption1" color={theme.colors.textMedium}>Log your symptoms</Typography>
                </View>
              </View>
              <Switch 
                value={generalEnabled} 
                onValueChange={handleToggleGeneral}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </Card>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: theme.spacing[5] },
  header: { marginBottom: theme.spacing[6] },
  title: { marginBottom: theme.spacing[2] },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  reminderText: {
    justifyContent: 'center',
  }
});

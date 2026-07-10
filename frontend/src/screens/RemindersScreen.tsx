import React, { useState } from 'react';
import { , Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { theme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { scheduleHydrationReminder, scheduleMedicationReminder, registerForPushNotificationsAsync } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

import { Bell, Droplet, Pill } from 'lucide-react-native';

export default function RemindersScreen() {
  const [hydrationEnabled, setHydrationEnabled] = useState(false);
  const [medicationEnabled, setMedicationEnabled] = useState(false);
  const [generalEnabled, setGeneralEnabled] = useState(false);

  const handleToggleHydration = async (value: boolean) => {
    setHydrationEnabled(value);
    if (value) {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        // Schedule for 10:00 AM as default
        await scheduleHydrationReminder(10, 0);
      } else {
        setHydrationEnabled(false);
      }
    } else {
      // In a real app we would cancel specifically this one, 
      // but for demo we will just clear all or keep it simple.
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const handleToggleMedication = async (value: boolean) => {
    setMedicationEnabled(value);
    if (value) {
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        // Schedule for 8:00 AM
        await scheduleMedicationReminder(8, 0);
      } else {
        setMedicationEnabled(false);
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
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
                onValueChange={setGeneralEnabled}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </Card>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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

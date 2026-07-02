import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Settings, Bell, CircleHelp, LogOut, ChevronRight } from 'lucide-react-native';
import { scheduleDailyReminder } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      await scheduleDailyReminder();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const menuItems = [
    { title: 'Personal Information', icon: <Settings size={20} color={theme.colors.textMedium} /> },
    { 
      title: 'Daily Reminders', 
      icon: <Bell size={20} color={theme.colors.textMedium} />,
      isToggle: true
    },
    { title: 'Help & Support', icon: <CircleHelp size={20} color={theme.colors.textMedium} /> },
  ];

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>
            {user?.name ? user.name[0].toUpperCase() : 'B'}
          </Typography>
        </View>
        <Typography variant="title2" style={styles.name}>{user?.name || 'Bloom User'}</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>{user?.email || 'user@example.com'}</Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          ACCOUNT
        </Typography>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder
              ]}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Typography variant="body" style={styles.menuItemText}>{item.title}</Typography>
              </View>
              {item.isToggle ? (
                <Switch 
                  value={notificationsEnabled} 
                  onValueChange={toggleNotifications}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              ) : (
                <ChevronRight size={20} color={theme.colors.textMedium} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Card style={styles.logoutCard}>
          <LogOut size={20} color={theme.colors.danger} />
          <Typography variant="body" color={theme.colors.danger} style={styles.logoutText}>
            Log Out
          </Typography>
        </Card>
      </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[5],
    paddingBottom: theme.spacing[8],
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing[8],
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[4],
  },
  name: {
    marginBottom: theme.spacing[1],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionLabel: {
    marginBottom: theme.spacing[2],
    marginLeft: theme.spacing[2],
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  menuItemText: {
    marginTop: 2, // optical alignment
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: theme.spacing[8],
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    padding: theme.spacing[4],
  },
  logoutText: {
    fontFamily: theme.typography.families.bodySemibold,
  }
});

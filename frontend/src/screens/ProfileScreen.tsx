import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Platform, FlatList, KeyboardAvoidingView, Switch, UIManager, LayoutAnimation, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { scheduleDailyReminder } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const bioEnabled = await AsyncStorage.getItem('@app_biometrics_enabled');
      if (bioEnabled === 'true') setBiometricsEnabled(true);
    };
    loadSettings();
  }, []);


  const toggleBiometrics = async (value: boolean) => {
    setBiometricsEnabled(value);
    await AsyncStorage.setItem('@app_biometrics_enabled', value ? 'true' : 'false');
  };

  const handleExportPDF = async () => {
    try {
      const html = `
        <html>
        <body style="font-family: Helvetica, sans-serif; padding: 40px; color: #333;">
            <h1 style="color: ${theme.colors.primaryDark}; border-bottom: 2px solid ${theme.colors.primaryLight}; padding-bottom: 10px;">Bloom Medical Report</h1>
            <div style="margin-bottom: 30px;">
              <p><strong>Patient:</strong> ${user?.name || 'Unknown'}</p>
              <p><strong>Due Date:</strong> ${user?.due_date ? new Date(user.due_date).toLocaleDateString() : 'Not Set'}</p>
              <p style="font-size: 16px; color: #666;">Report generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <h2 style="margin-top: 40px; color: #444;">Recent Vitals</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background-color: ${theme.colors.surfaceVariant};">
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};"><strong>Weight</strong></td>
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};">145 lbs</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};"><strong>Blood Pressure</strong></td>
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};">120/80</td>
              </tr>
            </table>

            <h2 style="color: #444;">Recent Symptoms</h2>
            <p style="font-size: 16px; line-height: 1.5; padding: 15px; background-color: ${theme.colors.background}; border: 1px solid ${theme.colors.primaryLight}; border-radius: 8px;">
              Patient reported mild nausea in the mornings, well-managed with ginger tea. No severe headaches or blurred vision.
            </p>
            
            <p style="margin-top: 50px; font-style: italic; color: #888; font-size: 12px; text-align: center;">
              Generated securely by Bloom Maternal Health App
            </p>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      console.error("Error generating PDF:", e);
    }
  };

  const menuItems = [
    { title: 'Personal Information', icon: <Ionicons name="settings-sharp" size={20} color={theme.colors.textMedium} />, route: 'Profile' },
    { title: 'ANC Visits', icon: <Ionicons name="calendar" size={20} color={theme.colors.textMedium} />, route: 'ANCVisit' },
    { title: 'Partner Mode', icon: <Ionicons name="people" size={20} color={theme.colors.textMedium} />, route: 'PartnerMode' },
    { 
      title: 'Daily Reminders', 
      icon: <Ionicons name="notifications" size={20} color={theme.colors.textMedium} />,
      isToggle: false,
      onPress: () => navigation.navigate('Reminders')
    },
    { 
      title: 'App Lock (FaceID/TouchID)', 
      icon: <Ionicons name="lock-closed" size={20} color={theme.colors.textMedium} />,
      isToggle: true,
      value: biometricsEnabled,
      onToggle: toggleBiometrics
    },
    { title: 'Help & Support', icon: <Ionicons name="help-circle" size={20} color={theme.colors.textMedium} />, route: 'Profile' },
  ];

  return (
    <View style={styles.container}>

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>
            Profile
          </Typography>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <View style={styles.profileHeader}>
        <BlurView intensity={80} tint="light" style={styles.avatarLarge}>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>
            {user?.name ? user.name[0].toUpperCase() : 'B'}
          </Typography>
        </BlurView>
        <Typography variant="title2" style={styles.name}>{user?.name || 'Bloom User'}</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>{user?.email || 'user@example.com'}</Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          PREGNANCY DETAILS
        </Typography>
        <Card variant="glass" style={styles.menuCard}>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="flag" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Primary Goal</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.primary_goal || 'Not set'}</Typography>
          </View>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Due Date</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.due_date ? new Date(user.due_date).toLocaleDateString() : 'Not set'}</Typography>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Trimester</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.trimester ? `Trimester ${user.trimester}` : 'Not set'}</Typography>
          </View>
          <View style={[styles.menuItem, styles.menuItemBorder, { borderTopWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="water" size={20} color={theme.colors.danger} />
              <Typography variant="body" style={styles.menuItemText}>Last Period (LMP)</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.last_period_date ? new Date(user.last_period_date).toLocaleDateString() : 'Not set'}</Typography>
          </View>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="medkit" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Blood Group</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.blood_group || 'Not set'}</Typography>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="body" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Height</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.height || 'Not set'}</Typography>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          HEALTH & LIFESTYLE
        </Typography>
        <Card variant="glass" style={styles.menuCard}>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="nutrition" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Dietary Preferences</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.dietary_preferences || 'None'}</Typography>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="medical" size={20} color={theme.colors.primary} />
              <Typography variant="body" style={styles.menuItemText}>Medical Conditions</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.medical_conditions || 'None'}</Typography>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          EMERGENCY CONTACT
        </Typography>
        <Card variant="glass" style={styles.menuCard}>
          <View style={[styles.menuItem, styles.menuItemBorder]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person" size={20} color={theme.colors.danger} />
              <Typography variant="body" style={styles.menuItemText}>Name</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.emergency_contact_name || 'Not set'}</Typography>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="call" size={20} color={theme.colors.danger} />
              <Typography variant="body" style={styles.menuItemText}>Phone</Typography>
            </View>
            <Typography variant="body" color={theme.colors.textMedium}>{user?.emergency_contact_phone || 'Not set'}</Typography>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          ACCOUNT
        </Typography>

        <Card variant="glass" style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder
              ]}
              onPress={item.onPress || (item.route ? () => item.route !== 'Profile' ? navigation.navigate(item.route) : null : undefined)}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Typography variant="body" style={styles.menuItemText}>{item.title}</Typography>
              </View>
              {item.isToggle ? (
                <Switch 
                  value={item.value} 
                  onValueChange={item.onToggle}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMedium} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          MEDICAL
        </Typography>
        <Card variant="glass" style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleExportPDF}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text" size={20} color={theme.colors.primaryDark} />
              <Typography variant="body" color={theme.colors.primaryDark} style={styles.menuItemText}>
                Export Medical Report (PDF)
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primaryDark} />
          </TouchableOpacity>
        </Card>
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Card variant="glass" style={styles.logoutCard}>
          <Ionicons name="log-out" size={20} color={theme.colors.danger} />
          <Typography variant="body" color={theme.colors.danger} style={styles.logoutText}>
            Log Out
          </Typography>
        </Card>
      </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    padding: theme.spacing[5],
    paddingBottom: 120, // Space for floating tab bar
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing[8],
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
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
    backgroundColor: 'transparent',
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

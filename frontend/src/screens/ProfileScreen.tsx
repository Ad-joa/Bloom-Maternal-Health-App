import React, { useState, useEffect } from 'react';
import { , Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { Settings, Bell, CircleHelp, LogOut, ChevronRight, Lock, FileText } from 'lucide-react-native';
import { scheduleDailyReminder } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
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
            <h1 style="color: #FF6B8B; border-bottom: 2px solid #fce7eb; padding-bottom: 10px;">Bloom Medical Report</h1>
            <p style="font-size: 18px;"><strong>Patient Name:</strong> ${user?.name || 'N/A'}</p>
            <p style="font-size: 18px;"><strong>Email:</strong> ${user?.email || 'N/A'}</p>
            <p style="font-size: 16px; color: #666;">Report generated on ${new Date().toLocaleDateString()}</p>
            
            <h2 style="margin-top: 40px; color: #444;">Recent Vitals</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #fdf2f4;">
                <td style="padding: 10px; border: 1px solid #fce7eb;"><strong>Weight</strong></td>
                <td style="padding: 10px; border: 1px solid #fce7eb;">145 lbs</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #fce7eb;"><strong>Blood Pressure</strong></td>
                <td style="padding: 10px; border: 1px solid #fce7eb;">120/80</td>
              </tr>
            </table>

            <h2 style="color: #444;">Recent Symptoms</h2>
            <p style="font-size: 16px; line-height: 1.5; padding: 15px; background-color: #fdf2f4; border-radius: 8px;">
              Fatigue, Nausea, Back Pain
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
    { title: 'Personal Information', icon: <Settings size={20} color={theme.colors.textMedium} />, isToggle: false },
    { 
      title: 'Daily Reminders', 
      icon: <Bell size={20} color={theme.colors.textMedium} />,
      isToggle: false,
      onPress: () => navigation.navigate('Reminders')
    },
    { 
      title: 'App Lock (FaceID/TouchID)', 
      icon: <Lock size={20} color={theme.colors.textMedium} />,
      isToggle: true,
      value: biometricsEnabled,
      onToggle: toggleBiometrics
    },
    { title: 'Help & Support', icon: <CircleHelp size={20} color={theme.colors.textMedium} />, isToggle: false },
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
              onPress={item.onPress}
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
                <ChevronRight size={20} color={theme.colors.textMedium} />
              )}
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      <View style={styles.section}>
        <Typography variant="subhead" color={theme.colors.textMedium} style={styles.sectionLabel}>
          MEDICAL
        </Typography>
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleExportPDF}>
            <View style={styles.menuItemLeft}>
              <FileText size={20} color={theme.colors.primaryDark} />
              <Typography variant="body" color={theme.colors.primaryDark} style={styles.menuItemText}>
                Export Medical Report (PDF)
              </Typography>
            </View>
            <ChevronRight size={20} color={theme.colors.primaryDark} />
          </TouchableOpacity>
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

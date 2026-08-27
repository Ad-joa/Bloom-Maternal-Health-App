import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getSymptomLogs, deleteAccount, updateUserProfile } from '../api/api';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateUser } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme, isDark);
  const { i18n } = useTranslation();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    due_date: user?.due_date || '',
    trimester: user?.trimester?.toString() || '',
    last_period_date: user?.last_period_date || '',
    blood_group: user?.blood_group || '',
    height: user?.height || '',
    dietary_preferences: user?.dietary_preferences || '',
    medical_conditions: user?.medical_conditions || '',
    emergency_contact_name: user?.emergency_contact_name || '',
    emergency_contact_phone: user?.emergency_contact_phone || ''
  });

  const handleSave = async () => {
    try {
      if (!user?.id) return;
      const updatedUser = await updateUserProfile(user.id, {
        ...editForm,
        trimester: editForm.trimester ? parseInt(editForm.trimester) : undefined
      });
      await updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone and all your health data will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Permanently", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              logout();
            } catch (e) {
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleExportPDF = async () => {
    try {
      let latestWeight = 'Not Recorded';
      let latestBP = 'Not Recorded';
      let recentSymptoms = 'No symptoms recorded recently.';

      if (user?.id) {
        const logs = await getSymptomLogs(user.id);
        if (logs && logs.length > 0) {
          const logWithWeight = logs.find((l: any) => l.weight);
          if (logWithWeight) latestWeight = `${logWithWeight.weight} kg`;
          
          const logWithBP = logs.find((l: any) => l.blood_pressure);
          if (logWithBP) latestBP = logWithBP.blood_pressure;

          const recentLogs = logs.slice(0, 3);
          recentSymptoms = recentLogs.map((l: any) => {
            const date = new Date(l.created_at).toLocaleDateString();
            return `<b>${date}:</b> ${l.severity ? l.severity.toUpperCase() : ''} - ${l.symptoms || 'None'} ${l.notes ? `(Note: ${l.notes})` : ''}`;
          }).join('<br><br>');
        }
      }

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
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};">${latestWeight}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};"><strong>Blood Pressure</strong></td>
                <td style="padding: 10px; border: 1px solid ${theme.colors.primaryLight};">${latestBP}</td>
              </tr>
            </table>
            <h2 style="color: #444;">Recent Symptoms & Notes</h2>
            <p style="font-size: 14px; line-height: 1.5; padding: 15px; background-color: ${theme.colors.background}; border: 1px solid ${theme.colors.primaryLight}; border-radius: 8px;">
              ${recentSymptoms}
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
      console.error('Error generating PDF:', e);
    }
  };

  const menuItems = [
    { title: 'ANC Visits', icon: 'calendar', route: 'ANCVisit' },
    { title: 'Partner Mode', icon: 'people', route: 'PartnerMode' },
    { title: 'Daily Reminders', icon: 'notifications', onPress: () => navigation.navigate('Reminders') },
    {
      title: 'App Lock (FaceID/TouchID)',
      icon: 'lock-closed',
      isToggle: true,
      value: biometricsEnabled,
      onToggle: toggleBiometrics,
    },
    { title: 'Help & Support', icon: 'help-circle', onPress: () => navigation.navigate('HelpSupport') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <BackgroundMesh />
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Typography variant="largeTitle" style={styles.headerTitle}>Profile</Typography>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.themeToggle} onPress={() => {
                  setEditForm({
                    name: user?.name || '', due_date: user?.due_date || '', trimester: user?.trimester?.toString() || '',
                    last_period_date: user?.last_period_date || '', blood_group: user?.blood_group || '', height: user?.height || '',
                    dietary_preferences: user?.dietary_preferences || '', medical_conditions: user?.medical_conditions || '',
                    emergency_contact_name: user?.emergency_contact_name || '', emergency_contact_phone: user?.emergency_contact_phone || ''
                  });
                  setIsEditing(false);
                }}>
                  <Ionicons name="close" size={22} color={theme.colors.danger} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.colors.primaryDark, borderColor: theme.colors.primaryDark }]} onPress={handleSave}>
                  <Ionicons name="checkmark" size={22} color={theme.colors.background} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.themeToggle} onPress={() => setIsEditing(true)}>
                  <Ionicons name="pencil" size={20} color={theme.colors.primaryDark} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                  <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={theme.colors.primaryDark} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Avatar & Name */}
          <View style={styles.section}>
            <View style={[styles.menuCard, { alignItems: 'center', paddingVertical: 24, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.avatarLarge}>
                <Typography variant="largeTitle" style={{ color: theme.colors.background, fontFamily: theme.typography.families.headingBold }}>
                  {user?.name ? user.name[0].toUpperCase() : 'B'}
                </Typography>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.inputInline, { fontSize: 22, fontFamily: theme.typography.families.headingBold, textAlign: 'center', marginBottom: 4 }]}
                  value={editForm.name}
                  onChangeText={(val) => setEditForm({ ...editForm, name: val })}
                  placeholder="Your Name"
                  placeholderTextColor={theme.colors.textMedium}
                />
              ) : (
                <Typography variant="title2" style={styles.name}>{user?.name || 'Bloom User'}</Typography>
              )}
              <Typography variant="body" style={styles.email}>{user?.email || 'user@example.com'}</Typography>
            </View>
          </View>

          {/* Language */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>LANGUAGE</Typography>
            <View style={[styles.menuCard, { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="language" size={20} color={theme.colors.primaryDark} />
                  <Typography variant="body" style={styles.menuItemText}>App Language</Typography>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['en', 'twi', 'ga', 'ewe'].map(lang => (
                    <TouchableOpacity key={lang} onPress={() => changeLanguage(lang)} style={{ padding: 4 }}>
                      <Typography
                        variant="subhead"
                        style={[styles.langChip, selectedLang === lang && styles.langChipActive]}
                      >
                        {lang.toUpperCase()}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Pregnancy Details */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>PREGNANCY DETAILS</Typography>
            <View style={[styles.menuCard, { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              {[
                { icon: 'calendar', label: 'Due Date', value: user?.due_date ? new Date(user.due_date).toLocaleDateString() : 'Not set', field: 'due_date' },
                { icon: 'time', label: 'Trimester', value: user?.trimester ? `Trimester ${user.trimester}` : 'Not set', field: 'trimester' },
                { icon: 'water', label: 'Last Period', value: user?.last_period_date ? new Date(user.last_period_date).toLocaleDateString() : 'Not set', field: 'last_period_date', danger: true },
                { icon: 'medkit', label: 'Blood Group', value: user?.blood_group || 'Not set', field: 'blood_group' },
                { icon: 'body', label: 'Height', value: user?.height || 'Not set', field: 'height' },
              ].map((row, i, arr) => (
                <View key={row.label} style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={row.icon as any} size={20} color={row.danger ? theme.colors.danger : theme.colors.primaryDark} />
                    <Typography variant="body" style={styles.menuItemText}>{row.label}</Typography>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputInline}
                      value={(editForm as any)[row.field]}
                      onChangeText={(val) => setEditForm({ ...editForm, [row.field]: val })}
                      placeholder={row.label}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  ) : (
                    <Typography variant="body" style={styles.menuItemValue}>{row.value}</Typography>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Health & Lifestyle */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>HEALTH & LIFESTYLE</Typography>
            <View style={[styles.menuCard, { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              {[
                { icon: 'nutrition', label: 'Dietary Prefs', value: user?.dietary_preferences || 'None', field: 'dietary_preferences' },
                { icon: 'medical', label: 'Conditions', value: user?.medical_conditions || 'None', field: 'medical_conditions' },
              ].map((row, i, arr) => (
                <View key={row.label} style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={row.icon as any} size={20} color={theme.colors.primaryDark} />
                    <Typography variant="body" style={styles.menuItemText}>{row.label}</Typography>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputInline}
                      value={(editForm as any)[row.field]}
                      onChangeText={(val) => setEditForm({ ...editForm, [row.field]: val })}
                      placeholder={row.label}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  ) : (
                    <Typography variant="body" style={styles.menuItemValue}>{row.value}</Typography>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>EMERGENCY CONTACT</Typography>
            <View style={[styles.menuCard, { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              {[
                { icon: 'person', label: 'Name', value: user?.emergency_contact_name || 'Not set', field: 'emergency_contact_name' },
                { icon: 'call', label: 'Phone', value: user?.emergency_contact_phone || 'Not set', field: 'emergency_contact_phone' },
              ].map((row, i, arr) => (
                <View key={row.label} style={[styles.menuItem, i < arr.length - 1 && styles.menuItemBorder]}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={row.icon as any} size={20} color={theme.colors.danger} />
                    <Typography variant="body" style={styles.menuItemText}>{row.label}</Typography>
                  </View>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputInline}
                      value={(editForm as any)[row.field]}
                      onChangeText={(val) => setEditForm({ ...editForm, [row.field]: val })}
                      placeholder={row.label}
                      placeholderTextColor={theme.colors.textMedium}
                    />
                  ) : (
                    <Typography variant="body" style={styles.menuItemValue}>{row.value}</Typography>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>ACCOUNT</Typography>
            <View style={[styles.menuCard, { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)' }]}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.title}
                  style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
                  onPress={item.onPress || (item.route ? () => navigation.navigate(item.route!) : undefined)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={item.icon as any} size={20} color={theme.colors.textMedium} />
                    <Typography variant="body" style={styles.menuItemText}>{item.title}</Typography>
                  </View>
                  {item.isToggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primaryDark }}
                      thumbColor="#fff"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textMedium} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Medical Export */}
          <View style={styles.section}>
            <Typography variant="caption1" style={styles.sectionLabel}>MEDICAL</Typography>
            <View style={styles.menuCard}>
              <TouchableOpacity style={styles.menuItem} onPress={handleExportPDF} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="document-text" size={20} color={theme.colors.primaryDark} />
                  <Typography variant="body" style={[styles.menuItemText, { color: theme.colors.primaryDark }]}>
                    Export Medical Report (PDF)
                  </Typography>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.8}>
            <View style={styles.logoutCard}>
              <Ionicons name="log-out" size={20} color={theme.colors.danger} />
              <Typography variant="body" style={styles.logoutText}>Log Out</Typography>
            </View>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity onPress={handleDeleteAccount} style={[styles.logoutButton, { marginTop: 12 }]} activeOpacity={0.8}>
            <View style={[styles.logoutCard, { borderColor: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.05)' }]}>
              <Ionicons name="trash" size={20} color="#FF3B30" />
              <Typography variant="body" style={[styles.logoutText, { color: '#FF3B30' }]}>Delete Account</Typography>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 40,
    lineHeight: 44,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    letterSpacing: -1,
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  name: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 4,
  },
  email: {
    color: theme.colors.textMedium,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.headingBold,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'transparent',
    minHeight: 52,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyMedium,
  },
  menuItemValue: {
    color: theme.colors.textMedium,
    maxWidth: 140,
    textAlign: 'right',
  },
  langChip: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.headingSemibold,
    fontSize: 11,
  },
  langChipActive: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
  },
  logoutButton: {
    marginBottom: 16,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: isDark ? 'rgba(255,59,48,0.12)' : '#FFF1F0',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,59,48,0.2)' : '#FECACA',
  },
  logoutText: {
    color: theme.colors.danger,
    fontFamily: theme.typography.families.headingBold,
  },
  inputInline: {
    flex: 1,
    textAlign: 'right',
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyMedium,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
    paddingVertical: 4,
    marginLeft: 16,
  }
});

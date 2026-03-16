import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = () => {
  const { logout } = useAuth();
  
  // Hardcoded user details as per requirements
  const user = {
    name: 'Sarah Doe',
    email: 'sarah.doe@example.com',
    phone: '+1 234 567 8900',
    lmp: '2025-09-20',
    dueDate: '2026-06-27',
    trimester: 'Second',
  };

  const menuItems = [
    { label: 'My Health Record', icon: 'medical-outline' },
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Settings', icon: 'settings-outline' },
    { label: 'Privacy Policy', icon: 'shield-checkmark-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="My Profile" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>S</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{user.dueDate}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Trimester</Text>
            <Text style={styles.infoValue}>{user.trimester}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pregnancy Details</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>LMP Date</Text>
              <Text style={styles.detailValue}>{user.lmp}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={22} color={Colors.textLight} />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        <AppButton 
          title="Logout" 
          onPress={logout} 
          variant="outline" 
          style={styles.logoutButton} 
        />
        
        <Text style={styles.versionText}>Bloom Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarInitial: {
    ...Typography.h1,
    color: Colors.primary,
    fontSize: 40,
  },
  userName: {
    ...Typography.h2,
    color: Colors.text,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textLight,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 16,
    marginHorizontal: 6,
    ...Shadow.soft,
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontSize: 18,
  },
  detailsList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    ...Shadow.soft,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textLight,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...Typography.body,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.border,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default ProfileScreen;

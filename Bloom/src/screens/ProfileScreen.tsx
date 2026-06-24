import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../hooks/useAuth';
import { calculatePregnancyDetails } from '../utils/pregnancyCalculator';

const ProfileScreen = () => {
  const { logout, profile } = useAuth();
  
  const pregnancyDetails = profile?.lmpDate ? calculatePregnancyDetails(profile.lmpDate) : null;

  const user = {
    name: profile?.name || 'Mama',
    email: profile?.email || '',
    phone: profile?.phone || 'Not set',
    lmp: profile?.lmpDate || 'Not set',
    dueDate: pregnancyDetails?.dueDate || 'Not calculated',
    trimester: pregnancyDetails?.trimesterLabel || 'First Trimester',
  };

  const initial = user.name.charAt(0).toUpperCase();

  const menuItems = [
    { label: 'My Health Record', icon: 'medical', color: Colors.primary },
    { label: 'Notifications', icon: 'notifications', color: Colors.brandOrange },
    { label: 'Settings', icon: 'settings', color: Colors.textLight },
    { label: 'Privacy Policy', icon: 'shield-checkmark', color: Colors.success },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Profile" largeTitle={true} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Pregnancy Details Group */}
        <Text style={styles.groupTitle}>Pregnancy Details</Text>
        <View style={styles.listGroup}>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Estimated Due Date</Text>
            <Text style={styles.listValue}>{user.dueDate}</Text>
          </View>
          <View style={[styles.listItem, styles.lastListItem]}>
            <Text style={styles.listLabel}>Current Trimester</Text>
            <Text style={[styles.listValue, { color: Colors.brandOrange }]}>{user.trimester}</Text>
          </View>
        </View>

        {/* Account Settings Group */}
        <Text style={styles.groupTitle}>Account</Text>
        <View style={styles.listGroup}>
          <View style={styles.listItem}>
            <Text style={styles.listLabel}>Phone Number</Text>
            <Text style={styles.listValue}>{user.phone}</Text>
          </View>
          <View style={[styles.listItem, styles.lastListItem]}>
            <Text style={styles.listLabel}>LMP Date</Text>
            <Text style={styles.listValue}>{user.lmp}</Text>
          </View>
        </View>

        {/* Preferences Group */}
        <Text style={styles.groupTitle}>Preferences</Text>
        <View style={styles.listGroup}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, isLast && styles.lastListItem]}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.border} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Group */}
        <View style={[styles.listGroup, styles.actionGroup]}>
          <TouchableOpacity 
            style={[styles.menuItem, styles.lastListItem]} 
            onPress={logout}
            activeOpacity={0.6}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Bloom Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfbfb',
  },
  scrollContent: {
    paddingBottom: 120, // Space for tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.soft,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  headerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  userName: {
    ...Typography.h2,
    color: Colors.text,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textLight,
    marginTop: 2,
  },
  groupTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    color: Colors.textLight,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: Spacing.lg + 16,
    marginBottom: 8,
  },
  listGroup: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Shadow.soft,
    shadowOpacity: 0.03, // Extra subtle for Apple feel
  },
  actionGroup: {
    marginTop: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  listLabel: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  listValue: {
    ...Typography.body,
    color: Colors.textLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '500',
    marginLeft: Spacing.md,
  },
  logoutText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  versionText: {
    ...Typography.caption,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
    opacity: 0.6,
  },
});

export default ProfileScreen;

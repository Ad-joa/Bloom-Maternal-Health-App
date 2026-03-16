import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';

interface VisitCardProps {
  date: string;
  notes: string;
  nextVisit?: string;
  onPress?: () => void;
}

const VisitCard: React.FC<VisitCardProps> = ({ 
  date, 
  notes, 
  nextVisit, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      </View>
      
      <Text style={styles.notes} numberOfLines={2}>{notes}</Text>
      
      {nextVisit && (
        <View style={styles.footer}>
          <Text style={styles.nextVisitLabel}>Next Visit:</Text>
          <Text style={styles.nextVisitDate}>{nextVisit}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.soft,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  notes: {
    ...Typography.body,
    color: Colors.textLight,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.surface,
  },
  nextVisitLabel: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  nextVisitDate: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
});

export default VisitCard;

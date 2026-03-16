import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';
import ScreenHeader from '../components/ScreenHeader';
import RiskBadge from '../components/RiskBadge';
import { DangerSigns } from '../constants/dangerSigns';

const DangerSignsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Danger Signs" subtitle="Symptoms requiring immediate action" showBack />
      
      <FlatList
        data={DangerSigns}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <RiskBadge level={item.severity as any} />
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.actionBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.high} />
              <Text style={styles.actionText}>{item.action}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.soft,
    borderWidth: 1,
    borderColor: Colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  description: {
    ...Typography.body,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  actionBox: {
    flexDirection: 'row',
    backgroundColor: Colors.high + '10',
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.high,
    marginLeft: Spacing.sm,
    fontSize: 14,
    flex: 1,
  },
});

export default DangerSignsScreen;

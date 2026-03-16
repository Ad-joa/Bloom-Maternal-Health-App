import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

type RiskLevel = 'Low' | 'Medium' | 'High';

interface RiskBadgeProps {
  level: RiskLevel;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const getStyle = () => {
    switch (level) {
      case 'Low': return Colors.low;
      case 'Medium': return Colors.medium;
      case 'High': return Colors.high;
      default: return Colors.border;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStyle() }]}>
      <Text style={styles.text}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
});

export default RiskBadge;

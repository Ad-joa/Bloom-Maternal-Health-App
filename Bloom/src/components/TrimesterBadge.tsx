import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface TrimesterBadgeProps {
  trimester: 1 | 2 | 3;
}

const TrimesterBadge: React.FC<TrimesterBadgeProps> = ({ trimester }) => {
  const getStyle = () => {
    switch (trimester) {
      case 1: return { bg: Colors.t1, text: 'T1' };
      case 2: return { bg: Colors.t2, text: 'T2' };
      case 3: return { bg: Colors.t3, text: 'T3' };
      default: return { bg: Colors.border, text: '?' };
    }
  };

  const { bg, text } = getStyle();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
  },
});

export default TrimesterBadge;

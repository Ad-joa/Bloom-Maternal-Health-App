import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, Shadow } from '../constants/theme';

interface ContentCardProps {
  title: string;
  category: string;
  preview: string;
  onPress?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  category, 
  preview, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.preview} numberOfLines={2}>{preview}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.soft,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  categoryBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    fontSize: 18,
    marginBottom: 4,
  },
  preview: {
    ...Typography.body,
    color: Colors.textLight,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ContentCard;

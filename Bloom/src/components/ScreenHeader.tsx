import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  largeTitle?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  subtitle, 
  showBack = false,
  rightElement,
  largeTitle = true
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, largeTitle ? styles.containerLarge : null]}>
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.text} />
          </TouchableOpacity>
        )}
        
        {!largeTitle && (
          <View style={styles.titleContainerSmall}>
            <Text style={styles.titleSmall} numberOfLines={1}>{title}</Text>
          </View>
        )}

        <View style={styles.rightSpacer} />

        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>

      {largeTitle && (
        <View style={styles.largeTitleContainer}>
          <Text style={styles.titleLarge}>{title}</Text>
          {subtitle && <Text style={styles.subtitleLarge}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: 'transparent',
  },
  containerLarge: {
    paddingBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    marginLeft: -Spacing.sm,
    padding: Spacing.xs,
  },
  titleContainerSmall: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: -1,
  },
  titleSmall: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.text,
  },
  rightSpacer: {
    flex: 1,
  },
  rightElementContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  largeTitleContainer: {
    marginTop: Spacing.md,
  },
  titleLarge: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitleLarge: {
    ...Typography.body,
    color: Colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ScreenHeader;

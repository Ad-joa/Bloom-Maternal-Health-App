import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../theme/theme';

export default function BloomAIScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Bloom AI</Text>
        <Text style={styles.subtitle}>Chat with our maternal health AI assistant.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
    fontSize: theme.typography.sizes.largeTitle,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMedium,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';
import { FadeSlideIn } from './FadeSlideIn';
import { BackgroundMesh } from './BackgroundMesh';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  return (
    <View style={styles.container}>
      {/* Edge-to-edge abstract mesh background */}
      <BackgroundMesh />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* The main Glassmorphism Card */}
            <View style={styles.glassWrapper}>
              <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={styles.blurContainer}>
                
                {/* Header */}
                <FadeSlideIn delay={100} duration={500} direction="down" style={styles.header}>
                  <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.titleText}>
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
                      {subtitle}
                    </Typography>
                  )}
                </FadeSlideIn>

                {/* Content */}
                <FadeSlideIn delay={250} duration={500} direction="down">
                  {children}
                </FadeSlideIn>
              </BlurView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Should be entirely covered by BackgroundMesh
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  glassWrapper: {
    borderRadius: 36,
    overflow: 'hidden',
    // Subtle iOS border for glass elements
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  blurContainer: {
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.65)',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 34, // True iOS Large Title size
    letterSpacing: -1,
    fontFamily: theme.typography.families.headingBold,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontSize: 16,
    color: theme.colors.textMedium,
  },
});

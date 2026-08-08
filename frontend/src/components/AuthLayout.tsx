import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { Typography } from './Typography';
import { FadeSlideIn } from './FadeSlideIn';

const { width, height } = Dimensions.get('window');

const WavyHeader = () => {
  return (
    <View style={styles.svgContainer}>
      <Svg height={height * 0.52} width={width} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor="#FF9A9E" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#F4C1BE" stopOpacity="1" />
            <Stop offset="1" stopColor="#E8B5DB" stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        {/* Main fill */}
        <Path 
          fill="url(#grad)" 
          d="M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,170.7C672,139,768,117,864,128C960,139,1056,181,1152,202.7C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
        />
        {/* Topo lines */}
        <Path fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"
          d="M0,120L48,141.3C96,163,192,205,288,205.3C384,205,480,163,576,130.7C672,99,768,77,864,88C960,99,1056,141,1152,162.7C1248,184,1344,184,1392,184L1440,184" />
        <Path fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
          d="M0,80L48,101.3C96,123,192,165,288,165.3C384,165,480,123,576,90.7C672,59,768,37,864,48C960,59,1056,101,1152,122.7C1248,144,1344,144,1392,144L1440,144" />
        <Path fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"
          d="M0,40L48,61.3C96,83,192,125,288,125.3C384,125,480,83,576,50.7C672,19,768,-3,864,8C960,19,1056,61,1152,82.7C1248,104,1344,104,1392,104L1440,104" />
        {/* Decorative Circles */}
        <Circle cx="200" cy="60" r="50" fill="rgba(255,255,255,0.12)" />
        <Circle cx="900" cy="120" r="90" fill="rgba(255,255,255,0.08)" />
        <Circle cx="1250" cy="30" r="45" fill="rgba(255,255,255,0.12)" />
        <Circle cx="600" cy="40" r="25" fill="rgba(255,255,255,0.18)" />
      </Svg>
    </View>
  );
};

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showWavyHeader?: boolean;
}

export const AuthLayout = ({ children, title, subtitle, showWavyHeader = true }: AuthLayoutProps) => {
  return (
    <View style={styles.container}>
      {showWavyHeader && <WavyHeader />}
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {showWavyHeader && <View style={{ height: height * 0.32 }} />}
            
            <View style={styles.contentCard}>
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
              <FadeSlideIn delay={250} duration={500} direction="down">
                {children}
              </FadeSlideIn>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBFA',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FDFBFA',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    marginBottom: 32,
  },
  titleText: {
    fontSize: 30,
    letterSpacing: -0.5,
    fontFamily: theme.typography.families.headingBold,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
    letterSpacing: 0.1,
    fontSize: 15,
    color: '#8E8E93',
  },
});

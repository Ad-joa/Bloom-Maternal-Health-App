import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { useTheme } from '../theme/ThemeContext';
import { ShieldCheck, CheckSquare, Square, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';

export default function PrivacyConsentScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  const [agreed, setAgreed] = useState(false);

  const handleProceed = () => {
    if (agreed) {
      navigation.navigate('Auth', { hasAcceptedTerms: true }); 
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Rich Gradient Background */}
      <LinearGradient 
        colors={isDark 
          ? [theme.colors.background, theme.colors.surface, theme.colors.background] 
          : ['#FFF5F5', theme.colors.primaryLight + '30', '#FFFFFF']} 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />
      
      {/* Custom Header with Back Button */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={28} color={theme.colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <LinearGradient 
            colors={[theme.colors.primary, theme.colors.primaryDark]} 
            style={styles.iconContainer}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          >
            <ShieldCheck size={48} color={theme.colors.background} strokeWidth={1.5} />
          </LinearGradient>
          
          <Typography variant="largeTitle" style={styles.mainTitle}>
            {t('privacy.title', 'Privacy & Consent')}
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            {t('privacy.subtitle', 'In compliance with the Ghana Data Protection Act (Act 843), we are committed to protecting your personal information.')}
          </Typography>
        </View>

        {/* Policies Section - Glassmorphism */}
        <View style={styles.glassWrapper}>
          <BlurView intensity={80} tint="light" style={styles.policyContainer}>
            <View style={styles.policyItem}>
              <Typography variant="title2" style={styles.policyTitle}>{t('privacy.policies.1.title', '1. Data Collection')}</Typography>
              <Typography variant="body" style={styles.policyText}>
                {t('privacy.policies.1.text', 'We collect your health data (vitals, symptoms) solely for the purpose of providing personalized maternal health guidance and tracking.')}
              </Typography>
            </View>

            <View style={styles.policyItem}>
              <Typography variant="title2" style={styles.policyTitle}>{t('privacy.policies.2.title', '2. Data Encryption')}</Typography>
              <Typography variant="body" style={styles.policyText}>
                {t('privacy.policies.2.text', 'Your data is encrypted securely on your device and when transmitted to our cloud servers. Only you and authorized healthcare providers can access it.')}
              </Typography>
            </View>

            <View style={styles.policyItem}>
              <Typography variant="title2" style={styles.policyTitle}>{t('privacy.policies.3.title', '3. Your Rights')}</Typography>
              <Typography variant="body" style={styles.policyText}>
                {t('privacy.policies.3.text', 'You have the right to access, modify, or permanently delete your data at any time from the Profile settings.')}
              </Typography>
            </View>
          </BlurView>
        </View>
      </ScrollView>

      {/* Sticky Bottom Area */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => setAgreed(!agreed)} 
          activeOpacity={0.7}
        >
          {agreed ? (
            <CheckSquare color={theme.colors.primary} size={28} strokeWidth={2.5} />
          ) : (
            <Square color={theme.colors.textMedium} size={28} strokeWidth={2} />
          )}
          <Typography variant="body" style={styles.checkboxText}>
            {t('privacy.agree', 'I agree to the privacy policy and terms')}
          </Typography>
        </TouchableOpacity>

        <Button 
          title={t('privacy.proceed', 'Proceed to Create Account')} 
          variant="primary" 
          onPress={handleProceed} 
          disabled={!agreed} 
          style={styles.continueButton} 
        />
      </View>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface, 
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 32, // Apple-style squircle radius
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: theme.colors.primaryDark,
    marginBottom: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textHigh,
    lineHeight: 24,
    fontSize: 17,
    textAlign: 'center',
  },
  glassWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 4,
  },
  policyContainer: {
    padding: 32,
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.5)', 
  },
  policyItem: {
    marginBottom: 32,
  },
  policyTitle: {
    color: theme.colors.primaryDark,
    fontSize: 20,
    marginBottom: 8,
  },
  policyText: {
    color: theme.colors.textHigh,
    lineHeight: 24,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.03)',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
  },
  checkboxText: {
    marginLeft: 16,
    flex: 1,
    color: theme.colors.textHigh,
    fontSize: 15,
    lineHeight: 22,
  },
  continueButton: {
    width: "100%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  }
});

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { BlurView } from 'expo-blur';
import { ChevronDown, ChevronUp, Mail, MessageCircle, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FAQS = [
  {
    question: "How do I sync with my partner?",
    answer: "Go to your Profile and select 'Partner Mode'. You will be given a 6-digit sync code that your partner can enter in their app to link your accounts."
  },
  {
    question: "Is my medical data secure?",
    answer: "Yes. Bloom uses industry-standard encryption. Your medical data is strictly confidential and is only accessible by you and your authorized healthcare providers."
  },
  {
    question: "How do I edit my profile information?",
    answer: "Navigate to the Profile tab and tap on any of your personal details (like Name, Due Date, or Trimester) to edit them directly inline."
  },
  {
    question: "What should I do in an emergency?",
    answer: "If you are experiencing a medical emergency, please use the 'Emergency Locator' from the Home screen to find the nearest hospital, or contact your primary healthcare provider immediately."
  }
];

export default function HelpSupportScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bloomhealth.app?subject=Bloom App Support Request');
  };

  const handleBloomAI = () => {
    // Navigate to the Support tab which opens Bloom AI
    navigation.navigate('MainTabs', { screen: 'Support' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BackgroundMesh />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
              Help & Support
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={{ marginTop: 8 }}>
              We're here to help you on your journey.
            </Typography>
          </View>

          {/* Contact Options */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactCard} onPress={handleBloomAI} activeOpacity={0.8}>
              <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <MessageCircle color="#0284C7" size={24} />
              </View>
              <Typography variant="headline" color={theme.colors.textHigh} style={{ marginTop: 12 }}>Ask Bloom AI</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium} align="center" style={{ marginTop: 4 }}>Instant answers to your questions.</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleEmailSupport} activeOpacity={0.8}>
              <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Mail color="#B45309" size={24} />
              </View>
              <Typography variant="headline" color={theme.colors.textHigh} style={{ marginTop: 12 }}>Email Support</Typography>
              <Typography variant="caption1" color={theme.colors.textMedium} align="center" style={{ marginTop: 4 }}>Reach out to our human team.</Typography>
            </TouchableOpacity>
          </View>

          {/* FAQs */}
          <Typography variant="title2" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold, marginBottom: 16 }}>
            Frequently Asked Questions
          </Typography>

          <View style={styles.faqContainer}>
            {FAQS.map((faq, index) => (
              <View key={index} style={styles.faqCardWrapper}>
                <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.faqCard}>
                  <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
                  
                  <TouchableOpacity 
                    style={styles.faqHeader} 
                    onPress={() => toggleExpand(index)}
                    activeOpacity={0.7}
                  >
                    <Typography variant="headline" color={theme.colors.textHigh} style={{ flex: 1, paddingRight: 16 }}>
                      {faq.question}
                    </Typography>
                    {expandedId === index ? (
                      <ChevronUp color={theme.colors.primary} size={20} />
                    ) : (
                      <ChevronDown color={theme.colors.textMedium} size={20} />
                    )}
                  </TouchableOpacity>

                  {expandedId === index && (
                    <View style={styles.faqBody}>
                      <Typography variant="body" color={theme.colors.textMedium} style={{ lineHeight: 22 }}>
                        {faq.answer}
                      </Typography>
                    </View>
                  )}
                </BlurView>
              </View>
            ))}
          </View>

          {/* Terms & Privacy */}
          <TouchableOpacity 
            style={styles.termsButton} 
            onPress={() => navigation.navigate('PrivacyConsent')}
            activeOpacity={0.7}
          >
            <FileText color={theme.colors.textMedium} size={16} style={{ marginRight: 8 }} />
            <Typography variant="caption1" color={theme.colors.textMedium}>View Terms & Privacy Policy</Typography>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  contactCard: {
    width: (width - 48 - 16) / 2, // Half width minus padding and gap
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqContainer: {
    marginBottom: 32,
  },
  faqCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  faqCard: {
    width: '100%',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  faqBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  }
});

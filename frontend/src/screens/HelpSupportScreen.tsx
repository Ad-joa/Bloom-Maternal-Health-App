import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions, TextInput, Platform, UIManager, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { BlurView } from 'expo-blur';
import { ChevronDown, ChevronUp, Mail, MessageCircle, FileText, Search, PhoneCall } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

const FAQ_CATEGORIES = [
  {
    title: "Account & Profile",
    items: [
      {
        id: "faq_1",
        question: "How do I sync with my partner?",
        answer: "Go to your Profile and select 'Partner Mode'. You will be given a 6-digit sync code that your partner can enter in their app to link your accounts."
      },
      {
        id: "faq_2",
        question: "How do I edit my profile information?",
        answer: "Navigate to the Profile tab and tap the 'Edit' pencil icon in the top right. You can update your Name, Due Date, Trimester, and other details there."
      }
    ]
  },
  {
    title: "Data & Security",
    items: [
      {
        id: "faq_3",
        question: "Is my medical data secure?",
        answer: "Yes. Bloom uses industry-standard encryption. Your medical data is strictly confidential and is only accessible by you and your authorized healthcare providers."
      }
    ]
  },
  {
    title: "Health & Emergencies",
    items: [
      {
        id: "faq_4",
        question: "What should I do in an emergency?",
        answer: "If you are experiencing a medical emergency, please use the 'Emergency Locator' from the Home screen to find the nearest hospital, or contact your primary healthcare provider immediately."
      },
      {
        id: "faq_5",
        question: "How accurate is the Bloom AI?",
        answer: "Bloom AI provides guidance based on established medical guidelines, but it does NOT replace professional medical advice. Always consult your doctor for medical decisions."
      }
    ]
  }
];

export default function HelpSupportScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@bloomhealth.app?subject=Bloom App Support Request');
  };

  const handleBloomAI = () => {
    navigation.navigate('MainTabs', { screen: 'Support' });
  };

  // Filter FAQs based on search
  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(
      item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <View style={styles.container}>
      <BackgroundMesh />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            
            {/* Hero Section */}
            <View style={styles.header}>
              <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.headerTitle}>
                How can we help?
              </Typography>
              <Typography variant="body" color={theme.colors.textMedium} style={styles.headerSubtitle}>
                Search our help center or reach out directly to our support team.
              </Typography>
            </View>

            {/* Search Bar */}
            <View style={styles.searchWrapper}>
              <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={styles.searchBlur}>
                <LinearGradient colors={isDark ? ['rgba(255,255,255,0.08)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
                <Search color={theme.colors.textMedium} size={20} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for answers..."
                  placeholderTextColor={theme.colors.textMedium}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                />
              </BlurView>
            </View>

            {/* Contact Options */}
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactCardWrapper} onPress={handleBloomAI} activeOpacity={0.8}>
                <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={styles.contactCard}>
                  <LinearGradient colors={isDark ? ['rgba(255,255,255,0.08)', 'transparent'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(2,132,199,0.2)' : '#E0F2FE' }]}>
                    <MessageCircle color={isDark ? '#38BDF8' : '#0284C7'} size={26} />
                  </View>
                  <Typography variant="title2" color={theme.colors.textHigh} style={styles.contactTitle}>Ask Bloom AI</Typography>
                  <Typography variant="caption1" color={theme.colors.textMedium} align="center" style={styles.contactSubtitle}>
                    Instant answers from our medical AI assistant.
                  </Typography>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactCardWrapper} onPress={handleEmailSupport} activeOpacity={0.8}>
                <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={styles.contactCard}>
                  <LinearGradient colors={isDark ? ['rgba(255,255,255,0.08)', 'transparent'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
                  <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(217,119,6,0.2)' : '#FEF3C7' }]}>
                    <Mail color={isDark ? '#FBBF24' : '#D97706'} size={26} />
                  </View>
                  <Typography variant="title2" color={theme.colors.textHigh} style={styles.contactTitle}>Email Support</Typography>
                  <Typography variant="caption1" color={theme.colors.textMedium} align="center" style={styles.contactSubtitle}>
                    Reach out to our human support team directly.
                  </Typography>
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* FAQs */}
            <View style={styles.faqSection}>
              {searchQuery.length > 0 && filteredCategories.length === 0 ? (
                <View style={styles.emptyState}>
                  <Typography variant="headline" color={theme.colors.textMedium} align="center">
                    No matching answers found.
                  </Typography>
                  <Typography variant="body" color={theme.colors.textMedium} align="center" style={{ marginTop: 8 }}>
                    Try asking Bloom AI instead!
                  </Typography>
                </View>
              ) : (
                filteredCategories.map((category, catIndex) => (
                  <View key={catIndex} style={styles.faqCategory}>
                    <Typography variant="title2" color={theme.colors.textHigh} style={styles.categoryTitle}>
                      {category.title}
                    </Typography>

                    {category.items.map((faq) => {
                      const isExpanded = expandedId === faq.id;
                      return (
                        <View key={faq.id} style={[styles.faqCardWrapper, isExpanded && styles.faqCardWrapperActive]}>
                          <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={styles.faqCard}>
                            <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
                            
                            <TouchableOpacity 
                              style={styles.faqHeader} 
                              onPress={() => toggleExpand(faq.id)}
                              activeOpacity={0.7}
                            >
                              <Typography variant="headline" color={isExpanded ? theme.colors.primaryDark : theme.colors.textHigh} style={{ flex: 1, paddingRight: 16 }}>
                                {faq.question}
                              </Typography>
                              <View style={[styles.chevronWrapper, isExpanded && { backgroundColor: theme.colors.primaryLight }]}>
                                {isExpanded ? (
                                  <ChevronUp color={theme.colors.primaryDark} size={18} strokeWidth={2.5} />
                                ) : (
                                  <ChevronDown color={theme.colors.textMedium} size={18} strokeWidth={2.5} />
                                )}
                              </View>
                            </TouchableOpacity>

                            {isExpanded && (
                              <View style={styles.faqBody}>
                                <Typography variant="body" color={theme.colors.textMedium} style={styles.faqAnswerText}>
                                  {faq.answer}
                                </Typography>
                              </View>
                            )}
                          </BlurView>
                        </View>
                      );
                    })}
                  </View>
                ))
              )}
            </View>

            {/* Terms & Privacy */}
            <TouchableOpacity 
              style={styles.termsButton} 
              onPress={() => navigation.navigate('PrivacyConsent')}
              activeOpacity={0.7}
            >
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={styles.termsBlur}>
                <FileText color={theme.colors.textMedium} size={18} style={{ marginRight: 10 }} />
                <Typography variant="subhead" color={theme.colors.textMedium} style={{ fontFamily: theme.typography.families.headingSemibold }}>
                  View Terms & Privacy Policy
                </Typography>
              </BlurView>
            </TouchableOpacity>

            <View style={{ height: 60 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 28, paddingHorizontal: 4 },
  headerTitle: { 
    fontFamily: theme.typography.families.headingBold, 
    letterSpacing: -0.5, 
    marginBottom: 8,
    fontSize: 34,
    lineHeight: 42,
    paddingTop: 8
  },
  headerSubtitle: { fontFamily: theme.typography.families.bodyMedium, opacity: 0.8 },
  
  searchWrapper: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
  },
  searchBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: theme.typography.families.bodyMedium,
    fontSize: 16,
    color: theme.colors.textHigh,
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 16,
  },
  contactCardWrapper: {
    flex: 1,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: isDark ? 0.3 : 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  contactCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 18,
  },
  contactSubtitle: {
    lineHeight: 18,
    opacity: 0.9,
  },

  faqSection: {
    marginBottom: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqCategory: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 16,
    marginLeft: 4,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  faqCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.2 : 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  faqCardWrapperActive: {
    borderColor: theme.colors.primaryLight,
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowRadius: 16,
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
  chevronWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqBody: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 4,
  },
  faqAnswerText: {
    lineHeight: 24,
    opacity: 0.9,
  },

  termsButton: {
    alignSelf: 'center',
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)',
  },
  termsBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  }
});

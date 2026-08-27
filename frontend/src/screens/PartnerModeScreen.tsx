import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { X, Heart, Calendar, Droplets, Moon, Baby, Stethoscope } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { useAuth } from '../context/AuthContext';
import { getPartnerDashboard, getProfile, linkPartner } from '../api/api';
import { getWeeksPregnant, getDaysUntilDue } from '../utils/dateUtils';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function PartnerModeScreen({ navigation }: any) {


  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [linkCode, setLinkCode] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          const prof = await getProfile(user.id);
          setProfile(prof);
          if (prof.linked_user_id) {
            const data = await getPartnerDashboard(user.id);
            setDashboardData(data);
          }
        } catch (e) {
          console.error("Error loading partner mode data", e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const handleLink = async () => {
    try {
      if (user?.id && linkCode) {
        setLoading(true);
        await linkPartner(user.id, linkCode);
        const prof = await getProfile(user.id);
        setProfile(prof);
        const data = await getPartnerDashboard(user.id);
        setDashboardData(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      alert("Invalid code or connection error.");
    }
  };

  const isLinked = !!profile?.linked_user_id;
  const weeksPregnant = user?.due_date ? getWeeksPregnant(user.due_date) : 14;
  
  const getFetusImage = (weeks: number) => {
    if (weeks < 6) return require('../../assets/images/fetus_2.jpg');
    if (weeks < 11) return require('../../assets/images/fetus_7.jpg');
    if (weeks < 28) return require('../../assets/images/fetus_14.jpg');
    if (weeks < 39) return require('../../assets/images/fetus_35.jpg');
    return require('../../assets/images/fetus_41.jpg');
  };
  const babyImage = getFetusImage(weeksPregnant);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isLinked) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
        <BackgroundMesh />
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
            <View style={styles.linkCard}>
              <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              
              <View style={styles.iconCircle}>
                <Heart color={theme.colors.primary} size={32} fill={theme.colors.primaryLight} />
              </View>

              <Typography variant="title1" align="center" style={{ marginBottom: 16, fontFamily: theme.typography.families.headingBold }}>
                Partner Sync
              </Typography>
              
              <Typography variant="body" align="center" style={{ marginBottom: 32, color: theme.colors.textMedium }}>
                Stay connected through every step of the journey. Enter your partner's 6-digit sync code below.
              </Typography>

              <View style={styles.codeBox}>
                <Typography variant="caption1" color={theme.colors.textMedium} align="center">YOUR SYNC CODE</Typography>
                <Typography variant="largeTitle" align="center" color={theme.colors.primaryDark} style={{ letterSpacing: 8, marginTop: 8 }}>
                  {profile?.partner_code || user?.id?.toString().padStart(6, '0')}
                </Typography>
              </View>

              <View style={{marginTop: 32}}>
                <TextInput 
                  placeholder="Enter Partner's Code"
                  value={linkCode}
                  onChangeText={setLinkCode}
                  style={styles.premiumInput}
                  placeholderTextColor={theme.colors.textMedium}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity style={styles.premiumLinkBtn} onPress={handleLink} activeOpacity={0.8}>
                <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={StyleSheet.absoluteFillObject} />
                <Typography variant="headline" color={theme.colors.background}>Sync Accounts</Typography>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 24, padding: 8 }}>
                <Typography align="center" color={theme.colors.textMedium}>Maybe Later</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundMesh />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row */}
          <FadeSlideIn delay={100} duration={500} direction="down" style={styles.headerRow}>
            <View style={styles.headerText}>
              <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.titleText}>
                Family Dashboard
              </Typography>
              <Typography variant="body" style={styles.subtitle}>
                A read-only summary of her pregnancy journey.
              </Typography>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.closeBtn}>
              <BlurView intensity={80} tint="light" style={styles.closeBlur}>
                <X color="#000" size={24} strokeWidth={2} />
              </BlurView>
            </TouchableOpacity>
          </FadeSlideIn>

          {/* Visual Fetus Representation */}
          <FadeSlideIn delay={300} duration={500} direction="up" style={styles.imageContainer}>
            <Image source={babyImage} style={styles.fetusImage} resizeMode="cover" />
            <LinearGradient colors={['transparent', isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)', theme.colors.background]} style={StyleSheet.absoluteFillObject} />
            <View style={styles.imageOverlay}>
              <Typography variant="largeTitle" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>Week {weeksPregnant}</Typography>
              <Typography variant="body" color={theme.colors.textMedium}>{getDaysUntilDue(user?.due_date || '')} days until due date</Typography>
            </View>
          </FadeSlideIn>

          {/* Stats Grid */}
          <FadeSlideIn delay={400} duration={500} direction="up">
            <View style={styles.grid}>
              <View style={styles.gridCardWrapper}>
                <BlurView intensity={80} tint="light" style={styles.gridCard}>
                  <View style={[styles.cardIcon, { backgroundColor: 'rgba(232, 248, 242, 0.8)' }]}>
                    <Calendar size={20} color={theme.colors.primaryDark} strokeWidth={2.5} />
                  </View>
                  <Typography variant="caption1" color="#636366" style={styles.cardLabel}>WEEK</Typography>
                  <Typography style={styles.cardValue}>{weeksPregnant}</Typography>
                  <Typography variant="caption2" color="#8E8E93">Trimester {user?.trimester || 2}</Typography>
                </BlurView>
              </View>

              <View style={styles.gridCardWrapper}>
                <BlurView intensity={80} tint="light" style={styles.gridCard}>
                  <View style={[styles.cardIcon, { backgroundColor: 'rgba(255, 240, 239, 0.8)' }]}>
                    <Baby size={20} color="#E07A5F" strokeWidth={2.5} />
                  </View>
                  <Typography variant="caption1" color="#636366" style={styles.cardLabel}>DUE DATE</Typography>
                  <Typography style={styles.cardValue} numberOfLines={1} adjustsFontSizeToFit>{getDaysUntilDue(user?.due_date || '')}</Typography>
                  <Typography variant="caption2" color="#8E8E93">Days Left</Typography>
                </BlurView>
              </View>
            </View>
          </FadeSlideIn>

          {/* Vibe Card */}
          <FadeSlideIn delay={300} duration={500} direction="down">
            <View style={styles.cardWrapper}>
              <BlurView intensity={80} tint="light" style={styles.glassCard}>
                <View style={styles.vibeHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: 'rgba(255, 248, 225, 0.8)' }]}>
                    <Heart size={20} color="#FF9500" strokeWidth={2.5} />
                  </View>
                  <Typography variant="headline" color={theme.colors.textHigh} style={styles.vibeTitle}>
                    Recent Logs
                  </Typography>
                </View>
                <View style={styles.vibeBody}>
                  <View style={styles.vibeTextWrap}>
                    {dashboardData?.symptom_logs?.length > 0 ? dashboardData.symptom_logs.map((log: any, idx: number) => (
                      <Typography key={idx} variant="body" color="#3A3A3C" style={styles.vibeDesc}>
                        • {log.symptoms}
                      </Typography>
                    )) : (
                      <Typography variant="body" color="#3A3A3C" style={styles.vibeDesc}>No recent logs.</Typography>
                    )}
                  </View>
                </View>
              </BlurView>
            </View>
          </FadeSlideIn>

          {/* Next Visit Card */}
          <FadeSlideIn delay={500} duration={500} direction="up">
            <Typography variant="caption1" color="#8E8E93" style={styles.sectionLabel}>NEXT HOSPITAL VISIT</Typography>
            <View style={styles.cardWrapper}>
              <BlurView intensity={80} tint="light" style={styles.visitCard}>
                {dashboardData?.anc_visits?.[0] ? (
                  <View style={styles.visitRow}>
                    <View style={styles.visitDateBadge}>
                      <Typography variant="title3" color="#FFF" style={styles.visitDay}>{dashboardData.anc_visits[0].date.split(' ')[0].replace(/[^0-9]/g, '') || dashboardData.anc_visits[0].date.split(' ')[0]}</Typography>
                      <Typography variant="caption2" color="rgba(255,255,255,0.8)">{dashboardData.anc_visits[0].date.split(' ')[1] ? dashboardData.anc_visits[0].date.split(' ')[1].substring(0, 3).toUpperCase() : 'APP'}</Typography>
                    </View>
                    <View style={styles.visitInfo}>
                      <Typography variant="headline" color={theme.colors.textHigh} style={{ fontSize: 17 }}>{dashboardData.anc_visits[0].date}, {dashboardData.anc_visits[0].time}</Typography>
                      <Typography variant="footnote" color="#636366" style={{ marginTop: 4 }}>{dashboardData.anc_visits[0].doctor || 'Routine Checkup'}</Typography>
                    </View>
                  </View>
                ) : (
                   <View style={[styles.visitRow, {justifyContent: 'center'}]}>
                      <Typography variant="body" color="#636366">No upcoming visits scheduled.</Typography>
                   </View>
                )}
              </BlurView>
            </View>
          </FadeSlideIn>

          {/* Bottom spacer */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Support Item sub-component ──────────────────────────
const SupportItem = ({ icon, bg, text }: { icon: React.ReactNode; bg: string; text: string }) => (
  <View style={styles.supportItem}>
    <View style={[styles.supportIcon, { backgroundColor: bg }]}>{icon}</View>
    <Typography variant="body" color={theme.colors.textHigh} style={styles.supportText}>{text}</Typography>
  </View>
);

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // ── Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  titleText: {
    fontSize: 34,
    letterSpacing: -1,
    fontFamily: theme.typography.families.headingBold,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontSize: 16,
    color: '#636366',
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
  },
  logText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#8E8E93',
    lineHeight: 22,
  },
  linkCard: {
    borderRadius: 32,
    overflow: 'hidden',
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primaryLight + '40',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  codeBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  premiumInput: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    fontSize: 24,
    fontFamily: theme.typography.families.headingBold,
    color: theme.colors.textHigh,
    textAlign: 'center',
    paddingVertical: 16,
  },
  premiumLinkBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 24,
  },
  imageContainer: {
    width: width - 48,
    height: 300,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  fetusImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
  },
  closeBtn: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  closeBlur: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  // ── Base Glass Wrappers
  cardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  glassCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  // ── Stats Grid
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  gridCardWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  gridCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 1,
    fontSize: 11,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 40,
    fontFamily: theme.typography.families.headingBold,
    lineHeight: 46,
    color: '#000',
  },
  babyEmoji: {
    fontSize: 40,
    lineHeight: 46,
  },
  // ── Vibe Card
  vibeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  vibeTitle: {
    fontSize: 18,
    letterSpacing: -0.2,
  },
  vibeBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  vibeEmoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  vibeTextWrap: {
    flex: 1,
  },
  vibeDesc: {
    lineHeight: 24,
    fontSize: 16,
  },
  moodPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  moodPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  // ── Section Label
  sectionLabel: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 8,
  },
  // ── Support Section
  supportCard: {
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  supportIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  supportDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 70,
  },
  // ── Visit Card
  visitCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  visitDateBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitDay: {
    fontFamily: theme.typography.families.headingBold,
    lineHeight: 28,
  },
  visitInfo: {
    flex: 1,
  },
});

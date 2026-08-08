import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { BounceButton } from '../components/BounceButton';
import { X, Heart, Calendar, Droplets, Moon, Baby, Stethoscope } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';

const { width, height } = Dimensions.get('window');

// Softer gradient header tailored for the partner/family context
const PartnerHeader = () => (
  <View style={styles.svgContainer}>
    <Svg height={height * 0.38} width={width} viewBox="0 0 1440 320" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="partnerGrad" x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#C8EAEB" stopOpacity="1" />
          <Stop offset="0.5" stopColor="#8DD3C1" stopOpacity="1" />
          <Stop offset="1" stopColor="#E8B5DB" stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
      <Path
        fill="url(#partnerGrad)"
        d="M0,160L48,181.3C96,203,192,245,288,245.3C384,245,480,203,576,170.7C672,139,768,117,864,128C960,139,1056,181,1152,202.7C1248,224,1344,224,1392,224L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      />
      {/* Topo lines */}
      <Path fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"
        d="M0,120L48,141.3C96,163,192,205,288,205.3C384,205,480,163,576,130.7C672,99,768,77,864,88C960,99,1056,141,1152,162.7C1248,184,1344,184,1392,184L1440,184" />
      <Path fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
        d="M0,80L48,101.3C96,123,192,165,288,165.3C384,165,480,123,576,90.7C672,59,768,37,864,48C960,59,1056,101,1152,122.7C1248,144,1344,144,1392,144L1440,144" />
      {/* Decorative circles */}
      <Circle cx="180" cy="50" r="40" fill="rgba(255,255,255,0.12)" />
      <Circle cx="850" cy="100" r="70" fill="rgba(255,255,255,0.08)" />
      <Circle cx="1200" cy="35" r="30" fill="rgba(255,255,255,0.14)" />
    </Svg>
  </View>
);

export default function PartnerModeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <PartnerHeader />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Spacer for wavy header */}
          <View style={{ height: height * 0.22 }} />

          <View style={styles.contentCard}>
            {/* Header Row */}
            <FadeSlideIn delay={100} duration={500} direction="down" style={styles.headerRow}>
              <View style={styles.headerText}>
                <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.titleText}>
                  Family Dashboard
                </Typography>
                <Typography variant="body" style={styles.subtitle}>
                  A read-only summary of your loved one's pregnancy journey.
                </Typography>
              </View>
              <BounceButton onPress={() => navigation.goBack()} scaleTo={0.85} style={styles.closeBtn}>
                <X color={theme.colors.textMedium} size={20} strokeWidth={2} />
              </BounceButton>
            </FadeSlideIn>

            {/* Stats Grid */}
            <FadeSlideIn delay={200} duration={500} direction="down">
              <View style={styles.grid}>
                <Card style={styles.gridCard} variant="filled">
                  <View style={[styles.cardIcon, { backgroundColor: '#E8F8F2' }]}>
                    <Calendar size={18} color={theme.colors.primary} strokeWidth={2} />
                  </View>
                  <Typography variant="caption1" color="#8E8E93" style={styles.cardLabel}>WEEK</Typography>
                  <Typography variant="largeTitle" color={theme.colors.primaryDark} style={styles.cardValue}>24</Typography>
                  <Typography variant="caption2" color="#AEAEB2">Trimester 2</Typography>
                </Card>

                <Card style={styles.gridCard} variant="filled">
                  <View style={[styles.cardIcon, { backgroundColor: '#FFF0EF' }]}>
                    <Baby size={18} color={theme.colors.accentPink} strokeWidth={2} />
                  </View>
                  <Typography variant="caption1" color="#8E8E93" style={styles.cardLabel}>BABY SIZE</Typography>
                  <Typography style={styles.babyEmoji}>🌽</Typography>
                  <Typography variant="caption2" color="#AEAEB2">Ear of Corn</Typography>
                </Card>
              </View>
            </FadeSlideIn>

            {/* Vibe Card */}
            <FadeSlideIn delay={300} duration={500} direction="down">
              <Card style={styles.vibeCard} variant="elevated">
                <View style={styles.vibeHeader}>
                  <View style={[styles.cardIcon, { backgroundColor: '#FFF8E1' }]}>
                    <Heart size={18} color="#FF9500" strokeWidth={2} />
                  </View>
                  <Typography variant="headline" color={theme.colors.textHigh} style={styles.vibeTitle}>
                    General Vibe Today
                  </Typography>
                </View>
                <View style={styles.vibeBody}>
                  <Typography style={styles.vibeEmoji}>🙂</Typography>
                  <View style={styles.vibeTextWrap}>
                    <Typography variant="body" color="#636366" style={styles.vibeDesc}>
                      She is feeling generally good today, though slightly fatigued.
                    </Typography>
                    <View style={styles.moodPillRow}>
                      <View style={[styles.moodPill, { backgroundColor: '#E8F8F2' }]}>
                        <Typography variant="caption2" color={theme.colors.primary}>Calm</Typography>
                      </View>
                      <View style={[styles.moodPill, { backgroundColor: '#FFF0EF' }]}>
                        <Typography variant="caption2" color={theme.colors.accentPink}>Tired</Typography>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </FadeSlideIn>

            {/* How to Support Section */}
            <FadeSlideIn delay={400} duration={500} direction="up">
              <Typography variant="footnote" color="#8E8E93" style={styles.sectionLabel}>HOW TO SUPPORT HER TODAY</Typography>
              <Card style={styles.supportCard} variant="elevated">
                <SupportItem icon={<Droplets size={16} color="#007AFF" strokeWidth={2} />} bg="#EBF5FF" text="Make sure she is drinking plenty of water." />
                <View style={styles.supportDivider} />
                <SupportItem icon={<Moon size={16} color="#AF52DE" strokeWidth={2} />} bg="#F3EFFC" text="Offer a gentle lower-back massage before bed." />
                <View style={styles.supportDivider} />
                <SupportItem icon={<Stethoscope size={16} color={theme.colors.primary} strokeWidth={2} />} bg="#E8F8F2" text="Remind her about the ANC visit next week." />
              </Card>
            </FadeSlideIn>

            {/* Next Visit Card */}
            <FadeSlideIn delay={500} duration={500} direction="up">
              <Typography variant="footnote" color="#8E8E93" style={styles.sectionLabel}>NEXT HOSPITAL VISIT</Typography>
              <Card style={styles.visitCard} variant="elevated">
                <View style={styles.visitRow}>
                  <View style={styles.visitDateBadge}>
                    <Typography variant="title3" color="#FFF" style={styles.visitDay}>20</Typography>
                    <Typography variant="caption2" color="rgba(255,255,255,0.8)">OCT</Typography>
                  </View>
                  <View style={styles.visitInfo}>
                    <Typography variant="headline" color={theme.colors.textHigh}>October 20th, 10:00 AM</Typography>
                    <Typography variant="footnote" color="#8E8E93" style={{ marginTop: 4 }}>Dr. Mensah at General Hospital</Typography>
                  </View>
                </View>
              </Card>
            </FadeSlideIn>

            {/* Bottom spacer */}
            <View style={{ height: 40 }} />
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FDFBFA',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 16,
  },
  // ── Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  titleText: {
    fontSize: 28,
    letterSpacing: -0.5,
    fontFamily: theme.typography.families.headingBold,
  },
  subtitle: {
    marginTop: 6,
    lineHeight: 22,
    letterSpacing: 0.1,
    fontSize: 15,
    color: '#8E8E93',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  // ── Stats Grid
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 1,
    fontSize: 10,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 36,
    fontFamily: theme.typography.families.headingBold,
    lineHeight: 42,
  },
  babyEmoji: {
    fontSize: 36,
    lineHeight: 42,
  },
  // ── Vibe Card
  vibeCard: {
    marginBottom: 24,
    borderRadius: 20,
  },
  vibeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  vibeTitle: {
    fontFamily: theme.typography.families.headingSemibold,
    letterSpacing: -0.2,
  },
  vibeBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  vibeEmoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  vibeTextWrap: {
    flex: 1,
  },
  vibeDesc: {
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  moodPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  moodPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  // ── Section Label
  sectionLabel: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 1,
    fontSize: 11,
    marginBottom: 10,
    marginLeft: 4,
  },
  // ── Support Section
  supportCard: {
    marginBottom: 24,
    borderRadius: 20,
    paddingVertical: 8,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  supportIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  supportDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
    marginLeft: 52,
  },
  // ── Visit Card
  visitCard: {
    marginBottom: 16,
    borderRadius: 20,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  visitDateBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  visitDay: {
    fontFamily: theme.typography.families.headingBold,
    lineHeight: 26,
  },
  visitInfo: {
    flex: 1,
  },
});

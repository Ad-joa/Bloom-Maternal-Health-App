import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { X, Heart, Calendar, Droplets, Moon, Baby, Stethoscope } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';

export default function PartnerModeScreen({ navigation }: any) {
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

          {/* Stats Grid */}
          <FadeSlideIn delay={200} duration={500} direction="down">
            <View style={styles.grid}>
              <View style={styles.gridCardWrapper}>
                <BlurView intensity={80} tint="light" style={styles.gridCard}>
                  <View style={[styles.cardIcon, { backgroundColor: 'rgba(232, 248, 242, 0.8)' }]}>
                    <Calendar size={20} color={theme.colors.primaryDark} strokeWidth={2.5} />
                  </View>
                  <Typography variant="caption1" color="#636366" style={styles.cardLabel}>WEEK</Typography>
                  <Typography style={styles.cardValue}>24</Typography>
                  <Typography variant="caption2" color="#8E8E93">Trimester 2</Typography>
                </BlurView>
              </View>

              <View style={styles.gridCardWrapper}>
                <BlurView intensity={80} tint="light" style={styles.gridCard}>
                  <View style={[styles.cardIcon, { backgroundColor: 'rgba(255, 240, 239, 0.8)' }]}>
                    <Baby size={20} color="#E07A5F" strokeWidth={2.5} />
                  </View>
                  <Typography variant="caption1" color="#636366" style={styles.cardLabel}>BABY SIZE</Typography>
                  <Typography style={styles.babyEmoji}>🌽</Typography>
                  <Typography variant="caption2" color="#8E8E93">Ear of Corn</Typography>
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
                    General Vibe Today
                  </Typography>
                </View>
                <View style={styles.vibeBody}>
                  <Typography style={styles.vibeEmoji}>🙂</Typography>
                  <View style={styles.vibeTextWrap}>
                    <Typography variant="body" color="#3A3A3C" style={styles.vibeDesc}>
                      She is feeling generally good today, though slightly fatigued.
                    </Typography>
                    <View style={styles.moodPillRow}>
                      <View style={[styles.moodPill, { backgroundColor: 'rgba(232, 248, 242, 0.8)' }]}>
                        <Typography variant="caption2" color={theme.colors.primaryDark}>Calm</Typography>
                      </View>
                      <View style={[styles.moodPill, { backgroundColor: 'rgba(255, 240, 239, 0.8)' }]}>
                        <Typography variant="caption2" color="#E07A5F">Tired</Typography>
                      </View>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>
          </FadeSlideIn>

          {/* How to Support Section */}
          <FadeSlideIn delay={400} duration={500} direction="up">
            <Typography variant="caption1" color="#8E8E93" style={styles.sectionLabel}>HOW TO SUPPORT HER TODAY</Typography>
            <View style={styles.cardWrapper}>
              <BlurView intensity={80} tint="light" style={styles.supportCard}>
                <SupportItem icon={<Droplets size={18} color="#007AFF" strokeWidth={2.5} />} bg="rgba(235, 245, 255, 0.8)" text="Make sure she is drinking plenty of water." />
                <View style={styles.supportDivider} />
                <SupportItem icon={<Moon size={18} color="#AF52DE" strokeWidth={2.5} />} bg="rgba(243, 239, 252, 0.8)" text="Offer a gentle lower-back massage before bed." />
                <View style={styles.supportDivider} />
                <SupportItem icon={<Stethoscope size={18} color={theme.colors.primaryDark} strokeWidth={2.5} />} bg="rgba(232, 248, 242, 0.8)" text="Remind her about the ANC visit next week." />
              </BlurView>
            </View>
          </FadeSlideIn>

          {/* Next Visit Card */}
          <FadeSlideIn delay={500} duration={500} direction="up">
            <Typography variant="caption1" color="#8E8E93" style={styles.sectionLabel}>NEXT HOSPITAL VISIT</Typography>
            <View style={styles.cardWrapper}>
              <BlurView intensity={80} tint="light" style={styles.visitCard}>
                <View style={styles.visitRow}>
                  <View style={styles.visitDateBadge}>
                    <Typography variant="title3" color="#FFF" style={styles.visitDay}>20</Typography>
                    <Typography variant="caption2" color="rgba(255,255,255,0.8)">OCT</Typography>
                  </View>
                  <View style={styles.visitInfo}>
                    <Typography variant="headline" color={theme.colors.textHigh} style={{ fontSize: 17 }}>October 20th, 10:00 AM</Typography>
                    <Typography variant="footnote" color="#636366" style={{ marginTop: 4 }}>Dr. Mensah at General Hospital</Typography>
                  </View>
                </View>
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

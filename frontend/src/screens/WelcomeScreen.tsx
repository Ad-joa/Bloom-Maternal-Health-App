import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRight, Heart, Leaf, Shield } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
type Props = { navigation: WelcomeScreenNavigationProp };

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <AuthLayout title="Welcome" subtitle="Your maternal health companion, built with care." showWavyHeader={true}>
      <View style={styles.content}>
        {/* Feature Pills */}
        <FadeSlideIn delay={300} duration={500} direction="down">
          <View style={styles.features}>
            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F8F2' }]}>
                <Heart size={16} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="footnote" color={theme.colors.textHigh} style={styles.featureTitle}>Track & Monitor</Typography>
                <Typography variant="caption2" color="#8E8E93">Log vitals, symptoms & baby growth</Typography>
              </View>
            </View>

            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF0EF' }]}>
                <Leaf size={16} color={theme.colors.accentPink} strokeWidth={2} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="footnote" color={theme.colors.textHigh} style={styles.featureTitle}>Ghanaian Context</Typography>
                <Typography variant="caption2" color="#8E8E93">Local nutrition & ANC guidance</Typography>
              </View>
            </View>

            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#F3EFFC' }]}>
                <Shield size={16} color={theme.colors.accentPurple} strokeWidth={2} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="footnote" color={theme.colors.textHigh} style={styles.featureTitle}>Works Offline</Typography>
                <Typography variant="caption2" color="#8E8E93">Syncs when you're back online</Typography>
              </View>
            </View>
          </View>
        </FadeSlideIn>

        {/* CTA */}
        <FadeSlideIn delay={600} duration={500} direction="up" style={styles.ctaSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
            <FadeSlideIn delay={700} direction="right">
              <View style={styles.continueButton}>
                <Typography variant="body" style={styles.continueText}>Get Started</Typography>
                <FadeSlideIn delay={900} zoom>
                  <View style={styles.iconCircle}>
                    <ArrowRight size={18} color="#FFF" strokeWidth={2.5} />
                  </View>
                </FadeSlideIn>
              </View>
            </FadeSlideIn>
          </TouchableOpacity>
        </FadeSlideIn>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  features: {
    gap: 12,
    marginTop: 4,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextGroup: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 0.1,
  },
  ctaSection: {
    alignItems: 'flex-end',
    marginTop: 32,
    paddingBottom: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
    paddingLeft: 20,
  },
  continueText: {
    fontFamily: theme.typography.families.bodySemibold,
    color: theme.colors.textHigh,
    fontSize: 18,
    letterSpacing: 0.2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accentPink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.accentPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});

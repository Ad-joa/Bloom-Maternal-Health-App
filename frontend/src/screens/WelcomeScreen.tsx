import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRight, Heart, Leaf, Shield } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
type Props = { navigation: WelcomeScreenNavigationProp };

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <AuthLayout title="Welcome" subtitle="Your maternal health companion, built with care.">
      <View style={styles.content}>
        {/* Feature Pills */}
        <FadeSlideIn delay={300} duration={500} direction="down">
          <View style={styles.features}>
            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#E8F8F2' }]}>
                <Heart size={18} color={theme.colors.primaryDark} strokeWidth={2.5} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="headline" color={theme.colors.textHigh} style={styles.featureTitle}>Track & Monitor</Typography>
                <Typography variant="caption1" color="#636366">Log vitals, symptoms & baby growth</Typography>
              </View>
            </View>

            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF0EF' }]}>
                <Leaf size={18} color="#E07A5F" strokeWidth={2.5} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="headline" color={theme.colors.textHigh} style={styles.featureTitle}>Ghanaian Context</Typography>
                <Typography variant="caption1" color="#636366">Local nutrition & ANC guidance</Typography>
              </View>
            </View>

            <View style={styles.featurePill}>
              <View style={[styles.featureIcon, { backgroundColor: '#F3EFFC' }]}>
                <Shield size={18} color="#8A5A99" strokeWidth={2.5} />
              </View>
              <View style={styles.featureTextGroup}>
                <Typography variant="headline" color={theme.colors.textHigh} style={styles.featureTitle}>Works Offline</Typography>
                <Typography variant="caption1" color="#636366">Syncs when you're back online</Typography>
              </View>
            </View>
          </View>
        </FadeSlideIn>

        {/* CTA */}
        <FadeSlideIn delay={600} duration={500} direction="up" style={styles.ctaSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Auth')} activeOpacity={0.8}>
            <FadeSlideIn delay={700} direction="right">
              <View style={styles.continueButton}>
                <Typography variant="headline" style={styles.continueText}>Get Started</Typography>
                <FadeSlideIn delay={900} zoom>
                  <View style={styles.iconCircle}>
                    <ArrowRight size={20} color="#FFF" strokeWidth={2.5} />
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
    justifyContent: 'space-between',
  },
  features: {
    gap: 16,
    marginTop: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Translucent white pill over glass
    borderRadius: 20,
    padding: 16,
    gap: 16,
    // Refined subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextGroup: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  ctaSection: {
    alignItems: 'flex-end',
    marginTop: 48,
    paddingBottom: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
    paddingLeft: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Stark black Apple CTA
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glass over the black button
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
});

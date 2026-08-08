import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <AuthLayout title="Welcome" showWavyHeader={true}>
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).springify().damping(12)}>
          <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
            Your maternal health journey, seamlessly guided and supported every step of the way. Connect, track, and bloom.
          </Typography>
        </Animated.View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Animated.View entering={FadeInRight.delay(400).springify().damping(12)} style={styles.continueButton}>
              <Typography variant="body" style={styles.continueText}>Continue</Typography>
              <Animated.View entering={ZoomIn.delay(600).springify()} style={styles.iconCircle}>
                <ArrowRight size={18} color="#FFF" strokeWidth={2.5} />
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  subtitle: {
    lineHeight: 28,
    marginBottom: theme.spacing[8],
    fontSize: 16,
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing[6],
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: theme.spacing[2],
    paddingLeft: theme.spacing[4],
  },
  continueText: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.textDark || '#1A1A1A',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.accentPink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.accentPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }
});

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { ArrowRight } from 'lucide-react-native';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <AuthLayout title="Welcome">
      <View style={styles.content}>
        <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
          Your maternal health journey, seamlessly guided and supported every step of the way. Connect, track, and bloom.
        </Typography>
        
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.continueButton}>
            <Typography variant="body" style={styles.continueText}>Continue</Typography>
            <View style={styles.iconCircle}>
              <ArrowRight size={18} color="#FFF" />
            </View>
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
    lineHeight: 24,
    marginBottom: theme.spacing[8],
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
    gap: 12,
  },
  continueText: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.textMedium,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.accentPink,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

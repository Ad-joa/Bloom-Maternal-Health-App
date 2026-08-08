import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { registerUser } from '../api/api';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';
import { BounceButton } from '../components/BounceButton';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type Props = { navigation: RegisterScreenNavigationProp };

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (name && email && password) {
      setLoading(true);
      try {
        const response = await registerUser({ name, email, password });
        if (response && response.id) {
          navigation.navigate('Onboarding', { user: response });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Simple password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: 'transparent', width: '0%' };
    if (password.length < 6) return { label: 'Weak', color: '#FF3B30', width: '33%' };
    if (password.length < 10) return { label: 'Good', color: '#FF9500', width: '66%' };
    return { label: 'Strong', color: '#34C759', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <AuthLayout title="Create Account" subtitle="Begin your journey with Bloom. We'll guide you every step.">
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Typography variant="footnote" color="#8E8E93" style={styles.inputLabel}>Full Name</Typography>
          <View style={styles.inputRow}>
            <User size={18} color="#C7C7CC" strokeWidth={1.8} />
            <TextInput
              placeholder="Jane Doe"
              value={name}
              onChangeText={setName}
              containerStyle={styles.inputContainerOverride}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Typography variant="footnote" color="#8E8E93" style={styles.inputLabel}>Email Address</Typography>
          <View style={styles.inputRow}>
            <Mail size={18} color="#C7C7CC" strokeWidth={1.8} />
            <TextInput
              placeholder="demo@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainerOverride}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Typography variant="footnote" color="#8E8E93" style={styles.inputLabel}>Password</Typography>
          <View style={styles.inputRow}>
            <Lock size={18} color="#C7C7CC" strokeWidth={1.8} />
            <TextInput
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              containerStyle={styles.inputContainerOverride}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? <EyeOff size={18} color="#C7C7CC" strokeWidth={1.8} /> : <Eye size={18} color="#C7C7CC" strokeWidth={1.8} />}
            </TouchableOpacity>
          </View>
          {/* Password Strength Bar */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthTrack}>
                <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
              </View>
              <Typography variant="caption2" color={strength.color}>{strength.label}</Typography>
            </View>
          )}
        </View>

        {/* Sign Up Button */}
        <BounceButton onPress={handleRegister} disabled={loading} style={styles.signUpButton}>
          <View style={styles.signUpButtonInner}>
            <Typography variant="headline" color="#FFFFFF" style={styles.signUpButtonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Typography>
            {!loading && (
              <View style={styles.signUpButtonArrow}>
                <ArrowRight size={16} color={theme.colors.accentPink} strokeWidth={2.5} />
              </View>
            )}
          </View>
        </BounceButton>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Typography variant="caption1" color="#C7C7CC" style={styles.orText}>or continue with</Typography>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Typography variant="title3" style={{ lineHeight: 24 }}>🍎</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Typography variant="title3" style={{ lineHeight: 24 }}>📧</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Typography variant="title3" style={{ lineHeight: 24 }}>📱</Typography>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyRow}>
          <Shield size={14} color="#C7C7CC" strokeWidth={1.5} />
          <Typography variant="caption2" color="#AEAEB2" style={styles.privacyText}>
            Your data is encrypted and protected under Ghana's Data Protection Act.
          </Typography>
        </View>
      </View>

      {/* Footer */}
      <FadeSlideIn delay={500} duration={400} direction="up" style={styles.footer}>
        <Typography variant="footnote" color="#8E8E93">
          Already have an account?{' '}
        </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.6}>
          <Typography variant="footnote" style={styles.linkText}>
            Sign in
          </Typography>
        </TouchableOpacity>
      </FadeSlideIn>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  inputContainerOverride: {
    flex: 1,
    marginBottom: 0,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  signUpButton: {
    backgroundColor: theme.colors.accentPink,
    borderRadius: 16,
    height: 56,
    marginTop: 4,
    shadowColor: theme.colors.accentPink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  signUpButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10,
  },
  signUpButtonText: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 0.3,
    fontSize: 17,
  },
  signUpButtonArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },
  orText: {
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  privacyText: {
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    paddingBottom: 8,
  },
  linkText: {
    fontFamily: theme.typography.families.bodySemibold,
    color: theme.colors.accentPink,
    letterSpacing: 0.1,
  },
});

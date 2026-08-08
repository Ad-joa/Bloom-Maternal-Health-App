import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { loginUser } from '../api/api';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BounceButton } from '../components/BounceButton';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type Props = { navigation: LoginScreenNavigationProp };

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);
      try {
        const response = await loginUser({ email, password });
        if (response.user) {
          if (!response.user.trimester || !response.user.due_date) {
            navigation.navigate('Onboarding', { user: response.user });
          } else {
            login(response.user);
          }
        }
      } catch (error) {
        console.error("Login failed", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to Bloom. Enter your details below.">
      {/* Form Fields */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Typography variant="footnote" color="#8E8E93" style={styles.inputLabel}>Email</Typography>
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

        <View style={styles.inputGroup}>
          <Typography variant="footnote" color="#8E8E93" style={styles.inputLabel}>Password</Typography>
          <View style={styles.inputRow}>
            <Lock size={18} color="#C7C7CC" strokeWidth={1.8} />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              containerStyle={styles.inputContainerOverride}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? <EyeOff size={18} color="#C7C7CC" strokeWidth={1.8} /> : <Eye size={18} color="#C7C7CC" strokeWidth={1.8} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Row */}
        <View style={styles.optionsRow}>
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)} activeOpacity={0.7}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <View style={styles.checkboxDot} />}
            </View>
            <Typography variant="caption1" color="#636366" style={{ letterSpacing: 0.1 }}>Remember Me</Typography>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <Typography variant="caption1" color={theme.colors.accentPink} style={{ fontFamily: theme.typography.families.bodySemibold, letterSpacing: 0.1 }}>
              Forgot Password?
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <BounceButton onPress={handleLogin} disabled={loading} style={styles.loginButton}>
          <View style={styles.loginButtonInner}>
            <Typography variant="headline" color="#FFFFFF" style={styles.loginButtonText}>
              {loading ? 'Signing in...' : 'Login'}
            </Typography>
            {!loading && (
              <View style={styles.loginButtonArrow}>
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
      </View>

      {/* Footer */}
      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.footer}>
        <Typography variant="footnote" color="#8E8E93">
          Don't have an account?{' '}
        </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.6}>
          <Typography variant="footnote" style={styles.linkText}>
            Sign up
          </Typography>
        </TouchableOpacity>
      </Animated.View>
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: theme.colors.accentPink,
    backgroundColor: theme.colors.accentPink,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
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
  loginButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10,
  },
  loginButtonText: {
    fontFamily: theme.typography.families.bodySemibold,
    letterSpacing: 0.3,
    fontSize: 17,
  },
  loginButtonArrow: {
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

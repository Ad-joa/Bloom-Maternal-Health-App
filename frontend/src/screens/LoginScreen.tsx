import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { loginUser } from '../api/api';
import { Mail, Lock, Apple } from 'lucide-react-native';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <AuthLayout title="Sign In" subtitle="Welcome back! Please enter your details.">
      <View style={styles.form}>
        <TextInput
          leftIcon={<Mail size={20} color="#B0B0B0" strokeWidth={2} />}
          label="Email Address"
          placeholder="demo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          leftIcon={<Lock size={20} color="#B0B0B0" strokeWidth={2} />}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <View style={styles.optionsRow}>
          <TouchableOpacity style={styles.checkboxRow}>
            <View style={styles.checkbox} />
            <Typography variant="caption1" color={theme.colors.textHigh}>Remember Me</Typography>
          </TouchableOpacity>
          <TouchableOpacity>
            <Typography variant="caption1" color={theme.colors.accentPink}>Forgot Password?</Typography>
          </TouchableOpacity>
        </View>
        
        <Button 
          title="Login" 
          onPress={handleLogin} 
          style={styles.submitButton}
          loading={loading}
        />

        <View style={styles.socialContainer}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Typography variant="caption1" color="#B0B0B0" style={styles.orText}>OR</Typography>
            <View style={styles.divider} />
          </View>
          <TouchableOpacity style={styles.socialButton}>
            <Apple size={22} color={theme.colors.textHigh} />
            <Typography variant="body" color={theme.colors.textHigh} style={[styles.socialText, { fontFamily: theme.typography.families.bodyBold }]}>
              Continue with Apple
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Typography variant="caption1" color={theme.colors.textMedium}>
          Don't have an Account?{' '}
        </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Typography variant="caption1" style={styles.linkText}>
            Sign up
          </Typography>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing[5],
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.accentPink,
    backgroundColor: theme.colors.surfaceVariant,
  },
  submitButton: {
    marginTop: theme.spacing[2],
    backgroundColor: theme.colors.accentPink,
    borderRadius: 30,
    height: 52,
  },
  socialContainer: {
    marginTop: theme.spacing[4],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[5],
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  orText: {
    paddingHorizontal: theme.spacing[3],
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FAFAFA',
  },
  socialText: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing[8],
  },
  linkText: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.accentPink,
  }
});

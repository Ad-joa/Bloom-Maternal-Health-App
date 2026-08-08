import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { registerUser } from '../api/api';
import { Mail, Lock, User, Apple } from 'lucide-react-native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <AuthLayout title="Create Account" subtitle="Start your maternal health journey today.">
      <View style={styles.form}>
        <TextInput
          leftIcon={<User size={20} color="#B0B0B0" strokeWidth={2} />}
          label="Full Name"
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Create a strong password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button 
          title="Sign Up" 
          onPress={handleRegister} 
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
          Already have an Account?{' '}
        </Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Typography variant="caption1" style={styles.linkText}>
            Sign in
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

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
    <AuthLayout title="Sign in">
      <View style={styles.form}>
        <TextInput
          label="Email"
          placeholder="demo@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          placeholder="enter your password"
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
    gap: theme.spacing[4],
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
    gap: 6,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.accentPink,
    backgroundColor: theme.colors.surfaceVariant,
  },
  submitButton: {
    marginTop: theme.spacing[2],
    backgroundColor: theme.colors.accentPink,
    borderRadius: 24,
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

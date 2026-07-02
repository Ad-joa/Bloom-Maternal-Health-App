import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';

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
            // User hasn't finished onboarding
            navigation.navigate('Onboarding', { user: response.user });
          } else {
            login(response.user);
          }
        }
      } catch (error) {
        console.error("Login failed", error);
        // In a real app, show an alert here
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.primaryDark}>
              Welcome Back
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
              Sign in to continue your journey
            </Typography>
          </View>
          
          <View style={styles.form}>
            <TextInput
              label="Email Address"
              placeholder="jane@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <Button 
              title="Log In" 
              onPress={handleLogin} 
              style={styles.submitButton}
            />
          </View>
          
          <View style={styles.footer}>
            <Typography variant="body" color={theme.colors.textMedium}>
              Don't have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Typography variant="body" style={styles.linkText}>
                Sign Up
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  subtitle: {
    marginTop: theme.spacing[1],
  },
  form: {
    gap: theme.spacing[2],
  },
  submitButton: {
    marginTop: theme.spacing[4],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
  },
  linkText: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.primary,
  }
});

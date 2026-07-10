import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { registerUser } from '../api/api';

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
          // Pass the created user to onboarding
          navigation.navigate('Onboarding', { user: response });
        }
      } catch (error) {
        console.error(error);
        // show alert in real app
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
          <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
            <Typography variant="largeTitle" color={theme.colors.primaryDark}>
              Create Account
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} style={styles.subtitle}>
              Start your maternal health journey today
            </Typography>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.form}>
            <TextInput
              label="Full Name"
              placeholder="Jane Doe"
              value={name}
              onChangeText={setName}
            />
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
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <Button 
              title="Sign Up" 
              onPress={handleRegister} 
              style={styles.submitButton}
            />
          </Animated.View>
          
          <View style={styles.footer}>
            <Typography variant="body" color={theme.colors.textMedium}>
              Already have an account?{' '}
            </Typography>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Typography variant="body" style={styles.linkText}>
                Log In
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

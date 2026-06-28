import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleRegister = () => {
    // In a real app, you would validate and call an API to create the user here
    if (name && email && password) {
      navigation.navigate('Onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your maternal health journey today</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textMedium}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textMedium}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textMedium}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing[4],
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
    fontSize: theme.typography.sizes.largeTitle,
    color: theme.colors.textHigh,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMedium,
    marginBottom: theme.spacing[6],
  },
  form: {
    gap: theme.spacing[3],
  },
  input: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textHigh,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    marginTop: theme.spacing[2],
  },
  primaryButtonText: {
    fontFamily: theme.typography.families.bodyBold,
    color: '#fff',
    fontSize: theme.typography.sizes.body,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing[6],
  },
  footerText: {
    fontFamily: theme.typography.families.bodyRegular,
    color: theme.colors.textMedium,
  },
  footerLink: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.primary,
  },
});

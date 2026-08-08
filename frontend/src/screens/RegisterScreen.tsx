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
    <AuthLayout title="Sign up">
      <View style={styles.form}>
        <TextInput
          label="Full Name"
          placeholder="enter your name"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="create a strong password"
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
    gap: theme.spacing[4],
  },
  submitButton: {
    marginTop: theme.spacing[4],
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

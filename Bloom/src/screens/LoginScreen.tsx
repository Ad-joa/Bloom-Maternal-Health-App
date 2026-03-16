import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    // Basic validation
    let newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      login();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ScreenHeader title="Welcome Back" subtitle="Log in to your Bloom account" />
          
          <View style={styles.form}>
            <InputField
              label="Email Address"
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <InputField
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <AppButton 
              title="Login" 
              onPress={handleLogin} 
              loading={isLoading} 
              style={styles.loginButton}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  form: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textLight,
  },
  linkText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;

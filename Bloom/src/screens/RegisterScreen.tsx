import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import InputField from '../components/InputField';
import AppButton from '../components/AppButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../hooks/useAuth';

const RegisterScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    lmpDate: '', // Last Menstrual Period
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    let newErrors: any = {};
    if (!form.name) newErrors.name = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.lmpDate) newErrors.lmpDate = 'LMP date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    
    // Mock register delay
    setTimeout(() => {
      setIsLoading(false);
      login();
    }, 1500);
  };

  const updateForm = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ScreenHeader title="Create Account" subtitle="Join Bloom for a supported journey" showBack />
          
          <View style={styles.form}>
            <InputField
              label="Full Name"
              placeholder="Jane Doe"
              value={form.name}
              onChangeText={(val) => updateForm('name', val)}
              error={errors.name}
            />
            
            <InputField
              label="Email Address"
              placeholder="jane@example.com"
              value={form.email}
              onChangeText={(val) => updateForm('email', val)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Phone Number"
              placeholder="+1 234 567 8900"
              value={form.phone}
              onChangeText={(val) => updateForm('phone', val)}
              error={errors.phone}
              keyboardType="phone-pad"
            />
            
            <InputField
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChangeText={(val) => updateForm('password', val)}
              error={errors.password}
              secureTextEntry
            />

            <InputField
              label="Confirm Password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChangeText={(val) => updateForm('confirmPassword', val)}
              error={errors.confirmPassword}
              secureTextEntry
            />

            <InputField
              label="Last Menstrual Period (LMP)"
              placeholder="YYYY-MM-DD"
              value={form.lmpDate}
              onChangeText={(val) => updateForm('lmpDate', val)}
              error={errors.lmpDate}
              // In a real app, use a proper DatePicker
            />
            
            <AppButton 
              title="Register" 
              onPress={handleRegister} 
              loading={isLoading} 
              style={styles.registerButton}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
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
    marginTop: Spacing.lg,
  },
  registerButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
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

export default RegisterScreen;

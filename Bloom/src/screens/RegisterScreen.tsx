import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Sun } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    lmpDate: '',
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
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            
            <View style={styles.decorativeContainer}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlurView 
                  key={i} 
                  intensity={20} 
                  style={[styles.blurBar, { left: (i - 1) * 40 }]} 
                />
              ))}
              <View style={styles.orangeCircle} />
              <View style={styles.whiteOval} />
            </View>

            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Expert guidance for Every Trimester.
              </Text>
            </View>
          </View>
        </View>

        {/* Form Section */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formSection}
        >
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              {/* Using Sun instead of Sunburst if not found, but lucide uses Sun for that look usually */}
              <Sun size={40} color={Colors.brandOrange} />
            </View>

            <Text style={styles.welcomeTitle}>Get Started</Text>
            <Text style={styles.welcomeSubtitle}>
              Join Bloom for a supported journey
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Jane Doe"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={(val) => updateForm('name', val)}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="jane@example.com"
                placeholderTextColor="#999"
                value={form.email}
                onChangeText={(val) => updateForm('email', val)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+1 234 567 8900"
                placeholderTextColor="#999"
                value={form.phone}
                onChangeText={(val) => updateForm('phone', val)}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Menstrual Period (LMP)</Text>
              <TextInput
                style={[styles.input, errors.lmpDate && styles.inputError]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                value={form.lmpDate}
                onChangeText={(val) => updateForm('lmpDate', val)}
              />
              {errors.lmpDate && <Text style={styles.errorText}>{errors.lmpDate}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={form.password}
                onChangeText={(val) => updateForm('password', val)}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={form.confirmPassword}
                onChangeText={(val) => updateForm('confirmPassword', val)}
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating account...' : 'Create a new account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    height: height * 0.3,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroOverlay: {
    flex: 1,
    padding: 32,
    justifyContent: 'flex-end',
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  blurBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  orangeCircle: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f97316',
    opacity: 0.8,
  },
  whiteOval: {
    position: 'absolute',
    bottom: -30,
    left: 40,
    width: 100,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  heroTextContainer: {
    zIndex: 10,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  formSection: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 32,
  },
  formContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: Colors.brandOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.brandOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  linkText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;

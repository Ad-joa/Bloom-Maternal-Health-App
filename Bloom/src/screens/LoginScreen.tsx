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
import Sun from 'lucide-react-native/dist/cjs/icons/sun';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    let newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!password) newErrors.password = 'Password is required';

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

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Left/Top Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroOverlay}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            
            {/* Abstract Decorative Elements */}
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
                Your trusted partner for a healthy, happy pregnancy.
              </Text>
            </View>
          </View>
        </View>

        {/* Right/Bottom Form Section */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formSection}
        >
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Sun size={40} color={Colors.brandOrange} />
            </View>

            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Log in to your Bloom account
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="jane@bloom.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Logging in...' : 'Log in to account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Register</Text>
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
    height: height * 0.4,
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
  loginButton: {
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
  loginButtonText: {
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

export default LoginScreen;

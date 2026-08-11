import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { TextInput } from '../components/TextInput';
import { Typography } from '../components/Typography';
import { AuthLayout } from '../components/AuthLayout';
import { loginUser, registerUser } from '../api/api';
import { 
  Mail, Lock, User, Eye, EyeOff, Shield, AlertTriangle, KeyRound, Phone, CheckCircle 
} from 'lucide-react-native';
import { FadeSlideIn } from '../components/FadeSlideIn';

// --- Types ---
type AuthMode = 'login' | 'signup' | 'reset';
type RegistrationStep = 'details' | 'verification' | 'complete';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth' | 'Welcome'>;
type Props = { navigation: AuthScreenNavigationProp };

// --- Password Strength Utility ---
interface PasswordStrength {
  score: number;
  feedback: string[];
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  };

  const score = Object.values(requirements).filter(Boolean).length;
  const feedback: string[] = [];

  if (!requirements.length) feedback.push('At least 8 characters');
  if (!requirements.uppercase) feedback.push('One uppercase letter');
  if (!requirements.lowercase) feedback.push('One lowercase letter');
  if (!requirements.number) feedback.push('One number');
  if (!requirements.special) feedback.push('One special character');

  return { score, feedback };
};

export default function AuthScreen({ navigation }: Props) {
  // State
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    rememberMe: false,
    verificationCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const { login } = useAuth();

  // --- Handlers ---
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (authMode === 'signup' && registrationStep === 'details') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    } else if (authMode === 'login') {
      if (!formData.password) newErrors.password = 'Password is required';
    } else if (authMode === 'signup' && registrationStep === 'verification') {
      if (formData.verificationCode.length !== 6) newErrors.verificationCode = 'Code must be 6 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const response = await loginUser({ email: formData.email, password: formData.password });
        if (response && response.user) {
          login(response.user);
        }
      } else if (authMode === 'signup') {
        if (registrationStep === 'details') {
          // Move to verification step (Simulated for now, would actually call register API)
          const response = await registerUser({ 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
          });
          if (response && response.id) {
             setRegisteredUser(response);
             setRegistrationStep('complete');
          }
        }
      } else if (authMode === 'reset') {
        // Simulate password reset
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAuthMode('login');
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.detail || 'Authentication failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const strength = calculatePasswordStrength(formData.password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 1) return '#FF3B30'; // red
    if (score <= 2) return '#FF9500'; // orange
    if (score <= 3) return '#FFCC00'; // yellow
    if (score <= 4) return '#34C759'; // green
    return '#007AFF'; // blue
  };

  // --- Render Sections ---
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    return (
      <View style={styles.strengthContainer}>
        <View style={styles.strengthRow}>
          <View style={styles.strengthTrack}>
            <View style={[
              styles.strengthFill, 
              { width: `${(strength.score / 5) * 100}%`, backgroundColor: getStrengthColor(strength.score) }
            ]} />
          </View>
        </View>
        {strength.feedback.length > 0 && (
          <View style={styles.feedbackGrid}>
            {strength.feedback.map((item, idx) => (
              <View key={idx} style={styles.feedbackItem}>
                <AlertTriangle size={12} color="#FF9500" />
                <Typography variant="caption2" color="#FF9500">{item}</Typography>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderReset = () => (
    <FadeSlideIn delay={100} duration={400} direction="right" style={styles.formContainer}>
      <View style={styles.iconHeader}>
        <KeyRound size={48} color="#000" strokeWidth={1.5} />
        <Typography variant="title3" style={{ marginTop: 12, fontFamily: theme.typography.families.headingBold }}>Password Recovery</Typography>
        <Typography variant="footnote" color="#636366" style={{ textAlign: 'center', marginTop: 4 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
      </View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputRow, errors.email && styles.inputError]}>
          <Mail size={18} color="#8E8E93" />
          <TextInput
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(val) => handleInputChange('email', val)}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainerOverride}
          />
        </View>
        {errors.email && <Typography variant="caption2" color="#FF3B30">{errors.email}</Typography>}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Typography variant="headline" color="#FFF">Send Reset Link</Typography>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setAuthMode('login')}>
        <Typography variant="footnote" color="#000" style={{ fontFamily: theme.typography.families.bodySemibold }}>Back to Login</Typography>
      </TouchableOpacity>
    </FadeSlideIn>
  );

  const renderVerification = () => (
    <FadeSlideIn delay={100} duration={400} direction="right" style={styles.formContainer}>
       <View style={styles.iconHeader}>
        <Mail size={48} color="#000" strokeWidth={1.5} />
        <Typography variant="title3" style={{ marginTop: 12, fontFamily: theme.typography.families.headingBold }}>Verify Your Email</Typography>
        <Typography variant="footnote" color="#636366" style={{ textAlign: 'center', marginTop: 4 }}>
          We've sent a 6-digit code to {formData.email}
        </Typography>
      </View>

      <View style={styles.inputGroup}>
        <View style={[styles.inputRow, { justifyContent: 'center' }]}>
          <TextInput
            placeholder="000000"
            value={formData.verificationCode}
            onChangeText={(val) => handleInputChange('verificationCode', val.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center', fontFamily: theme.typography.families.headingBold }}
            containerStyle={styles.inputContainerOverride}
          />
        </View>
        {errors.verificationCode && <Typography variant="caption2" color="#FF3B30" style={{ textAlign: 'center' }}>{errors.verificationCode}</Typography>}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isLoading || formData.verificationCode.length !== 6}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Typography variant="headline" color="#FFF">Verify Email</Typography>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setRegistrationStep('details')}>
        <Typography variant="footnote" color="#000" style={{ fontFamily: theme.typography.families.bodySemibold }}>Back to Details</Typography>
      </TouchableOpacity>
    </FadeSlideIn>
  );

  const renderComplete = () => (
    <FadeSlideIn delay={100} duration={400} direction="right" style={styles.formContainer}>
      <View style={styles.iconHeader}>
        <CheckCircle size={64} color="#34C759" strokeWidth={1.5} />
        <Typography variant="title2" style={{ marginTop: 16, fontFamily: theme.typography.families.headingBold }}>Welcome Aboard!</Typography>
        <Typography variant="footnote" color="#636366" style={{ textAlign: 'center', marginTop: 8 }}>
          Your account has been created successfully.
        </Typography>
      </View>

      <TouchableOpacity style={[styles.primaryButton, { marginTop: 24 }]} onPress={() => login(registeredUser)}>
        <Typography variant="headline" color="#FFF">Continue to Setup</Typography>
      </TouchableOpacity>
    </FadeSlideIn>
  );

  const renderAuth = () => (
    <FadeSlideIn delay={100} duration={400} direction="right" style={styles.formContainer}>
      {/* Mode Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, authMode === 'login' && styles.toggleBtnActive]}
          onPress={() => setAuthMode('login')}
        >
          <Typography variant="footnote" style={{ fontFamily: authMode === 'login' ? theme.typography.families.bodySemibold : theme.typography.families.bodyRegular }}>Login</Typography>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, authMode === 'signup' && styles.toggleBtnActive]}
          onPress={() => { setAuthMode('signup'); setRegistrationStep('details'); }}
        >
          <Typography variant="footnote" style={{ fontFamily: authMode === 'signup' ? theme.typography.families.bodySemibold : theme.typography.families.bodyRegular }}>Sign Up</Typography>
        </TouchableOpacity>
      </View>

      {errors.general && (
        <View style={styles.errorBox}>
          <AlertTriangle size={16} color="#FF3B30" />
          <Typography variant="caption1" color="#FF3B30">{errors.general}</Typography>
        </View>
      )}

      <View style={styles.inputsWrapper}>
        {authMode === 'signup' && (
          <View style={styles.inputGroup}>
            <View style={[styles.inputRow, errors.name && styles.inputError]}>
              <User size={18} color="#8E8E93" />
              <TextInput
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(val) => handleInputChange('name', val)}
                containerStyle={styles.inputContainerOverride}
              />
            </View>
            {errors.name && <Typography variant="caption2" color="#FF3B30">{errors.name}</Typography>}
          </View>
        )}

        <View style={styles.inputGroup}>
          <View style={[styles.inputRow, errors.email && styles.inputError]}>
            <Mail size={18} color="#8E8E93" />
            <TextInput
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(val) => handleInputChange('email', val)}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputContainerOverride}
            />
          </View>
          {errors.email && <Typography variant="caption2" color="#FF3B30">{errors.email}</Typography>}
        </View>

        <View style={styles.inputGroup}>
          <View style={[styles.inputRow, errors.password && styles.inputError]}>
            <Lock size={18} color="#8E8E93" />
            <TextInput
              placeholder="Password"
              value={formData.password}
              onChangeText={(val) => handleInputChange('password', val)}
              secureTextEntry={!showPassword}
              containerStyle={styles.inputContainerOverride}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPassword ? <EyeOff size={18} color="#8E8E93" /> : <Eye size={18} color="#8E8E93" />}
            </TouchableOpacity>
          </View>
          {errors.password && <Typography variant="caption2" color="#FF3B30">{errors.password}</Typography>}
          {authMode === 'signup' && renderPasswordStrength()}
        </View>

        {authMode === 'signup' && (
          <View style={styles.inputGroup}>
            <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
              <Shield size={18} color="#8E8E93" />
              <TextInput
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(val) => handleInputChange('confirmPassword', val)}
                secureTextEntry={!showConfirmPassword}
                containerStyle={styles.inputContainerOverride}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                {showConfirmPassword ? <EyeOff size={18} color="#8E8E93" /> : <Eye size={18} color="#8E8E93" />}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Typography variant="caption2" color="#FF3B30">{errors.confirmPassword}</Typography>}
          </View>
        )}

        {authMode === 'signup' && (
          <View style={styles.inputGroup}>
            <View style={[styles.inputRow, errors.phone && styles.inputError]}>
              <Phone size={18} color="#8E8E93" />
              <TextInput
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChangeText={(val) => handleInputChange('phone', val)}
                keyboardType="phone-pad"
                containerStyle={styles.inputContainerOverride}
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.optionsRow}>
        {authMode === 'login' ? (
          <>
            <TouchableOpacity onPress={() => handleInputChange('rememberMe', !formData.rememberMe)} style={styles.checkboxRow}>
              <View style={[styles.checkbox, formData.rememberMe && styles.checkboxActive]}>
                {formData.rememberMe && <View style={styles.checkboxDot} />}
              </View>
              <Typography variant="caption1" color="#636366">Remember me</Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAuthMode('reset')}>
              <Typography variant="caption1" style={{ color: '#000', fontFamily: theme.typography.families.bodySemibold }}>Forgot password?</Typography>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <TouchableOpacity onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)} style={styles.checkboxRow}>
              <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxActive]}>
                {formData.agreeToTerms && <View style={styles.checkboxDot} />}
              </View>
              <Typography variant="caption2" color="#636366">I agree to the Terms of Service</Typography>
            </TouchableOpacity>
            {errors.agreeToTerms && <Typography variant="caption2" color="#FF3B30" style={{ marginTop: 4 }}>{errors.agreeToTerms}</Typography>}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Typography variant="headline" color="#FFF">{authMode === 'login' ? 'Sign In' : 'Create Account'}</Typography>}
      </TouchableOpacity>
    </FadeSlideIn>
  );

  let title = "Welcome Back";
  let subtitle = "Sign in to your account";
  if (authMode === 'signup') {
    title = "Create Account";
    subtitle = "Create a new account";
  } else if (authMode === 'reset') {
    title = "Reset Password";
    subtitle = "Recover your account access";
  }

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {authMode === 'reset' 
        ? renderReset() 
        : (authMode === 'signup' && registrationStep === 'verification') 
          ? renderVerification() 
          : (authMode === 'signup' && registrationStep === 'complete') 
            ? renderComplete() 
            : renderAuth()}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputsWrapper: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputContainerOverride: {
    flex: 1,
    marginBottom: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  strengthContainer: {
    marginTop: 4,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '48%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
});

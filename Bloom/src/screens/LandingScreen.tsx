import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Sparkles, ArrowRight } from 'lucide-react-native';
import Logo from '../components/Logo';
import { theme } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation<any>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Floating blobs animation
    const createBlobAnimation = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 4000,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          })
        ])
      ).start();
    };

    createBlobAnimation(blob1Anim, 0);
    createBlobAnimation(blob2Anim, 1000);
  }, []);

  const blob1TranslateY = blob1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30]
  });

  const blob2TranslateY = blob2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40]
  });

  const blob1Scale = blob1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1]
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background base */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#fdfbfb' }]} />
      
      {/* Animated Blobs */}
      <Animated.View style={[
        styles.blob, 
        styles.blob1,
        { transform: [{ translateY: blob1TranslateY }, { scale: blob1Scale }] }
      ]}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]} // Tropical Teal to Light Green
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View style={[
        styles.blob, 
        styles.blob2,
        { transform: [{ translateY: blob2TranslateY }] }
      ]}>
        <LinearGradient
          colors={[theme.colors.brandOrange, theme.colors.secondary]} // Powder Blush to Vanilla Custard
          style={StyleSheet.absoluteFill}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Top Section - Logo */}
        <Animated.View style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Logo size={width * 0.45} />
          <View style={styles.badgeContainer}>
            <Sparkles size={16} color={theme.colors.primary} />
            <Text style={styles.badgeText}>Premium Care</Text>
          </View>
        </Animated.View>

        {/* Bottom Section - Glass Card */}
        <Animated.View style={[
          styles.bottomSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <BlurView intensity={80} tint="light" style={styles.glassCard}>
            <Text style={styles.title}>
              Welcome to <Text style={{ color: theme.colors.primary }}>Bloom</Text>
            </Text>
            <Text style={styles.subtitle}>
              Your companion for a healthy, happy, and empowered maternal journey.
            </Text>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.colors.primary, '#e89f9f']} // Powder Blush to slightly deeper pink
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <ArrowRight size={20} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.6}
            >
              <Text style={styles.secondaryButtonText}>
                Already have an account? <Text style={styles.signInText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blob: {
    position: 'absolute',
    borderRadius: 300,
    opacity: 0.6,
  },
  blob1: {
    width: width * 1.2,
    height: width * 1.2,
    top: -width * 0.3,
    left: -width * 0.2,
  },
  blob2: {
    width: width,
    height: width,
    bottom: height * 0.1,
    right: -width * 0.3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  badgeText: {
    marginLeft: 6,
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCard: {
    borderRadius: 30,
    padding: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  primaryButton: {
    width: '100%',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    marginTop: 2,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.textLight,
    fontSize: 15,
    fontWeight: '500',
  },
  signInText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

export default LandingScreen;

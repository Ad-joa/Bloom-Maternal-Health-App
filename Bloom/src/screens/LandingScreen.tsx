import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../components/Logo';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.brandOrange + '10', '#FFFFFF']}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size={width * 0.5} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Bloom</Text>
          <Text style={styles.subtitle}>
            Your companion for a healthy and happy maternal journey.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>
              Already have an account? <Text style={{ color: theme.colors.brandOrange, fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors.brandOrange,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.colors.brandOrange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 15,
  },
});

export default LandingScreen;

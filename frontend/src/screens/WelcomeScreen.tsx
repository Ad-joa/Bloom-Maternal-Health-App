import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🌸</Text>
        </View>
        
        <Text style={styles.title}>Welcome to Bloom</Text>
        <Text style={styles.subtitle}>Your maternal health journey, supported every step of the way.</Text>
        
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
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[6],
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  title: {
    fontFamily: theme.typography.families.headingBold,
    fontSize: theme.typography.sizes.largeTitle,
    color: theme.colors.textHigh,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.families.bodyRegular,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textMedium,
    textAlign: 'center',
    marginBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing[3],
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.pill,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: theme.typography.families.bodyBold,
    color: '#fff',
    fontSize: theme.typography.sizes.body,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.families.bodyBold,
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
  },
});

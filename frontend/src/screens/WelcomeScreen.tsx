import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart } from 'lucide-react-native';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const { height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primaryLight, theme.colors.surface, theme.colors.primaryLight]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            
            <View style={styles.heroSection}>
              <View style={styles.iconContainer}>
                <Heart size={64} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <Typography variant="largeTitle" color={theme.colors.primaryDark} align="center" style={styles.title}>
                Bloom
              </Typography>
              <Typography variant="body" color={theme.colors.textMedium} align="center" style={styles.subtitle}>
                Your maternal health journey, supported every step of the way with AI.
              </Typography>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button 
                title="Get Started" 
                variant="primary" 
                onPress={() => navigation.navigate('Register')} 
                style={styles.button}
              />
              <Button 
                title="Log In" 
                variant="secondary" 
                onPress={() => navigation.navigate('Login')} 
                style={styles.button}
              />
            </View>

          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing[5],
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[6],
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    marginBottom: theme.spacing[3],
  },
  subtitle: {
    paddingHorizontal: theme.spacing[4],
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  button: {
    width: '100%',
  }
});

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const PlaceholderScreen = ({ name, navigation, showLogin }: any) => {
  const { login } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen</Text>
      {showLogin && (
        <Button title="Mock Login" onPress={() => login()} />
      )}
      {navigation && name === 'Onboarding' && (
        <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      )}
      {navigation && name === 'Login' && (
        <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      )}
    </View>
  );
};

export const OnboardingScreen = ({ navigation }: any) => <PlaceholderScreen name="Onboarding" navigation={navigation} />;
export const LoginScreen = ({ navigation }: any) => <PlaceholderScreen name="Login" navigation={navigation} showLogin />;
export const RegisterScreen = ({ navigation }: any) => <PlaceholderScreen name="Register" navigation={navigation} showLogin />;
export const HomeScreen = () => <PlaceholderScreen name="Home" />;
export const TrimesterInfoScreen = () => <PlaceholderScreen name="Trimester Info" />;
export const SymptomCheckerScreen = () => <PlaceholderScreen name="Symptom Checker" />;
export const VisitsScreen = () => <PlaceholderScreen name="Visits" />;
export const ProfileScreen = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

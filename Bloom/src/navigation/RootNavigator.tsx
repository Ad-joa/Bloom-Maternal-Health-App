import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TrimesterInfoScreen from '../screens/TrimesterInfoScreen';
import SymptomCheckerScreen from '../screens/SymptomCheckerScreen';
import VisitsScreen from '../screens/VisitsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DangerSignsScreen from '../screens/DangerSignsScreen';
import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/LandingScreen';

const AuthStack = createNativeStackNavigator();
const AppTabs = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }} initialRouteName="Landing">
    <AuthStack.Screen name="Landing" component={LandingScreen} />
    <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const TabNavigator = () => (
  <AppTabs.Navigator 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Trimester') {
          iconName = focused ? 'book' : 'book-outline';
        } else if (route.name === 'Symptoms') {
          iconName = focused ? 'medkit' : 'medkit-outline';
        } else if (route.name === 'Visits') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={26} color={color} style={{ marginTop: 10 }} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textLight,
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      tabBarBackground: () => (
        <View style={styles.blurContainer}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        </View>
      ),
      headerShown: false,
    })}
  >
    <AppTabs.Screen name="Home" component={HomeScreen} />
    <AppTabs.Screen name="Trimester" component={TrimesterInfoScreen} />
    <AppTabs.Screen name="Symptoms" component={SymptomCheckerScreen} />
    <AppTabs.Screen name="Visits" component={VisitsScreen} />
    <AppTabs.Screen name="Profile" component={ProfileScreen} />
  </AppTabs.Navigator>
);

const AppNavigator = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <AppStack.Screen name="MainTabs" component={TabNavigator} />
    <AppStack.Screen name="DangerSigns" component={DangerSignsScreen} />
  </AppStack.Navigator>
);

export const RootNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <RootStack.Screen name="Splash" component={SplashScreen} />
      {isLoggedIn ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    height: 65,
    borderTopWidth: 0,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  }
});

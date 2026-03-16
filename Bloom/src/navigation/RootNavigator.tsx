import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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

const AuthStack = createNativeStackNavigator();
const AppTabs = createBottomTabNavigator();
const AppStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
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

        return <Ionicons name={iconName} size={24} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.border,
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.surface,
      },
      headerShown: false,
    })}
  >
    <AppTabs.Screen name="Home" component={HomeScreen} />
    <AppTabs.Screen name="Trimester" component={TrimesterInfoScreen} options={{ title: 'Library' }} />
    <AppTabs.Screen name="Symptoms" component={SymptomCheckerScreen} options={{ title: 'Checker' }} />
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
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

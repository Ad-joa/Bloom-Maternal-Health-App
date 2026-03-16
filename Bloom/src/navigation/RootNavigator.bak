import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/theme';

// Placeholder screens
import { 
  OnboardingScreen, 
  LoginScreen, 
  RegisterScreen,
  HomeScreen,
  TrimesterInfoScreen,
  SymptomCheckerScreen,
  VisitsScreen,
  ProfileScreen
} from '../screens/Placeholders';

const AuthStack = createNativeStackNavigator();
const AppTabs = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <AppTabs.Navigator 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Trimester') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Symptoms') {
          iconName = focused ? 'medical' : 'medical-outline';
        } else if (route.name === 'Visits') {
          iconName = focused ? 'clipboard' : 'clipboard-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
    })}
  >
    <AppTabs.Screen name="Home" component={HomeScreen} />
    <AppTabs.Screen name="Trimester" component={TrimesterInfoScreen} options={{ title: 'Trimester Info' }} />
    <AppTabs.Screen name="Symptoms" component={SymptomCheckerScreen} options={{ title: 'Symptom Checker' }} />
    <AppTabs.Screen name="Visits" component={VisitsScreen} />
    <AppTabs.Screen name="Profile" component={ProfileScreen} />
  </AppTabs.Navigator>
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

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TrimesterScreen from './src/screens/TrimesterScreen';
import AdvisoryScreen from './src/screens/AdvisoryScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import BloomAIScreen from './src/screens/BloomAIScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LineChart, MessageCircle, Calendar, User } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  Onboarding: { user: any };
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Insights: undefined;
  BloomAI: undefined;
  Tracker: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Insights') return <LineChart size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'BloomAI') return <MessageCircle size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Tracker') return <Calendar size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Profile') return <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          return null;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMedium,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: theme.colors.primaryDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.families.bodyMedium,
          fontSize: 10,
          marginTop: 4,
        },
        headerStyle: { backgroundColor: '#fff', shadowOpacity: 0, elevation: 0 },
        headerTintColor: theme.colors.textHigh,
        headerTitleStyle: { fontFamily: theme.typography.families.headingBold },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Today', headerShown: false }} />
      <Tab.Screen name="Insights" component={InsightsScreen} options={{ title: 'Insights' }} />
      <Tab.Screen name="BloomAI" component={BloomAIScreen} options={{ title: 'Bloom AI' }} />
      <Tab.Screen name="Tracker" component={DailyLogScreen} options={{ title: 'Tracker' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated } = useAuth();
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: theme.typography.families.headingBold,
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Trimester" 
              component={TrimesterScreen} 
              options={({ route }) => ({ title: `Trimester ${route.params.trimesterId}` })}
            />
            <Stack.Screen 
              name="Advisory" 
              component={AdvisoryScreen} 
              options={{ title: 'Health Advisory' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Montserrat_400Regular,
          Montserrat_500Medium,
          Montserrat_600SemiBold,
          Montserrat_700Bold,
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_600SemiBold,
          Poppins_700Bold,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

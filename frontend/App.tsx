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
import AnalysisScreen from './src/screens/AnalysisScreen';
import BloomAIScreen from './src/screens/BloomAIScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ANCVisitScreen from './src/screens/ANCVisitScreen';
import PartnerModeScreen from './src/screens/PartnerModeScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import { BiometricGate } from './src/components/BiometricGate';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, LineChart, MessageCircle, Calendar, Users, Menu } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import * as Font from 'expo-font';
import './src/i18n';
import * as SplashScreen from 'expo-splash-screen';
import { registerForPushNotificationsAsync } from './src/utils/notifications';
import { initDatabase } from './src/utils/database';
import { startSyncEngine } from './src/utils/SyncEngine';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

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
  Profile: undefined;
  Article: { articleId: string, title: string, content: string };
  Reminders: undefined;
  ANCVisit: undefined;
  PartnerMode: undefined;
  CheckIn: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Analysis: undefined;
  Community: undefined;
  BloomAI: undefined;
  Tracker: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Analysis') return <LineChart size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Community') return <Users size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'BloomAI') return <MessageCircle size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          if (route.name === 'Tracker') return <Calendar size={size} color={color} strokeWidth={focused ? 2.5 : 2} />;
          return null;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMedium,
        tabBarBackground: () => (
          <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
        ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          borderTopWidth: 0,
          elevation: 0, // Remove elevation to let BlurView shine
          shadowColor: theme.colors.primaryDark,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.families.bodyMedium,
          fontSize: 10,
          marginTop: 4,
        },
        headerStyle: { backgroundColor: '#fff', shadowOpacity: 0, elevation: 0 },
        headerTintColor: theme.colors.textHigh,
        headerTitleStyle: { fontFamily: theme.typography.families.headingBold },
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: theme.spacing[4] }}
            onPress={() => (navigation as any).navigate('Profile')} // We can make the profile screen hold the hamburger menu links
          >
            <Menu color={theme.colors.textHigh} size={24} />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Today', headerShown: false }} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} options={{ title: 'Analysis' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Community' }} />
      <Tab.Screen name="BloomAI" component={BloomAIScreen} options={{ title: 'Bloom AI' }} />
      <Tab.Screen name="Tracker" component={DailyLogScreen} options={{ title: 'Tracker' }} />
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
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }} 
            />
            <Stack.Screen 
              name="Article" 
              component={ArticleScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Reminders" 
              component={RemindersScreen} 
              options={{ title: 'Reminders' }} 
            />
            <Stack.Screen 
              name="ANCVisit" 
              component={ANCVisitScreen} 
              options={{ title: 'ANC Visits' }} 
            />
            <Stack.Screen 
              name="PartnerMode" 
              component={PartnerModeScreen} 
              options={{ title: 'Partner Mode', headerShown: false }} 
            />
            <Stack.Screen 
              name="CheckIn" 
              component={CheckInScreen} 
              options={{ title: 'Daily Check-In' }} 
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
          Inter_400Regular,
          Inter_500Medium,
          Inter_600SemiBold,
          Inter_700Bold,
        });
        
        // Initialize SQLite Offline Database
        await initDatabase();
        
        // Request notification permissions
        await registerForPushNotificationsAsync();
        
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    
    // Start the Offline-First Sync Engine
    const unsubscribeSync = startSyncEngine();

    return () => {
      if (unsubscribeSync) unsubscribeSync();
    };
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BiometricGate>
          <Navigation />
        </BiometricGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

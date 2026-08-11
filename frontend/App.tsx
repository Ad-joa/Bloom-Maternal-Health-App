import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TrimesterScreen from './src/screens/TrimesterScreen';
import AdvisoryScreen from './src/screens/AdvisoryScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
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
import { Ionicons } from '@expo/vector-icons';
import { Home, Activity, Users, MessageCircle, CalendarDays } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './src/theme/theme';
import * as Font from 'expo-font';
import './src/i18n';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { registerForPushNotificationsAsync } from './src/utils/notifications';
import { initDatabase } from './src/utils/database';
import { startSyncEngine } from './src/utils/SyncEngine';

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Onboarding: undefined;
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

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={{
      position: 'absolute',
      backgroundColor: '#FFFFFF',
      bottom: Platform.OS === 'ios' ? 34 : 40,
      left: 24,
      right: 24,
      height: 64,
      borderRadius: 32,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    }}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
             navigation.navigate(route.name);
          }
        };

        let Icon = Home;
        if (route.name === 'Home') Icon = Home;
        if (route.name === 'Analysis') Icon = Activity;
        if (route.name === 'Community') Icon = Users;
        if (route.name === 'BloomAI') Icon = MessageCircle;
        if (route.name === 'Tracker') Icon = CalendarDays;

        return (
          <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.8} style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: isFocused ? 'rgba(192, 132, 252, 0.2)' : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Icon size={24} color={isFocused ? theme.colors.primary : '#9CA3AF'} strokeWidth={isFocused ? 2.5 : 2} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route, navigation }) => ({

        headerStyle: { backgroundColor: '#F8F9FA', shadowOpacity: 0, elevation: 0 },
        headerTintColor: theme.colors.textHigh,
        headerTitleStyle: { fontFamily: theme.typography.families.headingBold },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: theme.spacing[4] }}
            onPress={() => (navigation as any).navigate('Profile')}
          >
            <Ionicons name="menu" color={theme.colors.textHigh} size={24} />
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
  const { isAuthenticated, user } = useAuth();
  const needsOnboarding = isAuthenticated && !user?.due_date;

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
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : needsOnboarding ? (
          <>
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
              options={{ headerShown: false, title: '' }}
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
          Montserrat_400Regular,
          Montserrat_500Medium,
          Montserrat_600SemiBold,
          Montserrat_700Bold,
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
      <StatusBar style="dark" />
      <AuthProvider>
        <BiometricGate>
          <Navigation />
        </BiometricGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

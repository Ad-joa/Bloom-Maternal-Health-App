import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TrimesterScreen from './src/screens/TrimesterScreen';
import AdvisoryScreen from './src/screens/AdvisoryScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LogoScreen from './src/screens/LogoScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import GrowthVisualizerScreen from './src/screens/GrowthVisualizerScreen';
import DueDateRevealScreen from './src/screens/DueDateRevealScreen';
import AuthScreen from './src/screens/AuthScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import BloomAIScreen from './src/screens/BloomAIScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import PrivacyConsentScreen from './src/screens/PrivacyConsentScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import ANCVisitScreen from './src/screens/ANCVisitScreen';
import PartnerModeScreen from './src/screens/PartnerModeScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import EmergencyLocatorScreen from './src/screens/EmergencyLocatorScreen';
import MealPlanScreen from './src/screens/MealPlanScreen';
import RelaxationScreen from './src/screens/RelaxationScreen';
import FitnessScreen from './src/screens/FitnessScreen';
import HospitalBagScreen from './src/screens/HospitalBagScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import ResourceListScreen from './src/screens/ResourceListScreen';
import KickCounterScreen from './src/screens/KickCounterScreen';
import BreathingExerciseScreen from './src/screens/BreathingExerciseScreen';
import { BiometricGate } from './src/components/BiometricGate';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Home, Activity, Users, MessageCircle, CalendarDays, User } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View, Platform, Text, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import i18n from './src/i18n';
import { useTranslation } from 'react-i18next';
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
  GrowthVisualizer: undefined;
  Onboarding: undefined;
  DueDateReveal: { dueDate: string };
  MainTabs: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
  Profile: undefined;
  Article: { articleId: string, title: string, content: string };
  Reminders: undefined;
  ANCVisit: undefined;
  PartnerMode: undefined;
  CheckIn: undefined;
  EmergencyLocator: undefined;
  PrivacyConsent: undefined;
  MealPlan: undefined;
  Relaxation: undefined;
  Fitness: undefined;
  HospitalBag: undefined;
  HelpSupport: undefined;
  BloomAI: undefined;
  Community: undefined;
  ResourceList: { category: string; title: string };
  KickCounter: undefined;
  BreathingExercise: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tracker: undefined;
  Support: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function CustomTabBar({ state, navigation, theme, isDark }: any) {
  const { t } = useTranslation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={{
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 34 : 24,
      left: 16,
      right: 16,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 12,
    }}>
      <BlurView
        intensity={isDark ? 60 : 100}
        tint={isDark ? 'dark' : 'light'}
        style={{
          backgroundColor: isDark ? 'rgba(18,18,18,0.75)' : 'rgba(255,255,255,0.75)',
          overflow: 'hidden',
          borderRadius: 40,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 8,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
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
        let label = route.name;
        if (route.name === 'Home') { Icon = Home; label = t('actions.checkin', 'Today'); }
        if (route.name === 'Tracker') { Icon = Activity; label = t('actions.log', 'Tracker'); }
        if (route.name === 'Support') { Icon = MessageCircle; label = t('profile.helpSupport', 'Support'); }
        if (route.name === 'Profile') { Icon = User; label = 'Profile'; }

        const activeColor = theme.colors.primaryDark;
        const inactiveColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';

        return (
          <TouchableOpacity key={route.key} onPress={onPress} activeOpacity={0.8} style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4,
          }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color={isFocused ? activeColor : inactiveColor} strokeWidth={isFocused ? 2.5 : 1.8} />
              {isFocused && (
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: activeColor, position: 'absolute', bottom: -10 }} />
              )}
              {isFocused ? (
                <Text style={{ fontSize: 10, color: activeColor, marginTop: 4, fontFamily: theme.typography.families.headingBold }}>{label}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
      </BlurView>
    </View>
  );
}

const HeaderRightComponent = ({ theme, user, navigation }: any) => {
  return (
    <TouchableOpacity
      style={{ 
        marginRight: theme.spacing[4], 
        width: 36, 
        height: 36, 
        borderRadius: 18, 
        backgroundColor: theme.colors.primaryLight,
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primaryDark
      }}
      onPress={() => navigation.navigate('Profile')}
    >
      {user?.avatar ? (
        <View /> /* Image component would go here */
      ) : (
        <User size={20} color={theme.colors.primaryDark} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
};

function MainTabs() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} theme={theme} isDark={isDark} />}
      screenOptions={({ route, navigation }) => ({
        headerStyle: { backgroundColor: theme.colors.background, shadowOpacity: 0, elevation: 0 },
        headerTintColor: theme.colors.textHigh,
        headerTitleStyle: { fontFamily: theme.typography.families.headingBold },
        headerRight: () => <HeaderRightComponent theme={theme} user={user} navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Today', headerShown: false }} />
      <Tab.Screen name="Tracker" component={DailyLogScreen} options={{ title: 'Tracker', headerShown: false }} />
      <Tab.Screen name="Support" component={HelpSupportScreen} options={{ title: 'Support', headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', headerShown: false }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
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
            <Stack.Screen
              name="PrivacyConsent"
              component={PrivacyConsentScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : needsOnboarding ? (
          <>
            <Stack.Screen
              name="GrowthVisualizer"
              component={GrowthVisualizerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DueDateReveal"
              component={DueDateRevealScreen}
              options={{ 
                headerShown: false,
                presentation: 'modal', // Make it slide over nicely
                animation: 'fade', // Smooth crossfade if supported
              }}
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
              name="HelpSupport"
              component={HelpSupportScreen}
              options={{ title: 'Help & Support' }}
            />
            <Stack.Screen
              name="BloomAI"
              component={BloomAIScreen}
              options={{ title: 'Bloom AI Assistant' }}
            />
            <Stack.Screen
              name="Community"
              component={CommunityScreen}
              options={{ title: 'Community Forum' }}
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
            <Stack.Screen
              name="MealPlan"
              component={MealPlanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Relaxation"
              component={RelaxationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Fitness"
              component={FitnessScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HospitalBag"
              component={HospitalBagScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EmergencyLocator"
              component={EmergencyLocatorScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResourceList"
              component={ResourceListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KickCounter"
              component={KickCounterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="BreathingExercise"
              component={BreathingExerciseScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

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

        // Load language preference
        const savedLanguage = await AsyncStorage.getItem('@app_language');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }

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
    <View style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <BiometricGate>
              <Navigation />
              <StatusBar style="auto" />
            </BiometricGate>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
      {showLogo && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
          <LogoScreen onFinish={() => setShowLogo(false)} />
        </View>
      )}
    </View>
  );
}

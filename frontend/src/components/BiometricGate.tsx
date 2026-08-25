import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { Typography } from './Typography';
import { BounceButton } from './BounceButton';
import { Lock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const BIOMETRICS_KEY = '@app_biometrics_enabled';

interface Props {
  children: React.ReactNode;
}

export const BiometricGate: React.FC<Props> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const appState = React.useRef(AppState.currentState);
  const isAuthenticating = React.useRef(false);

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const enabledStr = await AsyncStorage.getItem(BIOMETRICS_KEY);
        const isEnabled = enabledStr === 'true';
        setBiometricsEnabled(isEnabled);
        
        if (isEnabled) {
          setIsLocked(true);
          // Try to authenticate once on startup
          authenticate();
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  // Handle AppState changes (background to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current === 'background' &&
        nextAppState === 'active'
      ) {
        // If app comes to foreground and biometrics are enabled, lock it.
        // We skip locking if we are currently authenticating (because returning from 
        // the OS FaceID prompt itself triggers an inactive->active transition).
        if (biometricsEnabled && !isAuthenticating.current) {
          setIsLocked(true);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [biometricsEnabled]);

  const authenticate = async () => {
    if (isAuthenticating.current) return;
    
    // Set flag so AppState listener knows we are in an OS prompt overlay
    isAuthenticating.current = true;
    
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsLocked(false);
      isAuthenticating.current = false;
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Bloom Maternal Health',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      setIsLocked(false);
    }
    
    // The OS prompt is closing, which triggers an inactive -> active AppState change.
    // We delay resetting the flag slightly to allow the AppState listener to fire
    // while the flag is still true, so it ignores the transition and doesn't re-lock.
    setTimeout(() => {
      isAuthenticating.current = false;
    }, 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      {isLocked && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}>
          <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={StyleSheet.absoluteFillObject} />
          <SafeAreaView style={styles.lockedContainer}>
            <Lock size={64} color={theme.colors.primaryDark} style={{ marginBottom: 24 }} />
            <Typography variant="title2" color={theme.colors.primaryDark} style={{ marginBottom: 8 }}>
              App is Locked
            </Typography>
            <Typography variant="body" color={theme.colors.textMedium} align="center" style={{ paddingHorizontal: 40, marginBottom: 32 }}>
              Your health data is protected. Please authenticate to view your logs and insights.
            </Typography>
            
            <BounceButton style={styles.unlockButton} onPress={authenticate}>
              <Typography variant="headline" color="#fff">Unlock App</Typography>
            </BounceButton>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  unlockButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
  }
});

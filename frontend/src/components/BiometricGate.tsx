import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { Typography } from './Typography';
import { BounceButton } from './BounceButton';
import { Lock } from 'lucide-react-native';

const BIOMETRICS_KEY = '@app_biometrics_enabled';

interface Props {
  children: React.ReactNode;
}

export const BiometricGate: React.FC<Props> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  const checkBiometrics = async () => {
    try {
      const enabledStr = await AsyncStorage.getItem(BIOMETRICS_KEY);
      const isEnabled = enabledStr === 'true';
      setBiometricsEnabled(isEnabled);
      
      if (isEnabled) {
        setIsLocked(true);
        authenticate();
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkBiometrics();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground!
        checkBiometrics();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setIsLocked(false);
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
  };

  if (isLocked) {
    return (
      <View style={styles.lockedContainer}>
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
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
});

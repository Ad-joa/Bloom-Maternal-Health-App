import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { BackgroundMesh } from './BackgroundMesh';

export interface ScreenWrapperProps {
  children: React.ReactNode;
  /** Whether to show the animated BackgroundMesh (default: true) */
  withMesh?: boolean;
  /** Whether the screen is nested inside a BottomTabNavigator (adjusts keyboard offset) */
  isNested?: boolean;
  /** Disable KeyboardAvoidingView for screens that don't need it */
  avoidKeyboard?: boolean;
  /** Style for the inner container */
  style?: StyleProp<ViewStyle>;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  withMesh = true,
  isNested = false,
  avoidKeyboard = true,
  style,
}) => {
  const { theme } = useTheme();

  const keyboardOffset = Platform.OS === 'ios' ? (isNested ? 180 : 90) : 0;

  const content = (
    <>
      {withMesh && <BackgroundMesh />}
      <View style={[styles.innerContainer, style]}>
        {children}
      </View>
    </>
  );

  const AvoidView = avoidKeyboard ? KeyboardAvoidingView : View;
  const avoidProps = avoidKeyboard
    ? {
        behavior: Platform.OS === 'ios' ? 'padding' as const : undefined,
        keyboardVerticalOffset: keyboardOffset,
        style: styles.container,
      }
    : { style: styles.container };

  if (isNested) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AvoidView {...avoidProps}>
          {content}
        </AvoidView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <AvoidView {...avoidProps}>
          {content}
        </AvoidView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});

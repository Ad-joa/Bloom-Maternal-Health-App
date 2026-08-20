import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

export const BackgroundMesh = () => {
  const { isDark } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Base background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#121212' : '#F9F9FB' }]} />

      {/* Soft gradient blobs — reduced opacity in dark mode */}
      <LinearGradient
        colors={isDark
          ? ['rgba(216, 122, 128, 0.12)', 'transparent']
          : ['rgba(232, 181, 219, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blob1}
      />
      <LinearGradient
        colors={isDark
          ? ['rgba(100, 157, 150, 0.1)', 'transparent']
          : ['rgba(200, 234, 235, 0.5)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.blob2}
      />
      <LinearGradient
        colors={isDark
          ? ['rgba(216, 122, 128, 0.08)', 'transparent']
          : ['rgba(244, 193, 190, 0.3)', 'transparent']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.blob3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  blob1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  blob2: {
    position: 'absolute',
    top: -50,
    right: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  blob3: {
    position: 'absolute',
    bottom: -150,
    left: -50,
    width: 450,
    height: 450,
    borderRadius: 225,
  },
});

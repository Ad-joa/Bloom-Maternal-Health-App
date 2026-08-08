import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const BackgroundMesh = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Base Light Background */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F9F9FB' }]} />
      
      {/* Large Soft Gradients to create a mesh feel */}
      <LinearGradient
        colors={['rgba(232, 181, 219, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.blob1}
      />
      <LinearGradient
        colors={['rgba(200, 234, 235, 0.5)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.blob2}
      />
      <LinearGradient
        colors={['rgba(244, 193, 190, 0.3)', 'transparent']}
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
    bottom: -100,
    left: 50,
    width: 600,
    height: 600,
    borderRadius: 300,
  }
});

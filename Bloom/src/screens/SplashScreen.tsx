import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { theme } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const { isLoggedIn, loading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (loading) return;

    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('App');
      } else {
        navigation.replace('Auth');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation, isLoggedIn, loading]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
      }}>
        <Logo size={Dimensions.get('window').width * 0.6} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFC', // Matches the SVG background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';
import AppButton from '../components/AppButton';

const { width } = Dimensions.get('window');

const PANELS = [
  {
    title: 'Welcome to Bloom',
    description: 'Your premium companion for a healthy and happy pregnancy journey.',
    color: Colors.primary,
  },
  {
    title: 'Track Your Health',
    description: 'Monitor symptoms, appointments, and trimester-specific development.',
    color: Colors.accent,
  },
  {
    title: 'Expert Guidance',
    description: 'Access curated maternal health information vetted by professionals.',
    color: Colors.success,
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {PANELS.map((panel, index) => (
          <View key={index} style={styles.panel}>
            <View style={[styles.imagePlaceholder, { backgroundColor: panel.color + '20' }]}>
               {/* Image would go here */}
               <View style={[styles.dot, { backgroundColor: panel.color, width: 100, height: 100, borderRadius: 50 }]} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{panel.title}</Text>
              <Text style={styles.description}>{panel.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {PANELS.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot, 
                activeIndex === index && styles.paginationDotActive
              ]} 
            />
          ))}
        </View>
        
        <AppButton 
          title={activeIndex === PANELS.length - 1 ? 'Get Started' : 'Continue'} 
          onPress={() => {
            if (activeIndex === PANELS.length - 1) {
              navigation.navigate('Login');
            } else {
              // Scroll to next panel logic would go here if needed, 
              // but standard is tap or swipe.
              navigation.navigate('Login');
            }
          }} 
          style={styles.button}
        />
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  panel: {
    width,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  imagePlaceholder: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 20,
  },
  button: {
    width: '100%',
  },
  skipButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  skipText: {
    ...Typography.body,
    color: Colors.textLight,
  },
});

export default OnboardingScreen;

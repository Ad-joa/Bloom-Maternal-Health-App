import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type Props = {
  route: any;
  navigation: any;
};

export default function ArticleScreen({ route, navigation }: Props) {
  const { title, content } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#ffffff', '#fdf2f4', '#fce7eb']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Placeholder for an article header image */}
        <Animated.View style={[styles.headerImagePlaceholder, { opacity: fadeAnim }]}>
          <Typography variant="title2" color="#fff" style={styles.imageText}>
            Bloom Guide
          </Typography>
        </Animated.View>

        <Animated.View style={[
          styles.contentContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.title}>
            {title}
          </Typography>
          <Typography variant="subhead" color={theme.colors.primaryDark} style={styles.author}>
            By Dr. Bloom Medical Team
          </Typography>

          {/* Dummy Rich Text Content */}
          <Typography variant="body" color={theme.colors.textHigh} style={styles.paragraph}>
            Pregnancy is an incredible journey filled with constant changes. It’s important to prioritize your health, not just for your growing baby, but for yourself. 
          </Typography>
          
          <Typography variant="title3" color={theme.colors.textHigh} style={styles.subtitle}>
            1. Listen to Your Body
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium} style={styles.paragraph}>
            Rest when you need to rest. Your body is working overtime to build a new life, and fatigue is a natural response. Don’t feel guilty for taking that afternoon nap.
          </Typography>

          <View style={styles.pullQuote}>
            <Typography variant="bodyBold" color={theme.colors.primaryDark} style={{ fontStyle: 'italic' }}>
              "The most important thing she'd learned over the years was that there was no way to be a perfect mother and a million ways to be a good one."
            </Typography>
          </View>

          <Typography variant="title3" color={theme.colors.textHigh} style={styles.subtitle}>
            2. Stay Hydrated
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium} style={styles.paragraph}>
            Water plays a crucial role in the healthy development of your baby. It helps form the placenta, which is what your baby relies on to receive nutrients during pregnancy.
          </Typography>

          <Typography variant="body" color={theme.colors.textMedium} style={styles.paragraph}>
            {content}
          </Typography>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    opacity: 0.8,
  },
  contentContainer: {
    padding: theme.spacing[5],
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    marginTop: -30, // Overlap the image slightly
    minHeight: height - 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    marginBottom: theme.spacing[2],
    lineHeight: 40,
  },
  author: {
    marginBottom: theme.spacing[6],
  },
  subtitle: {
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[2],
  },
  paragraph: {
    lineHeight: 26,
    marginBottom: theme.spacing[4],
  },
  pullQuote: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    paddingLeft: theme.spacing[4],
    marginVertical: theme.spacing[4],
  }
});

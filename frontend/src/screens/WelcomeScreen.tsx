import React, { useRef, useState } from 'react';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { BounceButton } from '../components/BounceButton';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Your Pregnancy, Guided.',
    description: 'Bloom is your personal maternal health companion, designed specifically for your journey.',
    animation: require('../../assets/animations/baby.json'),
  },
  {
    id: '2',
    title: 'Track Vitals & Baby Growth',
    description: 'Log your symptoms, mood, and daily vitals. Keep a beautiful record as your baby grows.',
    animation: require('../../assets/animations/baby_hide.json'),
  },
  {
    id: '3',
    title: 'Ghanaian Context',
    description: 'Local nutrition advice, ANC reminders, and culturally relevant insights for Ghanaian mothers.',
    animation: require('../../assets/animations/Ghana flag Lottie JSON animation.json'),
  },
  {
    id: '4',
    title: 'Always Available',
    description: 'Works entirely offline. Your data syncs securely only when you are back on Wi-Fi.',
    animation: require('../../assets/animations/Check.json'),
  },
];

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
type Props = { navigation: WelcomeScreenNavigationProp };

const SlideItem = ({ item }: { item: typeof SLIDES[0] }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const lottieRef = React.useRef<LottieView>(null);

  React.useEffect(() => {
    // Force play on mount to fix autoPlay bugs
    lottieRef.current?.play();
  }, []);

  return (
    <View style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={styles.animationWrapper}>
          <LottieView
            ref={lottieRef}
            source={item.animation}
            autoPlay
            loop
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textWrapper}>
          <Typography variant="largeTitle" color={theme.colors.textHigh} style={styles.slideTitle}>
            {item.title}
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium} style={styles.slideDescription}>
            {item.description}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default function WelcomeScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.navigate('PrivacyConsent' as never);
    }
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return <SlideItem item={item} />;
  };

  return (
    <View style={styles.container}>
      <BackgroundMesh />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Carousel */}
        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
        />

        {/* Footer Area */}
        <View style={styles.footer}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i.toString()}
                  style={[styles.dot, { width: dotWidth, opacity, backgroundColor: theme.colors.textHigh }]}
                />
              );
            })}
          </View>

          <BounceButton onPress={scrollToNext} style={styles.ctaButton}>
            <View style={styles.ctaButtonInner}>
              <Typography variant="headline" style={styles.ctaText}>
                {currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
              </Typography>
              {currentIndex === SLIDES.length - 1 && (
                <View style={[styles.ctaIcon, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
                  <Ionicons name="arrow-forward" size={18} color={isDark ? '#FFFFFF' : '#000000'} />
                </View>
              )}
            </View>
          </BounceButton>
          {currentIndex === SLIDES.length - 1 && (
             <Button title="I already have an account" variant="secondary" onPress={() => navigation.navigate('Auth' as never)} style={{marginTop: 16, width: '100%'}} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  slideTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 17, // iOS body size
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaButton: {
    backgroundColor: isDark ? '#FFFFFF' : '#000000',
    width: '100%',
    borderRadius: 32,
    height: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaButtonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaText: {
    color: isDark ? '#000000' : '#FFFFFF',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

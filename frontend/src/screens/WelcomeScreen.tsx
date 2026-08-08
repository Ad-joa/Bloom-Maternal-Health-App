import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { BounceButton } from '../components/BounceButton';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Your Pregnancy, Guided.',
    description: 'Bloom is your personal maternal health companion, designed specifically for your journey.',
    icon: <Ionicons name="heart" size={64} color={theme.colors.primaryDark} />,
    iconBg: '#E8F8F2',
  },
  {
    id: '2',
    title: 'Track Vitals & Baby Growth',
    description: 'Log your symptoms, mood, and daily vitals. Keep a beautiful record as your baby grows.',
    icon: <Ionicons name="medical" size={64} color="#007AFF" />,
    iconBg: '#E5F1FF',
  },
  {
    id: '3',
    title: 'Ghanaian Context',
    description: 'Local nutrition advice, ANC reminders, and culturally relevant insights for Ghanaian mothers.',
    icon: <Ionicons name="leaf" size={64} color="#E07A5F" />,
    iconBg: '#FFF0EF',
  },
  {
    id: '4',
    title: 'Always Available',
    description: 'Works entirely offline. Your data syncs securely only when you are back on Wi-Fi.',
    icon: <Ionicons name="shield-checkmark" size={64} color="#8A5A99" />,
    iconBg: '#F3EFFC',
  },
];

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
type Props = { navigation: WelcomeScreenNavigationProp };

export default function WelcomeScreen({ navigation }: Props) {
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
      navigation.navigate('Auth');
    }
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.slideContent}>
          <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
            {item.icon}
          </View>
          <Typography variant="largeTitle" color="#000" style={styles.slideTitle}>
            {item.title}
          </Typography>
          <Typography variant="body" color="#3A3A3C" style={styles.slideDescription}>
            {item.description}
          </Typography>
        </View>
      </View>
    );
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
                  style={[styles.dot, { width: dotWidth, opacity }]}
                />
              );
            })}
          </View>

          <BounceButton onPress={scrollToNext} style={styles.ctaButton}>
            <View style={styles.ctaButtonInner}>
              <Typography variant="headline" color="#FFF" style={styles.ctaText}>
                {currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
              </Typography>
              {currentIndex === SLIDES.length - 1 && (
                <View style={styles.ctaIcon}>
                  <Ionicons name="arrow-forward" size={18} color="#000" />
                </View>
              )}
            </View>
          </BounceButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    width: '100%',
    paddingTop: height * 0.1, // Push content slightly up for balance
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
    backgroundColor: '#000',
  },
  ctaButton: {
    backgroundColor: '#000',
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
    fontSize: 18,
    letterSpacing: 0.2,
  },
  ctaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

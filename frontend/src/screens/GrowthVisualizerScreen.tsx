import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Typography } from '../components/Typography';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { BounceButton } from '../components/BounceButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GrowthVisualizer'>;
type Props = { navigation: NavigationProp };

const TIMELINE_DATA = [
  { week: 2, img: require('../../assets/images/fetus_2.jpg'), size: 40 },
  { week: 7, img: require('../../assets/images/fetus_7.jpg'), size: 55 },
  { week: 14, img: require('../../assets/images/fetus_14.jpg'), size: 70 },
  { week: 35, img: require('../../assets/images/fetus_35.jpg'), size: 90 },
  { week: 41, img: require('../../assets/images/fetus_41.jpg'), size: 110 },
];

export default function GrowthVisualizerScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => logout()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
        </View>

        {/* Timeline Visualization */}
        <View style={styles.visualizationContainer}>
          <View style={styles.timelineWrapper}>
            <View style={styles.axisLine}>
              <View style={styles.axisArrow} />
            </View>
            
            {TIMELINE_DATA.map((item, index) => {
              const screenPadding = 16;
              const firstItemRadius = 40 / 2;
              const lastItemRadius = 110 / 2;
              const startPos = screenPadding + firstItemRadius;
              const endPos = width - screenPadding - lastItemRadius;
              const usableWidth = endPos - startPos;
              const centerPos = startPos + (index / (TIMELINE_DATA.length - 1)) * usableWidth;

              return (
                <View key={item.week.toString()} style={[styles.timelineItem, { left: centerPos }]}>
                  <View style={[styles.iconContainer, { width: item.size, height: item.size, borderRadius: item.size / 2, top: 175 - item.size / 2 }]}>
                    <Image source={item.img} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                  </View>
                  <Typography variant="body" style={[styles.weekLabel, { top: 175 + item.size / 2 + 16 }]}>{item.week}</Typography>
                </View>
              );
            })}
          </View>
        </View>

        {/* Copy */}
        <View style={styles.copyContainer}>
          <Typography variant="largeTitle" style={styles.title}>
            Feel more connected to your baby by visualizing their growth
          </Typography>
          <Typography variant="body" style={styles.subtitle}>
            98% of our users say that seeing their baby's growth helped them deepen their connection.
          </Typography>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <BounceButton onPress={() => navigation.navigate('Onboarding' as never)} style={styles.continueButton}>
             <Typography variant="headline" style={styles.continueText}>Continue</Typography>
          </BounceButton>
        </View>

      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizationContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  timelineWrapper: {
    height: 350,
    position: 'relative',
    justifyContent: 'center',
  },
  axisLine: {
    position: 'absolute',
    top: 175,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
  },
  axisArrow: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  timelineItem: {
    position: 'absolute',
    alignItems: 'center',
    width: 110,
    marginLeft: -55,
    top: 0,
    bottom: 0,
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weekLabel: {
    position: 'absolute',
    color: theme.colors.textHigh,
    fontWeight: '800',
    fontSize: 18,
  },
  copyContainer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textHigh,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    color: theme.colors.textMedium,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

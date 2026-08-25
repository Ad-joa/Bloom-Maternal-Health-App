import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { LinearGradient } from 'expo-linear-gradient';

// We will import the existing screens and modify them slightly to remove SafeAreaView
import CommunityFeed from './CommunityScreen';
import BloomAIChat from './BloomAIScreen';

export default function SupportScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [activeTab, setActiveTab] = useState<'community' | 'ai'>('ai');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient 
        colors={isDark
          ? ['#1A1A1A', '#121212', '#121212']
          : ['#FFF5F5', '#FFFFFF', '#FAFAFA']
        } 
        style={StyleSheet.absoluteFillObject}
        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header & Segmented Control */}
        <View style={styles.header}>
          <Typography variant="largeTitle" style={styles.headerTitle}>Support</Typography>
          
          <View style={styles.segmentedControl}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.segmentButton, activeTab === 'ai' && styles.segmentActive]}
              onPress={() => setActiveTab('ai')}
            >
              <Typography variant="subhead" style={[styles.segmentText, activeTab === 'ai' && styles.segmentTextActive]}>
                Bloom AI
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={[styles.segmentButton, activeTab === 'community' && styles.segmentActive]}
              onPress={() => setActiveTab('community')}
            >
              <Typography variant="subhead" style={[styles.segmentText, activeTab === 'community' && styles.segmentTextActive]}>
                Community
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'community' ? (
            <CommunityFeed navigation={navigation} isNested />
          ) : (
            <BloomAIChat navigation={navigation} isNested />
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 40,
    lineHeight: 44,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingBold,
    marginBottom: 24,
    letterSpacing: -1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    borderRadius: 100,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 100,
  },
  segmentActive: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.headingSemibold,
  },
  segmentTextActive: {
    color: theme.colors.primaryDark,
    fontFamily: theme.typography.families.headingBold,
  },
  contentArea: {
    flex: 1,
  }
});

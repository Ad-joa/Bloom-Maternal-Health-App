import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, Plus, Camera, Scale } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 16;
const IMAGE_SIZE = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

type BumpEntry = {
  id: string;
  date: Date;
  week: number;
  weight: string;
  imageUri: string;
};

// Initial Mock Data
const MOCK_ENTRIES: BumpEntry[] = [
  { id: '1', date: new Date(2026, 4, 15), week: 12, weight: '65 kg', imageUri: 'https://images.unsplash.com/photo-1510154221590-f2aa60882352?w=500&q=80' },
  { id: '2', date: new Date(2026, 5, 12), week: 16, weight: '66 kg', imageUri: 'https://images.unsplash.com/photo-1516086745814-7f1540d4a984?w=500&q=80' },
  { id: '3', date: new Date(2026, 6, 10), week: 20, weight: '68 kg', imageUri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80' },
];

export default function BumpGalleryScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  
  const [entries, setEntries] = useState<BumpEntry[]>(MOCK_ENTRIES);

  const handleAddPhoto = () => {
    // In a real app, this would open expo-image-picker
    // Here we just mock adding a new entry
    const newEntry: BumpEntry = {
      id: Math.random().toString(),
      date: new Date(),
      week: 24, // mocked next week
      weight: '70 kg',
      imageUri: 'https://images.unsplash.com/photo-1544078693-db199bb652b3?w=500&q=80',
    };
    setEntries([newEntry, ...entries]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={isDark ? ['#1A1212', '#121212'] : ['#FFF5F8', '#FFFFFF']} 
        style={StyleSheet.absoluteFillObject} 
      />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={theme.colors.textHigh} size={28} />
        </TouchableOpacity>
        <Typography variant="title2" style={{ fontFamily: theme.typography.families.headingBold }}>
          Bump Gallery
        </Typography>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Progress Header */}
        <BlurView intensity={isDark ? 30 : 80} tint={isDark ? "dark" : "light"} style={styles.statsCard}>
           <View style={styles.statItem}>
             <Scale color={theme.colors.primaryDark} size={24} />
             <Typography variant="title3" style={{ marginTop: 8, fontFamily: theme.typography.families.headingBold }}>
               +5 kg
             </Typography>
             <Typography variant="caption1" color={theme.colors.textMedium}>Total Gained</Typography>
           </View>
           <View style={styles.statDivider} />
           <View style={styles.statItem}>
             <Camera color={theme.colors.primaryDark} size={24} />
             <Typography variant="title3" style={{ marginTop: 8, fontFamily: theme.typography.families.headingBold }}>
               {entries.length}
             </Typography>
             <Typography variant="caption1" color={theme.colors.textMedium}>Photos Logged</Typography>
           </View>
        </BlurView>

        {/* Gallery Grid */}
        <View style={styles.grid}>
          {entries.map(entry => (
            <View key={entry.id} style={styles.gridItem}>
              <Image source={{ uri: entry.imageUri }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlayContent}>
                  <Typography variant="subhead" style={{ color: '#FFF', fontFamily: theme.typography.families.headingSemibold }}>
                    Week {entry.week}
                  </Typography>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="caption1" style={{ color: '#FFF', fontFamily: theme.typography.families.headingBold }}>
                      {entry.weight}
                    </Typography>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 24 }]} 
        activeOpacity={0.8}
        onPress={handleAddPhoto}
      >
        <LinearGradient 
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.fabGradient}
        >
          <Plus color="#FFF" size={32} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: SPACING,
    paddingBottom: 120, // space for FAB
  },
  statsCard: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    marginHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.3,
    marginBottom: SPACING,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  overlayContent: {
    padding: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, Plus, Camera, Scale, X, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getWeeksPregnant } from '../utils/dateUtils';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 16;
const IMAGE_SIZE = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

type BumpEntry = {
  id: string;
  date: number; // timestamp
  week: number;
  weight: string;
  imageUri: string;
};

export default function BumpGalleryScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [entries, setEntries] = useState<BumpEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  const [currentWeight, setCurrentWeight] = useState('');

  const STORAGE_KEY = `@bump_gallery_${user?.id || 'guest'}`;

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bump entries", e);
    }
  };

  const handleAddPhoto = () => {
    Alert.alert(
      "Add Bump Photo",
      "Choose a source",
      [
        { text: "Camera", onPress: () => pickImage(true) },
        { text: "Gallery", onPress: () => pickImage(false) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      };

      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert("Permission needed", "Camera permission is required to take photos.");
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert("Permission needed", "Gallery permission is required to select photos.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentImageUri(result.assets[0].uri);
        setCurrentWeight('');
        setIsModalVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process image.");
    }
  };

  const handleSavePhoto = async () => {
    if (!currentImageUri) return;
    
    const dueDate = user?.due_date;
    const currentWeek = dueDate ? getWeeksPregnant(dueDate) : 0;

    const newEntry: BumpEntry = {
      id: Math.random().toString(),
      date: Date.now(),
      week: currentWeek,
      weight: currentWeight ? `${currentWeight} kg` : 'Not recorded',
      imageUri: currentImageUri,
    };
    
    const updated = [newEntry, ...entries];
    setEntries(updated);
    setIsModalVisible(false);
    setCurrentImageUri(null);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      Alert.alert("Error", "Failed to save entry locally.");
    }
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
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

      {/* Weight Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={{ flex: 1, justifyContent: 'flex-end' }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <BlurView intensity={isDark ? 50 : 80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFillObject} />
          
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeader}>
              <Typography variant="title3" style={{ fontFamily: theme.typography.families.headingBold }}>Add Details</Typography>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <X color={theme.colors.textMedium} size={24} />
              </TouchableOpacity>
            </View>
            
            {currentImageUri && (
              <Image source={{ uri: currentImageUri }} style={styles.modalImagePreview} />
            )}
            
            <Typography variant="subhead" color={theme.colors.textMedium} style={{ marginBottom: 8, marginTop: 16 }}>
              Weight (Optional)
            </Typography>
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
                color: theme.colors.textHigh 
              }]}
              placeholder="e.g. 68"
              placeholderTextColor={theme.colors.textMedium}
              keyboardType="decimal-pad"
              value={currentWeight}
              onChangeText={setCurrentWeight}
            />

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.colors.primaryDark }]} onPress={handleSavePhoto}>
              <Save color="#FFF" size={20} style={{ marginRight: 8 }} />
              <Typography variant="headline" style={{ color: '#FFF' }}>Save Photo</Typography>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  },
  modalContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(150,150,150,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  modalInput: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  saveBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

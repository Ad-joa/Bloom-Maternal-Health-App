import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { ChevronLeft, PlayCircle, PauseCircle, Headphones, BookOpen, FileText, Clock, User, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';
import { useAuth } from '../context/AuthContext';
import { getEducationalContent } from '../api/api';
import { Star } from 'lucide-react-native';

export default function ResourceListScreen({ route, navigation }: any) {
  const { category, title } = route.params || { category: 'article', title: 'Resources' };
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const styles = getStyles(theme, isDark);
  
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [rawResources, setRawResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getEducationalContent(undefined, category);
      setRawResources(data);
    } catch (e) {
      console.error("Failed to load resources:", e);
    } finally {
      setLoading(false);
    }
  };

  // Personalization Logic
  const userConditions = user?.medical_conditions?.toLowerCase() || '';
  const conditionWords = userConditions.split(/[\s,]+/).filter(w => w.length > 3);
  const hasPersonalization = conditionWords.length > 0;
  
  const recommendedResources = hasPersonalization 
    ? rawResources.filter((r: any) => {
        const textToSearch = (r.title + ' ' + (r.content || '') + ' ' + (r.author || '')).toLowerCase();
        return conditionWords.some((word: string) => textToSearch.includes(word));
      })
    : [];

  const regularResources = hasPersonalization 
    ? rawResources.filter((r: any) => !recommendedResources.includes(r))
    : rawResources;

  const handleAudioPress = async (item: any) => {
    if (playingAudioId === item.id && sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } else {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setPlayingAudioId(item.id);
      setIsPlaying(false);
      
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: item.media_url },
          { shouldPlay: true }
        );
        setSound(newSound);
        setIsPlaying(true);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Could not play audio track.');
        setPlayingAudioId(null);
        setIsPlaying(false);
      }
    }
  };

  const handleVideoPress = (item: any) => {
    Linking.openURL('https://www.youtube.com/results?search_query=' + encodeURIComponent(item.title)).catch(() => {
      Alert.alert('Error', 'Could not open video link.');
    });
  };

  const handleBookPress = (item: any) => {
    Linking.openURL('https://www.google.com/search?tbm=bks&q=' + encodeURIComponent(item.title + ' ' + item.author)).catch(() => {
      Alert.alert('Error', 'Could not open book link.');
    });
  };

  const handleArticlePress = (item: any) => {
    navigation.navigate('Article', { 
      articleId: item.id, 
      title: item.title, 
      content: item.content 
    });
  };

  const renderAudio = (item: any) => {
    const isThisAudioPlaying = playingAudioId === item.id && isPlaying;
    return (
      <TouchableOpacity key={item.id} style={styles.audioCard} activeOpacity={0.8} onPress={() => handleAudioPress(item)}>
        <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
        
        <Image source={{ uri: item.image_url }} style={styles.audioImage} />
        <View style={styles.audioInfo}>
          <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 4 }}>{item.title}</Typography>
          <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>{item.author}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Clock size={12} color={theme.colors.textMedium} style={{ marginRight: 4 }} />
            <Typography variant="caption2" style={{ color: theme.colors.textMedium }}>{item.duration}</Typography>
          </View>
        </View>
        <View style={styles.playBtnCircle}>
          {isThisAudioPlaying ? (
            <PauseCircle size={28} color={theme.colors.primaryDark} strokeWidth={2} />
          ) : (
            <PlayCircle size={28} color={theme.colors.primaryDark} strokeWidth={2} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderVideo = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.videoCard} activeOpacity={0.85} onPress={() => handleVideoPress(item)}>
      <Image source={{ uri: item.image_url }} style={styles.videoImage} />
      <View style={styles.videoOverlay}>
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.85)']} 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={styles.playBtnLarge}>
          <PlayCircle size={48} color="#FFF" strokeWidth={1.5} />
        </View>
        <Typography variant="title2" style={{ color: '#FFF', textAlign: 'center', marginTop: 12, textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>{item.title}</Typography>
        <Typography variant="caption1" style={{ color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{item.duration}</Typography>
      </View>
    </TouchableOpacity>
  );

  const renderBook = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.bookCard} activeOpacity={0.8} onPress={() => handleBookPress(item)}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
      
      <Image source={{ uri: item.image_url }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 4 }}>{item.title}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <User size={12} color={theme.colors.textMedium} style={{ marginRight: 4 }} />
          <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>{item.author}</Typography>
        </View>
        <Typography variant="caption2" style={{ color: theme.colors.primaryDark }}>{item.duration}</Typography>
      </View>
      <ChevronRight size={20} color={theme.colors.textMedium} />
    </TouchableOpacity>
  );

  const renderArticle = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.articleCard} activeOpacity={0.8} onPress={() => handleArticlePress(item)}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.articleInfo}>
        <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 6 }}>{item.title}</Typography>
        <Typography variant="subhead" style={{ color: theme.colors.textMedium, marginBottom: 12, lineHeight: 20 }} numberOfLines={2}>
          {item.content}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FileText size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>{item.readTime}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = (item: any) => {
    switch(category) {
      case 'audio': return renderAudio(item);
      case 'video': return renderVideo(item);
      case 'book': return renderBook(item);
      case 'article': return renderArticle(item);
      default: return renderArticle(item);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1A1212', '#121212'] : ['#FDF4F4', '#FAFAFA']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.5 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <BlurView intensity={isDark ? 20 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
            <ChevronLeft size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title2" style={{ color: theme.colors.textHigh, marginLeft: 16 }}>
            {title}
          </Typography>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {recommendedResources.length > 0 && (
          <View style={styles.recommendationSection}>
            <View style={styles.recommendationHeader}>
              <Star size={18} color={theme.colors.warning} fill={theme.colors.warning} style={{ marginRight: 8 }} />
              <Typography variant="title3" style={{ color: theme.colors.primaryDark }}>
                Recommended for You
              </Typography>
            </View>
            <Typography variant="caption1" style={{ color: theme.colors.textMedium, marginBottom: 16 }}>
              Based on your health profile ({user?.medical_conditions})
            </Typography>
            {recommendedResources.map(renderItem)}
            <View style={styles.divider} />
          </View>
        )}

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Typography variant="body" style={{ color: theme.colors.textMedium }}>Loading resources...</Typography>
          </View>
        ) : (
          <>
            <Typography variant="title3" style={{ color: theme.colors.textHigh, marginBottom: 16 }}>
              {recommendedResources.length > 0 ? 'All Resources' : 'Latest Content'}
            </Typography>
            {regularResources.map(renderItem)}
          </>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  recommendationSection: {
    marginBottom: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  
  // Audio
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  audioImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  audioInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(147,51,234,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  // Video
  videoCard: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  videoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfoBg: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    overflow: 'hidden',
  },
  videoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // Book
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },

  // Article
  articleCard: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  articleInfo: {
    flex: 1,
  },
});

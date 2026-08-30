import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { ChevronLeft, PlayCircle, Headphones, BookOpen, FileText, Clock, User, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function ResourceListScreen({ route, navigation }: any) {
  const { category, title } = route.params || { category: 'article', title: 'Resources' };
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme, isDark);

  const MOCK_RESOURCES = {
    audio: [
      { id: '1', title: 'Guided Meditation for Labor', duration: '15 mins', author: 'Dr. Jane Smith', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80' },
      { id: '2', title: 'Birth Affirmations', duration: '10 mins', author: 'Mama Care', image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=400&q=80' },
      { id: '3', title: 'Pregnancy Sleep Sounds', duration: '45 mins', author: 'Deep Rest', image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=400&q=80' },
      { id: '4', title: 'Soothing Classical for Baby', duration: '60 mins', author: 'Mozart Mix', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80' },
      { id: '5', title: 'Anxiety Relief Breathing', duration: '8 mins', author: 'Dr. Jane Smith', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80' },
    ],
    video: [
      { id: '1', title: 'Prenatal Yoga - First Trimester', duration: '20 mins', author: 'Yoga with Anna', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
      { id: '2', title: 'Preparing Your Hospital Bag', duration: '12 mins', author: 'Mama Tips', image: 'https://images.unsplash.com/photo-1555243896-771a8239ac20?auto=format&fit=crop&w=600&q=80' },
      { id: '3', title: 'Pelvic Floor Exercises', duration: '15 mins', author: 'Dr. Sarah', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80' },
      { id: '4', title: 'Signs of Labor Approaching', duration: '8 mins', author: 'Mama Tips', image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80' },
    ],
    book: [
      { id: '1', title: 'Expecting Better', author: 'Emily Oster', pages: '320 pages', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80' },
      { id: '2', title: 'The Mama Natural', author: 'Genevieve Howland', pages: '450 pages', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80' },
      { id: '3', title: 'Ina May\'s Guide to Childbirth', author: 'Ina May Gaskin', pages: '348 pages', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
      { id: '4', title: 'The Fourth Trimester', author: 'Kimberly Ann Johnson', pages: '288 pages', image: 'https://images.unsplash.com/photo-1524909623862-2bd3fb895e6f?auto=format&fit=crop&w=400&q=80' },
    ],
    article: [
      { id: '1', title: 'Foods to Avoid During Pregnancy', snippet: 'A comprehensive list of what to eat and what to avoid.', readTime: '5 min read' },
      { id: '2', title: 'Understanding Braxton Hicks', snippet: 'How to tell the difference between practice and real contractions.', readTime: '3 min read' },
      { id: '3', title: 'The Importance of Hydration', snippet: 'Why drinking enough water is crucial for you and your baby.', readTime: '4 min read' },
      { id: '4', title: 'Sleeping Positions for 3rd Trimester', snippet: 'Tips and tricks to get comfortable when your belly is growing.', readTime: '6 min read' },
      { id: '5', title: 'Postpartum Mental Health', snippet: 'What to expect in the weeks following delivery.', readTime: '8 min read' },
    ]
  };

  const resources = (MOCK_RESOURCES as any)[category] || MOCK_RESOURCES.article;

  const renderAudio = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.audioCard} activeOpacity={0.8}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
      
      <Image source={{ uri: item.image }} style={styles.audioImage} />
      <View style={styles.audioInfo}>
        <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 4 }}>{item.title}</Typography>
        <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>{item.author}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Clock size={12} color={theme.colors.textMedium} style={{ marginRight: 4 }} />
          <Typography variant="caption2" style={{ color: theme.colors.textMedium }}>{item.duration}</Typography>
        </View>
      </View>
      <View style={styles.playBtnCircle}>
        <PlayCircle size={28} color={theme.colors.primaryDark} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );

  const renderVideo = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.videoCard} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.videoImage} />
      <View style={styles.videoOverlay}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />
        <PlayCircle size={48} color="#FFFFFF" strokeWidth={1.5} style={{ opacity: 0.9 }} />
      </View>
      <View style={styles.videoInfoBg}>
        <BlurView intensity={isDark ? 40 : 80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <View style={styles.videoInfo}>
          <View>
            <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 2 }}>{item.title}</Typography>
            <Typography variant="caption2" style={{ color: theme.colors.textMedium }}>{item.author}</Typography>
          </View>
          <View style={styles.durationBadge}>
            <Typography variant="caption2" style={{ color: '#FFF' }}>{item.duration}</Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBook = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.bookCard} activeOpacity={0.8}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
      
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 4 }}>{item.title}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <User size={12} color={theme.colors.textMedium} style={{ marginRight: 4 }} />
          <Typography variant="caption1" style={{ color: theme.colors.textMedium }}>{item.author}</Typography>
        </View>
        <Typography variant="caption2" style={{ color: theme.colors.primaryDark }}>{item.pages}</Typography>
      </View>
      <ChevronRight size={20} color={theme.colors.textMedium} />
    </TouchableOpacity>
  );

  const renderArticle = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.articleCard} activeOpacity={0.8}>
      <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.articleInfo}>
        <Typography variant="headline" style={{ color: theme.colors.textHigh, marginBottom: 6 }}>{item.title}</Typography>
        <Typography variant="caption1" style={{ color: theme.colors.textMedium, lineHeight: 18 }} numberOfLines={2}>{item.snippet}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <BookOpen size={12} color={theme.colors.primaryDark} style={{ marginRight: 4 }} />
          <Typography variant="caption2" style={{ color: theme.colors.primaryDark, fontFamily: theme.typography.families.headingSemibold }}>{item.readTime}</Typography>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {resources.map((item: any) => renderItem(item))}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
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

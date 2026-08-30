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

export default function ResourceListScreen({ route, navigation }: any) {
  const { category, title } = route.params || { category: 'article', title: 'Resources' };
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(theme, isDark);
  
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const MOCK_RESOURCES = {
    audio: [
      { id: '1', title: 'Weeks 22-24: The Move', duration: '28 mins', author: 'Becca Bristow', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '2', title: 'Caring for Twins', duration: '35 mins', author: 'Dad\'s Guide to Twins', image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '3', title: 'Pregnancy Health & Nutrition', duration: '50 mins', author: 'Becca Bristow', image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '4', title: 'Navigating Hospital Births', duration: '40 mins', author: 'Dad\'s Guide to Twins', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '5', title: 'Postpartum Support', duration: '60 mins', author: 'Becca Bristow', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '6', title: 'The First Trimester Changes', duration: '45 mins', author: 'Vanessa Merten', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '7', title: 'Managing Pregnancy Fatigue', duration: '30 mins', author: 'Jessie Ware', image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '8', title: 'The Importance of Pelvic Floor', duration: '25 mins', author: 'Dr. Sarah', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '9', title: 'Mindful Hypnobirthing', duration: '55 mins', author: 'Hollie de Cruz', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '10', title: 'Nutrition for Two', duration: '42 mins', author: 'Lily Nichols', image: 'https://images.unsplash.com/photo-1490818387583-1b5ba4596956?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '11', title: 'Preparing Your Birth Partner', duration: '38 mins', author: 'Penny Simkin', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '12', title: 'Dealing with Morning Sickness', duration: '20 mins', author: 'Vanessa Merten', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '13', title: 'Natural Labor Techniques', duration: '48 mins', author: 'Ina May Gaskin', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
      { id: '14', title: 'Gestational Diabetes Info', duration: '33 mins', author: 'Dr. Jane Smith', image: 'https://images.unsplash.com/photo-1524909623862-2bd3fb895e6f?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://traffic.libsyn.com/twindad/dads-guide-to-twins-episode-17.mp3' } },
      { id: '15', title: 'Choosing a Pediatrician', duration: '29 mins', author: 'Becca Bristow', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80', audioFile: { uri: 'https://media.blubrry.com/bristows_made_a_baby/content.blubrry.com/bristows_made_a_baby/Weeks_22-24.mp3' } },
    ],
    video: [
      { id: '1', title: 'Prenatal Yoga - First Trimester', duration: '20 mins', author: 'Yoga with Anna', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
      { id: '2', title: 'Preparing Your Hospital Bag', duration: '12 mins', author: 'Mama Tips', image: 'https://images.unsplash.com/photo-1555243896-771a8239ac20?auto=format&fit=crop&w=600&q=80' },
      { id: '3', title: 'Pelvic Floor Exercises', duration: '15 mins', author: 'Dr. Sarah', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80' },
      { id: '4', title: 'Signs of Labor Approaching', duration: '8 mins', author: 'Mama Tips', image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=600&q=80' },
      { id: '5', title: 'How to Breastfeed: A Beginner\'s Guide', duration: '18 mins', author: 'Lactation Consultant', image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=600&q=80' },
      { id: '6', title: 'Postpartum Core Recovery', duration: '25 mins', author: 'FitMom', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' },
      { id: '7', title: 'Newborn Bathing Tutorial', duration: '10 mins', author: 'Nurse Emma', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80' },
      { id: '8', title: 'Second Trimester Workouts', duration: '22 mins', author: 'Yoga with Anna', image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=600&q=80' },
      { id: '9', title: 'Third Trimester Stretches', duration: '15 mins', author: 'Dr. Sarah', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80' },
      { id: '10', title: 'Swaddling Techniques', duration: '6 mins', author: 'Mama Tips', image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=600&q=80' },
      { id: '11', title: 'Setting Up the Nursery', duration: '14 mins', author: 'Nursery Designs', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=80' },
      { id: '12', title: 'Car Seat Installation Basics', duration: '9 mins', author: 'Safe Kids', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80' },
      { id: '13', title: 'Managing Sciatica Pain', duration: '11 mins', author: 'FitMom', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80' },
      { id: '14', title: 'Partner Massage for Labor', duration: '16 mins', author: 'Yoga with Anna', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80' },
      { id: '15', title: 'What to Expect at Appointments', duration: '20 mins', author: 'Dr. Jane Smith', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
    ],
    book: [
      { id: '1', title: 'Expecting Better', author: 'Emily Oster', pages: '320 pages', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80' },
      { id: '2', title: 'The Mama Natural', author: 'Genevieve Howland', pages: '450 pages', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80' },
      { id: '3', title: 'Ina May\'s Guide to Childbirth', author: 'Ina May Gaskin', pages: '348 pages', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
      { id: '4', title: 'The Fourth Trimester', author: 'Kimberly Ann Johnson', pages: '288 pages', image: 'https://images.unsplash.com/photo-1524909623862-2bd3fb895e6f?auto=format&fit=crop&w=400&q=80' },
      { id: '5', title: 'Real Food for Pregnancy', author: 'Lily Nichols', pages: '354 pages', image: 'https://images.unsplash.com/photo-1490818387583-1b5ba4596956?auto=format&fit=crop&w=400&q=80' },
      { id: '6', title: 'The Birth Partner', author: 'Penny Simkin', pages: '416 pages', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80' },
      { id: '7', title: 'What to Expect When You\'re Expecting', author: 'Heidi Murkoff', pages: '656 pages', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80' },
      { id: '8', title: 'Nurture', author: 'Erica Chidi', pages: '272 pages', image: 'https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&w=400&q=80' },
      { id: '9', title: 'Cribsheet', author: 'Emily Oster', pages: '352 pages', image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?auto=format&fit=crop&w=400&q=80' },
      { id: '10', title: 'Mindful Hypnobirthing', author: 'Hollie de Cruz', pages: '240 pages', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80' },
      { id: '11', title: 'Bringing Up Bébé', author: 'Pamela Druckerman', pages: '320 pages', image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80' },
      { id: '12', title: 'The Happiest Baby on the Block', author: 'Harvey Karp', pages: '384 pages', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80' },
      { id: '13', title: 'Bumpin\'', author: 'Leslie Schrock', pages: '304 pages', image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=400&q=80' },
      { id: '14', title: 'Pregnancy, Childbirth, and the Newborn', author: 'Penny Simkin', pages: '528 pages', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80' },
      { id: '15', title: 'Transformed by Birth', author: 'Britta Bushnell', pages: '272 pages', image: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=400&q=80' },
    ],
    article: [
      { id: '1', title: 'Foods to Avoid During Pregnancy', snippet: 'A comprehensive list of what to eat and what to avoid.', readTime: '5 min read' },
      { id: '2', title: 'Understanding Braxton Hicks', snippet: 'How to tell the difference between practice and real contractions.', readTime: '3 min read' },
      { id: '3', title: 'The Importance of Hydration', snippet: 'Why drinking enough water is crucial for you and your baby.', readTime: '4 min read' },
      { id: '4', title: 'Sleeping Positions for 3rd Trimester', snippet: 'Tips and tricks to get comfortable when your belly is growing.', readTime: '6 min read' },
      { id: '5', title: 'Postpartum Mental Health', snippet: 'What to expect in the weeks following delivery.', readTime: '8 min read' },
      { id: '6', title: 'Creating a Birth Plan', snippet: 'Essential items to include when communicating your delivery preferences.', readTime: '7 min read' },
      { id: '7', title: 'Navigating Morning Sickness', snippet: 'Remedies and tips to help you get through the first trimester nausea.', readTime: '5 min read' },
      { id: '8', title: 'Exercise Guidelines for Pregnancy', snippet: 'Safe ways to stay active and healthy while expecting.', readTime: '6 min read' },
      { id: '9', title: 'Hospital Bag Checklist', snippet: 'Everything you need to pack for the big day.', readTime: '4 min read' },
      { id: '10', title: 'Signs of Labor', snippet: 'How to know when it is time to head to the hospital.', readTime: '5 min read' },
      { id: '11', title: 'Managing Heartburn', snippet: 'Common causes of pregnancy heartburn and how to soothe it.', readTime: '3 min read' },
      { id: '12', title: 'Fetal Development: Month by Month', snippet: 'A detailed look at how your baby grows.', readTime: '10 min read' },
      { id: '13', title: 'Tips for Better Sleep', snippet: 'Struggling with insomnia? Try these relaxation techniques.', readTime: '4 min read' },
      { id: '14', title: 'Preparing for Breastfeeding', snippet: 'Steps you can take now to make nursing easier later.', readTime: '6 min read' },
      { id: '15', title: 'What to Expect in the Fourth Trimester', snippet: 'The physical and emotional changes after birth.', readTime: '7 min read' },
    ]
  };

  const resources = (MOCK_RESOURCES as any)[category] || MOCK_RESOURCES.article;

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
          item.audioFile,
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
      content: item.snippet + '\n\nThis is a mock article content. In a full production app, this would fetch the full HTML or markdown from the backend. The purpose is to provide educational maternal health content to the user.' 
    });
  };

  const renderAudio = (item: any) => {
    const isThisAudioPlaying = playingAudioId === item.id && isPlaying;
    return (
      <TouchableOpacity key={item.id} style={styles.audioCard} activeOpacity={0.8} onPress={() => handleAudioPress(item)}>
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
      <Image source={{ uri: item.image }} style={styles.videoImage} />
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
    <TouchableOpacity key={item.id} style={styles.articleCard} activeOpacity={0.8} onPress={() => handleArticlePress(item)}>
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

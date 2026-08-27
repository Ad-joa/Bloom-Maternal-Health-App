import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Luggage, Briefcase, Baby, User, CheckCircle2, Circle } from 'lucide-react-native';

const INITIAL_CHECKLIST = [
  {
    category: "For Mama",
    icon: User,
    color: "#E06253",
    items: [
      { id: 'm1', title: 'Birth plan and medical notes', checked: false },
      { id: 'm2', title: 'Comfortable robes or nightgowns', checked: false },
      { id: 'm3', title: 'Nursing bras and maternity pads', checked: false },
      { id: 'm4', title: 'Toiletries (toothbrush, lip balm, hair ties)', checked: false },
      { id: 'm5', title: 'Going-home outfit (loose fitting)', checked: false },
      { id: 'm6', title: 'Phone charger (extra long cord)', checked: false },
    ]
  },
  {
    category: "For Baby",
    icon: Baby,
    color: "#F5A623",
    items: [
      { id: 'b1', title: 'Infant car seat (installed)', checked: false },
      { id: 'b2', title: 'Going-home outfit (newborn size)', checked: false },
      { id: 'b3', title: 'Socks or booties & a hat', checked: false },
      { id: 'b4', title: 'Receiving blanket', checked: false },
      { id: 'b5', title: 'Burp cloths', checked: false },
    ]
  },
  {
    category: "For Partner",
    icon: Briefcase,
    color: "#609B66",
    items: [
      { id: 'p1', title: 'Change of clothes and pajamas', checked: false },
      { id: 'p2', title: 'Snacks and drinks (lots of them!)', checked: false },
      { id: 'p3', title: 'Camera or phone for photos', checked: false },
      { id: 'p4', title: 'Toiletries', checked: false },
    ]
  }
];

export default function HospitalBagScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  const toggleItem = (categoryId: number, itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newData = [...checklist];
    const category = newData[categoryId];
    const itemIndex = category.items.findIndex(i => i.id === itemId);
    
    if (itemIndex > -1) {
      category.items[itemIndex].checked = !category.items[itemIndex].checked;
      setChecklist(newData);
    }
  };

  const getProgress = () => {
    let total = 0;
    let checked = 0;
    checklist.forEach(cat => {
      cat.items.forEach(item => {
        total++;
        if (item.checked) checked++;
      });
    });
    return { total, checked, percentage: Math.round((checked / total) * 100) || 0 };
  };

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title3" style={styles.headerTitle}>Hospital Bag</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient
            colors={isDark ? ['rgba(224,98,83,0.15)', 'rgba(0,0,0,0)'] : ['rgba(224,98,83,0.15)', 'rgba(255,255,255,0)']}
            style={styles.heroCard}
          >
            <View style={{ backgroundColor: 'rgba(224,98,83,0.15)', padding: 16, borderRadius: 24, marginBottom: 16 }}>
              <Luggage size={40} color="#E06253" />
            </View>
            <Typography variant="title1" style={styles.heroTitle}>Prepare for Birth</Typography>
            <Typography variant="body" style={styles.heroBody}>
              Pack your hospital bag around week 36 so you're ready whenever baby decides to arrive!
            </Typography>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress.percentage}%` }]} />
              </View>
              <Typography variant="caption1" style={styles.progressText}>
                {progress.checked} of {progress.total} items packed ({progress.percentage}%)
              </Typography>
            </View>
          </LinearGradient>

          {checklist.map((section, catIdx) => (
            <View key={catIdx} style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={{ backgroundColor: isDark ? `${section.color}30` : `${section.color}15`, padding: 8, borderRadius: 12 }}>
                  <section.icon size={20} color={section.color} />
                </View>
                <Typography variant="title3" style={[styles.sectionTitle, { color: section.color }]}>
                  {section.category}
                </Typography>
              </View>

              <View style={styles.card}>
                {section.items.map((item, i) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.itemRow}
                    activeOpacity={0.7}
                    onPress={() => toggleItem(catIdx, item.id)}
                  >
                    {item.checked ? (
                      <CheckCircle2 size={24} color={section.color} style={{ marginTop: -2 }} />
                    ) : (
                      <Circle size={24} color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} style={{ marginTop: -2 }} />
                    )}
                    <Typography 
                      variant="body" 
                      style={[
                        styles.itemTitle, 
                        item.checked && styles.itemTitleChecked
                      ]}
                    >
                      {item.title}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5',
    alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
  },
  heroTitle: {
    color: theme.colors.textHigh,
    marginBottom: 8,
    textAlign: 'center'
  },
  heroBody: {
    color: theme.colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E06253',
    borderRadius: 4,
  },
  progressText: {
    color: theme.colors.textMedium,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.headingSemibold,
  },
  card: {
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FAFAFA',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.body,
    flex: 1,
    lineHeight: 22,
  },
  itemTitleChecked: {
    color: theme.colors.textMedium,
    textDecorationLine: 'line-through',
  }
});

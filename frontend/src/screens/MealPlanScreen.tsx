import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Apple, Coffee, Target, AlertTriangle } from 'lucide-react-native';

const MEAL_TIPS = [
  {
    category: "Key Nutrients",
    icon: Target,
    color: "#F5A623",
    items: [
      { title: "Folic Acid (600 mcg)", desc: "Leafy greens, fortified cereals, beans" },
      { title: "Iron (27 mg)", desc: "Lean meats, spinach, lentils, fortified grains" },
      { title: "Calcium (1,000 mg)", desc: "Dairy, fortified plant milks, broccoli" }
    ]
  },
  {
    category: "Sample Daily Plan",
    icon: Apple,
    color: "#8CC152",
    items: [
      { title: "Breakfast", desc: "Oatmeal with berries and a hard-boiled egg" },
      { title: "Lunch", desc: "Grilled chicken salad with spinach and vinaigrette" },
      { title: "Dinner", desc: "Baked salmon, quinoa, and roasted asparagus" },
      { title: "Snack", desc: "Greek yogurt with almonds or an apple with peanut butter" }
    ]
  },
  {
    category: "Foods to Limit or Avoid",
    icon: AlertTriangle,
    color: "#E06253",
    items: [
      { title: "High-Mercury Fish", desc: "Shark, swordfish, king mackerel, tilefish" },
      { title: "Unpasteurized Dairy", desc: "Brie, camembert, queso fresco (unless pasteurized)" },
      { title: "Raw Seafood/Meat", desc: "Sushi, rare steaks, raw oysters" },
      { title: "Caffeine", desc: "Limit to 200mg per day (about 1-2 cups of coffee)" }
    ]
  }
];

export default function MealPlanScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
          <Typography variant="title3" style={styles.headerTitle}>Nutrition Guide</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <LinearGradient
            colors={isDark ? ['rgba(140,193,82,0.15)', 'rgba(0,0,0,0)'] : ['rgba(140,193,82,0.15)', 'rgba(255,255,255,0)']}
            style={styles.heroCard}
          >
            <View style={{ backgroundColor: 'rgba(140,193,82,0.15)', padding: 16, borderRadius: 24, marginBottom: 16 }}>
              <Apple size={40} color="#8CC152" />
            </View>
            <Typography variant="title1" style={styles.heroTitle}>Healthy Diet</Typography>
            <Typography variant="body" style={styles.heroBody}>
              Nourishing yourself means nourishing your baby. Focus on balanced meals rich in folic acid, iron, and calcium.
            </Typography>
          </LinearGradient>

          {MEAL_TIPS.map((section, idx) => (
            <View key={idx} style={styles.sectionContainer}>
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
                  <View key={i}>
                    <View style={styles.itemRow}>
                      <View style={[styles.bullet, { backgroundColor: section.color }]} />
                      <View style={{ flex: 1 }}>
                        <Typography variant="body" style={styles.itemTitle}>{item.title}</Typography>
                        <Typography variant="caption1" style={styles.itemDesc}>{item.desc}</Typography>
                      </View>
                    </View>
                    {i < section.items.length - 1 && <View style={styles.divider} />}
                  </View>
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
    lineHeight: 22
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
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  bullet: {
    width: 8, height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  itemTitle: {
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.headingSemibold,
    marginBottom: 2,
  },
  itemDesc: {
    color: theme.colors.textMedium,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#EEEEEE',
    marginVertical: 4,
  }
});

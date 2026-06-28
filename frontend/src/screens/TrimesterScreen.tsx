import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { getTrimesterInfo } from '../api/api';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Baby, Activity } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

type TrimesterScreenRouteProp = RouteProp<RootStackParamList, 'Trimester'>;

interface Props {
  route: TrimesterScreenRouteProp;
}

const AccordionItem = ({ title, icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <Card style={styles.accordionCard}>
      <TouchableOpacity onPress={toggleOpen} style={styles.accordionHeader} activeOpacity={0.7}>
        <View style={styles.accordionHeaderLeft}>
          <View style={styles.iconContainer}>{icon}</View>
          <Typography variant="headline" color={theme.colors.textHigh}>{title}</Typography>
        </View>
        {isOpen ? <ChevronUp size={20} color={theme.colors.textMedium} /> : <ChevronDown size={20} color={theme.colors.textMedium} />}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </Card>
  );
};

export default function TrimesterScreen({ route }: Props) {
  const { trimesterId } = route.params;
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getTrimesterInfo(trimesterId);
        setInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [trimesterId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Using mocked structured data if the backend still returns simple string
  const babyDevText = info?.babyDevelopment || "Your baby is developing rapidly! Vital organs are forming, and you might start feeling tiny flutters soon.";
  const bodyChangesText = info?.bodyChanges || "You may experience fatigue, nausea, or changes in appetite. These are normal as your body adjusts to the pregnancy hormones.";
  const dosAndDonts = info?.dosAndDonts || [
    "Do take your daily prenatal vitamins.",
    "Do drink plenty of water (8-10 glasses).",
    "Don't consume alcohol or smoke.",
    "Don't eat raw or undercooked meats."
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Hero Header */}
      <LinearGradient
        colors={[theme.colors.primaryLight, theme.colors.primary]}
        style={styles.heroCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Typography variant="largeTitle" color="#fff" style={styles.title}>
          {info?.title || `Trimester ${trimesterId}`}
        </Typography>
        <Typography variant="body" color="#ffffffd0" style={styles.subtitle}>
          {info?.description || 'Learn about your current stage of pregnancy.'}
        </Typography>
        <View style={styles.sizeIndicator}>
          <Typography variant="title3">🍋</Typography>
          <Typography variant="subhead" color="#fff" style={{ marginLeft: 8 }}>Baby is the size of a lemon</Typography>
        </View>
      </LinearGradient>

      {/* Accordions */}
      <View style={styles.contentSection}>
        <AccordionItem 
          title="Baby's Development" 
          icon={<Baby size={20} color={theme.colors.primaryDark} />} 
          defaultOpen={true}
        >
          <Typography variant="body" style={styles.accordionText}>
            {babyDevText}
          </Typography>
        </AccordionItem>

        <AccordionItem 
          title="Your Body Changes" 
          icon={<Activity size={20} color={theme.colors.primaryDark} />}
        >
          <Typography variant="body" style={styles.accordionText}>
            {bodyChangesText}
          </Typography>
        </AccordionItem>

        <AccordionItem 
          title="Do's and Don'ts" 
          icon={<CheckCircle size={20} color={theme.colors.success} />}
        >
          {dosAndDonts.map((item: string, index: number) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.bullet, { backgroundColor: item.startsWith("Do") && !item.startsWith("Don't") ? theme.colors.success : theme.colors.danger }]} />
              <Typography variant="body" style={styles.listText}>{item}</Typography>
            </View>
          ))}
        </AccordionItem>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surfaceVariant,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
  },
  heroCard: {
    padding: theme.spacing[6],
    borderRadius: theme.radii['2xl'],
    marginBottom: theme.spacing[5],
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: theme.spacing[4],
  },
  sizeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
  },
  contentSection: {
    gap: theme.spacing[3],
  },
  accordionCard: {
    marginBottom: 0,
    padding: 0,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surface,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  accordionContent: {
    padding: theme.spacing[4],
    paddingTop: 0,
    backgroundColor: theme.colors.surface,
  },
  accordionText: {
    lineHeight: 24,
    color: theme.colors.textMedium,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginRight: theme.spacing[3],
  },
  listText: {
    flex: 1,
    lineHeight: 22,
    color: theme.colors.textMedium,
  }
});

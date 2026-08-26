import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Typography } from '../components/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

type DueDateRevealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DueDateReveal'>;
type DueDateRevealScreenRouteProp = RouteProp<RootStackParamList, 'DueDateReveal'>;

type Props = {
  navigation: DueDateRevealScreenNavigationProp;
  route: DueDateRevealScreenRouteProp;
};

// Helper to format date "03/04/2027" -> "March 4, 2027"
const formatDueDate = (dateString: string) => {
  try {
    let d = new Date(dateString);
    if (isNaN(d.getTime())) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
      }
    }
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function DueDateRevealScreen({ navigation, route }: Props) {
  const { dueDate } = route.params;
  const formattedDate = formatDueDate(dueDate);
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textHigh} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image
            source={require('../../assets/images/stork.jpg')}
            style={styles.storkImage}
            resizeMode="contain"
          />

          <Typography style={styles.title}>
            Your expected due date
          </Typography>

          <Typography style={styles.dateText}>
            {formattedDate}
          </Typography>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Typography style={styles.nextButtonText}>Next</Typography>
          </TouchableOpacity>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  storkImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
    marginBottom: 40,
  },
  title: {
    color: theme.colors.textHigh,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateText: {
    color: theme.colors.primary,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nextButton: {
    backgroundColor: theme.colors.primaryDark,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

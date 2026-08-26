import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Typography } from '../components/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type DueDateRevealScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DueDateReveal'>;
type DueDateRevealScreenRouteProp = RouteProp<RootStackParamList, 'DueDateReveal'>;

type Props = {
  navigation: DueDateRevealScreenNavigationProp;
  route: DueDateRevealScreenRouteProp;
};

// Helper to format date "03/04/2027" -> "March 4, 2027"
const formatDueDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

export default function DueDateRevealScreen({ navigation, route }: Props) {
  const { dueDate } = route.params;
  const formattedDate = formatDueDate(dueDate);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Pure black like the screenshot
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40, // offset
  },
  storkImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.9,
    marginBottom: 40,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateText: {
    color: '#FF6B00', // Vibrant orange from screenshot
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
    backgroundColor: '#34C759', // Vibrant green
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

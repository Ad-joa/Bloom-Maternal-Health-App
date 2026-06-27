import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark} align="center">
          Bloom
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} align="center">
          Empowering expectant mothers with knowledge and timely advice.
        </Typography>
      </View>

      <View style={styles.section}>
        <Typography variant="title3" style={styles.sectionTitle}>
          Your Pregnancy Journey
        </Typography>
        
        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Trimester', { trimesterId: 1 })}>
          <Card style={styles.card}>
            <Typography variant="headline">First Trimester</Typography>
            <Typography variant="subhead" color={theme.colors.textMedium}>Weeks 1-12</Typography>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Trimester', { trimesterId: 2 })}>
          <Card style={styles.card}>
            <Typography variant="headline">Second Trimester</Typography>
            <Typography variant="subhead" color={theme.colors.textMedium}>Weeks 13-26</Typography>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Trimester', { trimesterId: 3 })}>
          <Card style={styles.card}>
            <Typography variant="headline">Third Trimester</Typography>
            <Typography variant="subhead" color={theme.colors.textMedium}>Weeks 27+</Typography>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Typography variant="title3" style={styles.sectionTitle}>
          Health Advisory
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={styles.description}>
          Feeling unwell or experiencing unfamiliar symptoms? Check our smart advisory system for guidance.
        </Typography>
        <Button 
          title="Check Symptoms Now" 
          onPress={() => navigation.navigate('Advisory')} 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.surfaceVariant, // Using surfaceVariant for the background, like iOS grouped background
  },
  header: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[4],
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
  },
  description: {
    marginBottom: theme.spacing[4],
  },
  card: {
    marginBottom: theme.spacing[3],
  },
});

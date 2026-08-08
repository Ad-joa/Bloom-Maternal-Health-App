import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { X } from 'lucide-react-native';

export default function PartnerModeScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Typography variant="largeTitle" color={theme.colors.textHigh}>
            Family Dashboard
          </Typography>
          <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 4}}>
            Read-only summary of Sarah's pregnancy journey.
          </Typography>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X color={theme.colors.textMedium} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <Card style={styles.gridCard} variant="filled">
          <Typography variant="subhead" color={theme.colors.textMedium}>Week</Typography>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>24</Typography>
          <Typography variant="caption1" color={theme.colors.textMedium}>Trimester 2</Typography>
        </Card>
        
        <Card style={styles.gridCard} variant="filled">
          <Typography variant="subhead" color={theme.colors.textMedium}>Baby Size</Typography>
          <Typography style={{fontSize: 40}}>🌽</Typography>
          <Typography variant="caption1" color={theme.colors.textMedium}>Ear of Corn</Typography>
        </Card>
      </View>

      <Card style={styles.vibeCard} variant="elevated">
        <Typography variant="headline">General Vibe Today</Typography>
        <View style={styles.vibeRow}>
          <Typography style={{fontSize: 48}}>🙂</Typography>
          <View style={{flex: 1, marginLeft: 16}}>
            <Typography variant="body" color={theme.colors.textMedium}>
              Sarah is feeling generally good today, though slightly fatigued. 
            </Typography>
          </View>
        </View>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        How to Support Her Today
      </Typography>
      <Card style={styles.card} variant="elevated">
        <Typography style={styles.bullet}>• Make sure she is drinking plenty of water.</Typography>
        <Typography style={styles.bullet}>• Offer a gentle lower back massage.</Typography>
        <Typography style={styles.bullet}>• Remind her about the ANC visit next week.</Typography>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        Next Hospital Visit
      </Typography>
      <Card style={styles.card} variant="elevated">
        <Typography variant="headline">October 20th, 10:00 AM</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>Dr. Mensah at General Hospital</Typography>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[5],
    paddingTop: theme.spacing[8],
    backgroundColor: theme.colors.surfaceVariant,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[8],
  },
  closeBtn: {
    padding: theme.spacing[2],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  gridCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[5],
  },
  vibeCard: {
    marginBottom: theme.spacing[6],
  },
  vibeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  bullet: {
    marginBottom: theme.spacing[2],
  }
});

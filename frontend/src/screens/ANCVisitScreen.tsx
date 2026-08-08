import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { CheckCircle2, Clock, CalendarHeart } from 'lucide-react-native';

const PAST_VISITS = [
  { date: '12th Aug', notes: 'First Trimester Scan. Everything normal.' },
  { date: '15th Sep', notes: 'Routine checkup. Blood pressure slightly high.' },
];

const NEXT_VISIT = {
  date: '20th Oct',
  time: '10:00 AM',
  doctor: 'Dr. Mensah',
};

export default function ANCVisitScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Antenatal Care
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 8}}>
          Keep track of your hospital visits.
        </Typography>
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Next Appointment
      </Typography>
      <Card style={styles.highlightCard} variant="filled">
        <View style={styles.row}>
          <CalendarHeart color={theme.colors.primaryDark} size={32} />
          <View style={{marginLeft: theme.spacing[4]}}>
            <Typography variant="headline" color={theme.colors.primaryDark}>{NEXT_VISIT.date} at {NEXT_VISIT.time}</Typography>
            <Typography variant="subhead" color={theme.colors.primaryDark}>{NEXT_VISIT.doctor}</Typography>
          </View>
        </View>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        Preparation Checklist
      </Typography>
      <Card style={styles.card} variant="elevated">
        <View style={styles.checkItem}>
          <CheckCircle2 color={theme.colors.success} size={20} />
          <Typography style={styles.checkText}>Maternal Health Record Book</Typography>
        </View>
        <View style={styles.checkItem}>
          <CheckCircle2 color={theme.colors.success} size={20} />
          <Typography style={styles.checkText}>National Health Insurance Card</Typography>
        </View>
        <View style={styles.checkItem}>
          <CheckCircle2 color={theme.colors.textMedium} size={20} />
          <Typography style={styles.checkText}>List of questions for Dr. Mensah</Typography>
        </View>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        Questions to Ask
      </Typography>
      <Card style={styles.card} variant="elevated">
        <Typography style={styles.bullet}>• Is my current swelling normal?</Typography>
        <Typography style={styles.bullet}>• What exercises are safe this trimester?</Typography>
        <Typography style={styles.bullet}>• Should I change my prenatal vitamins?</Typography>
      </Card>

      <Typography variant="title3" style={styles.sectionTitle}>
        Past Visits
      </Typography>
      {PAST_VISITS.map((visit, idx) => (
        <Card key={idx} style={styles.pastCard} variant="outlined">
          <View style={styles.row}>
            <Clock size={16} color={theme.colors.textMedium} />
            <Typography variant="headline" style={{marginLeft: 8}}>{visit.date}</Typography>
          </View>
          <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 8}}>
            {visit.notes}
          </Typography>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: theme.spacing[5],
    backgroundColor: theme.colors.surfaceVariant,
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[4],
  },
  highlightCard: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    marginBottom: theme.spacing[2],
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  checkText: {
    marginLeft: theme.spacing[3],
  },
  bullet: {
    marginBottom: theme.spacing[2],
  },
  pastCard: {
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.surface,
  }
});

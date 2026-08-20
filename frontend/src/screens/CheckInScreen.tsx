import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Check, X } from 'lucide-react-native';

const QUESTIONS = [
  "Did you sleep well last night?",
  "Are you feeling unusually fatigued today?",
  "Have you been drinking plenty of water?",
  "Are you experiencing any unusual swelling?",
  "Have you felt the baby move today?"
];

const EMOJIS = ['😭', '😔', '😐', '🙂', '🥰'];

export default function CheckInScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [vibe, setVibe] = useState<number | null>(null);

  const handleFinish = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
    // Save to DB and calculate trend
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Typography variant="largeTitle" color={theme.colors.primaryDark}>
          Daily Check-In
        </Typography>
        <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 8}}>
          A quick moment to reflect on your well-being today.
        </Typography>
      </View>

      <Typography variant="headline" style={styles.sectionTitle}>
        General Vibe
      </Typography>
      <Card variant="filled" style={styles.emojiCard}>
        <View style={styles.emojiRow}>
          {EMOJIS.map((emoji, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setVibe(index)}
              style={[styles.emojiBtn, vibe === index && styles.emojiBtnSelected]}
            >
              <Typography style={{fontSize: 32}}>{emoji}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Typography variant="headline" style={styles.sectionTitle}>
        Quick Questions
      </Typography>
      
      {QUESTIONS.map((q, index) => (
        <Card key={index} style={styles.qCard} variant="elevated">
          <Typography variant="body" style={styles.qText}>{q}</Typography>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.btn, answers[index] === true && styles.btnYes]}
              onPress={() => setAnswers(prev => ({...prev, [index]: true}))}
            >
              <Check color={answers[index] === true ? '#fff' : theme.colors.textMedium} size={20} />
              <Typography variant="subhead" color={answers[index] === true ? '#fff' : theme.colors.textMedium} style={{marginLeft: 4}}>Yes</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, answers[index] === false && styles.btnNo]}
              onPress={() => setAnswers(prev => ({...prev, [index]: false}))}
            >
              <X color={answers[index] === false ? '#fff' : theme.colors.textMedium} size={20} />
              <Typography variant="subhead" color={answers[index] === false ? '#fff' : theme.colors.textMedium} style={{marginLeft: 4}}>No</Typography>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      <Button 
        title="Complete Check-In" 
        onPress={handleFinish}
        style={styles.saveBtn}
        disabled={vibe === null || Object.keys(answers).length < QUESTIONS.length}
      />
    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
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
    marginTop: theme.spacing[2],
  },
  emojiCard: {
    marginBottom: theme.spacing[6],
    paddingVertical: theme.spacing[5],
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiBtn: {
    padding: theme.spacing[2],
    borderRadius: theme.radii.pill,
    backgroundColor: 'transparent',
  },
  emojiBtnSelected: {
    backgroundColor: theme.colors.primaryLight,
  },
  qCard: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
  },
  qText: {
    marginBottom: theme.spacing[4],
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.surfaceVariant,
  },
  btnYes: {
    backgroundColor: theme.colors.primary,
  },
  btnNo: {
    backgroundColor: theme.colors.danger,
  },
  saveBtn: {
    marginTop: theme.spacing[6],
    marginBottom: theme.spacing[4],
  }
});

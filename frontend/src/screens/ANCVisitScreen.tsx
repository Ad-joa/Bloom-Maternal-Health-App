import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { CheckCircle2, CalendarHeart, Plus, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getAncVisits, createAncVisit, updateAncVisit } from '../api/api';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';

export default function ANCVisitScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // New Visit Form
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDoctor, setNewDoctor] = useState('');

  const loadVisits = async () => {
    if (user?.id) {
      const data = await getAncVisits();
      setVisits(data || []);
    }
  };

  useEffect(() => {
    loadVisits();
  }, [user]);

  const handleSaveVisit = async () => {
    if (!newDate || !newTime) {
      Alert.alert("Error", "Please provide at least a date and time.");
      return;
    }
    try {
      if (user?.id) {
        await createAncVisit({ date: newDate, time: newTime, doctor: newDoctor });
        setModalVisible(false);
        setNewDate('');
        setNewTime('');
        setNewDoctor('');
        loadVisits();
      }
    } catch (e) {
      Alert.alert("Error", "Could not save visit.");
    }
  };

  const handleMarkAttended = async (visitId: number) => {
    try {
      if (user?.id) {
        await updateAncVisit(visitId, { attendance_status: 'attended' });
        loadVisits();
      }
    } catch (e) {
      Alert.alert("Error", "Could not update attendance.");
    }
  };

  const nextVisit = visits.find(v => v.status === 'scheduled' && v.attendance_status !== 'attended');
  const pastVisits = visits.filter(v => v.status === 'completed' || v.attendance_status === 'attended' || (v.status === 'scheduled' && v !== nextVisit)); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="largeTitle" color={theme.colors.primaryDark}>
            Antenatal Care
          </Typography>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
            <Plus color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        <Typography variant="body" color={theme.colors.textMedium} style={{marginTop: 8}}>
          Keep track of your hospital visits.
        </Typography>
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Next Appointment
      </Typography>
      {nextVisit ? (
        <Card style={styles.highlightCard} variant="filled">
          <View style={styles.row}>
            <CalendarHeart color={theme.colors.primaryDark} size={32} />
            <View style={{marginLeft: theme.spacing[4]}}>
              <Typography variant="headline" color={theme.colors.primaryDark}>{nextVisit.date} at {nextVisit.time}</Typography>
              <Typography variant="subhead" color={theme.colors.primaryDark}>{nextVisit.doctor || 'Routine Checkup'}</Typography>
            </View>
          </View>
        </Card>
      ) : (
        <Card style={styles.card} variant="glass">
          <Typography variant="body" color={theme.colors.textMedium} align="center">
            No upcoming appointments scheduled.
          </Typography>
        </Card>
      )}

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

      <Typography variant="title3" style={[styles.sectionTitle, {marginTop: theme.spacing[6]}]}>
        Past Visits
      </Typography>
      
      {pastVisits.length > 0 ? pastVisits.map((visit, index) => (
        <Card key={index} style={styles.card} variant="glass">
          <View style={styles.row}>
            <View style={styles.dateCircle}>
              <Typography variant="subhead" color={theme.colors.primaryDark}>{visit.date.split(' ')[0]}</Typography>
            </View>
            <View style={{marginLeft: theme.spacing[4], flex: 1}}>
              <Typography variant="headline">{visit.doctor || 'Checkup'} - {visit.time}</Typography>
              <Typography variant="subhead" color={theme.colors.textMedium}>{visit.notes || 'Routine antenatal checkup'}</Typography>
              {visit.attendance_status === 'attended' ? (
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                  <CheckCircle2 color={theme.colors.success} size={16} />
                  <Typography variant="caption1" color={theme.colors.success} style={{marginLeft: 4}}>Attended</Typography>
                </View>
              ) : (
                <TouchableOpacity style={styles.markAttendedBtn} onPress={() => handleMarkAttended(visit.id)}>
                  <Check color="#fff" size={14} />
                  <Typography variant="caption1" color="#fff" style={{marginLeft: 4}}>Mark Attended</Typography>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>
      )) : (
        <Typography variant="body" color={theme.colors.textMedium} align="center" style={{marginTop: 20}}>
          No past visits recorded.
        </Typography>
      )}

      {/* Add Visit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typography variant="title3" style={{marginBottom: 16}}>Schedule Visit</Typography>
            
            <TextInput
              placeholder="Date (e.g. 25th Nov)"
              value={newDate}
              onChangeText={setNewDate}
            />
            <TextInput
              placeholder="Time (e.g. 10:00 AM)"
              value={newTime}
              onChangeText={setNewTime}
            />
            <TextInput
              placeholder="Doctor (Optional)"
              value={newDoctor}
              onChangeText={setNewDoctor}
            />
            
            <Button title="Save Appointment" onPress={handleSaveVisit} style={{marginTop: 16}} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} variant="secondary" style={{marginTop: 8}} />
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  addBtn: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
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
    marginBottom: 12,
  },
  checkText: {
    marginLeft: 12,
    color: theme.colors.textHigh,
  },
  bullet: {
    marginBottom: 8,
    color: theme.colors.textHigh,
  },
  markAttendedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  dateCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastCard: {
    marginBottom: theme.spacing[3],
    backgroundColor: theme.colors.surface,
  }
});

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { CheckCircle2, CalendarHeart, Plus, Check, Circle, X } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getAncVisits, createAncVisit, updateAncVisit, getSymptomLogs } from '../api/api';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ANCVisitScreen() {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Dynamic Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Maternal Health Record Book', checked: true },
    { id: 2, text: 'National Health Insurance Card', checked: true },
    { id: 3, text: 'List of questions for Dr. Mensah', checked: false }
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  
  // New Visit Form
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDoctor, setNewDoctor] = useState('');

  const loadData = async () => {
    if (user?.id) {
      const visitData = await getAncVisits();
      setVisits(visitData || []);
      
      const logData = await getSymptomLogs(user.id);
      if (logData) {
        const withNotes = logData.filter((log: any) => log.notes && log.notes.trim().length > 0);
        setNotes(withNotes);
      }
    }
  };

  useEffect(() => {
    loadData();
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
        loadData();
      }
    } catch (e) {
      Alert.alert("Error", "Could not save visit.");
    }
  };

  const handleMarkAttended = async (visitId: number) => {
    try {
      if (user?.id) {
        await updateAncVisit(visitId, { attendance_status: 'attended' });
        loadData();
      }
    } catch (e) {
      Alert.alert("Error", "Could not update attendance.");
    }
  };

  const nextVisit = visits.find(v => v.status === 'scheduled' && v.attendance_status !== 'attended');
  const pastVisits = visits.filter(v => v.status === 'completed' || v.attendance_status === 'attended' || (v.status === 'scheduled' && v !== nextVisit)); 

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <BackgroundMesh />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="largeTitle" color={theme.colors.textHigh} style={{ fontFamily: theme.typography.families.headingBold }}>
              Antenatal Care
            </Typography>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addBtn}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={StyleSheet.absoluteFillObject} />
              <Plus color={theme.colors.background} size={24} />
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
      <View style={[styles.cardContainer]}>
        <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)']} style={StyleSheet.absoluteFillObject} />
        
        {checklist.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.checkItem, index < checklist.length - 1 && styles.borderBottom]} 
            onPress={() => toggleChecklist(item.id)}
            activeOpacity={0.7}
          >
            {item.checked ? (
              <CheckCircle2 color={theme.colors.primary} size={24} fill={theme.colors.primaryLight} />
            ) : (
              <Circle color={theme.colors.textMedium} size={24} />
            )}
            <Typography style={[styles.checkText, item.checked && { color: theme.colors.textMedium, textDecorationLine: 'line-through' }]}>
              {item.text}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <Typography variant="title3" style={styles.sectionTitle}>
        Doctor's Cheat Sheet
      </Typography>
      <Typography variant="caption1" color={theme.colors.textMedium} style={{marginBottom: 8}}>
        Notes you've saved from your daily tracker to ask your doctor.
      </Typography>
      <Card style={styles.card} variant="elevated">
        {notes.length > 0 ? (
          notes.map((log: any, index: number) => (
            <View key={index} style={{ marginBottom: index === notes.length - 1 ? 0 : 12, paddingBottom: index === notes.length - 1 ? 0 : 12, borderBottomWidth: index === notes.length - 1 ? 0 : 1, borderBottomColor: theme.colors.surfaceVariant }}>
              <Typography variant="caption2" color={theme.colors.textMedium} style={{marginBottom: 4}}>
                Logged on {new Date(log.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
              </Typography>
              <Typography style={styles.bullet}>• {log.notes}</Typography>
            </View>
          ))
        ) : (
          <Typography style={styles.bullet} color={theme.colors.textMedium}>No notes saved yet. Add notes in your Daily Log to see them here!</Typography>
        )}
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
                  <Check color={theme.colors.background} size={14} />
                  <Typography variant="caption1" color={theme.colors.background} style={{marginLeft: 4}}>Mark Attended</Typography>
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
      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Typography variant="title2" style={{ fontFamily: theme.typography.families.headingBold }}>Schedule Visit</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X color={theme.colors.textHigh} size={20} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginBottom: 8, marginLeft: 4 }}>DATE</Typography>
              <TextInput
                placeholder="e.g. Nov 25th"
                value={newDate}
                onChangeText={setNewDate}
                style={styles.premiumInput}
                placeholderTextColor={theme.colors.textMedium}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginBottom: 8, marginLeft: 4 }}>TIME</Typography>
              <TextInput
                placeholder="e.g. 10:00 AM"
                value={newTime}
                onChangeText={setNewTime}
                style={styles.premiumInput}
                placeholderTextColor={theme.colors.textMedium}
              />
            </View>

            <View style={styles.inputGroup}>
              <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginBottom: 8, marginLeft: 4 }}>DOCTOR (OPTIONAL)</Typography>
              <TextInput
                placeholder="e.g. Dr. Mensah"
                value={newDoctor}
                onChangeText={setNewDoctor}
                style={styles.premiumInput}
                placeholderTextColor={theme.colors.textMedium}
              />
            </View>
            
            <TouchableOpacity style={styles.premiumSaveBtn} onPress={handleSaveVisit} activeOpacity={0.8}>
              <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={StyleSheet.absoluteFillObject} />
              <Typography variant="headline" color={theme.colors.background}>Confirm Appointment</Typography>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <View style={{height: 100}} />
    </ScrollView>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  addBtn: {
    padding: 12,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    backgroundColor: isDark ? theme.colors.surface : '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  premiumInput: {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    fontSize: 16,
    fontFamily: theme.typography.families.bodyMedium,
    color: theme.colors.textHigh,
  },
  premiumSaveBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 8,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.6)',
    marginBottom: 24,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing[5],
    paddingTop: 60,
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    color: theme.colors.textMedium,
    fontFamily: theme.typography.families.headingBold,
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
    padding: 16,
  },
  checkText: {
    marginLeft: 12,
    color: theme.colors.textHigh,
    fontFamily: theme.typography.families.bodyMedium,
    fontSize: 16,
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
});

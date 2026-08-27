import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { CheckCircle2, CalendarHeart, Plus, Check, Circle, X, Trash2 } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getAncVisits, createAncVisit, updateAncVisit, getSymptomLogs, deleteAncVisit } from '../api/api';
import { TextInput } from '../components/TextInput';
import { BackgroundMesh } from '../components/BackgroundMesh';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const CHECKLIST_STORAGE_KEY = '@anc_checklist_state';

const defaultChecklist = [
  { id: 1, text: 'Maternal Health Record Book', checked: false },
  { id: 2, text: 'National Health Insurance Card', checked: false },
  { id: 3, text: 'List of questions for the Doctor', checked: false }
];

export default function ANCVisitScreen() {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const { user } = useAuth();
  const [visits, setVisits] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [checklist, setChecklist] = useState(defaultChecklist);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDoctor, setNewDoctor] = useState('');

  useEffect(() => {
    loadData();
    loadChecklist();
  }, [user]);

  const loadData = async () => {
    if (user?.id) {
      try {
        const visitData = await getAncVisits();
        setVisits(visitData || []);
        
        const logData = await getSymptomLogs(user.id);
        if (logData) {
          const withNotes = logData.filter((log: any) => log.notes && log.notes.trim().length > 0);
          setNotes(withNotes);
        }
      } catch (error) {
        console.error("Error loading ANC data:", error);
      }
    }
  };

  const loadChecklist = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (stored) {
        setChecklist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading checklist:", error);
    }
  };

  const toggleChecklist = async (id: number) => {
    const updated = checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setChecklist(updated);
    try {
      await AsyncStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving checklist:", error);
    }
  };

  const handleSaveVisit = async () => {
    if (!newDate || !newTime) {
      Alert.alert("Error", "Please provide a valid date and time.");
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
        await updateAncVisit(visitId, { attendance_status: 'attended', status: 'completed' });
        loadData();
      }
    } catch (e) {
      Alert.alert("Error", "Could not update attendance.");
    }
  };

  const handleDeleteVisit = (visitId: number) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to remove this visit?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAncVisit(visitId);
              loadData();
            } catch (e) {
              Alert.alert("Error", "Could not delete the visit.");
            }
          }
        }
      ]
    );
  };

  const upcomingVisits = visits
    .filter(v => v.status === 'scheduled' && v.attendance_status !== 'attended')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextVisit = upcomingVisits.length > 0 ? upcomingVisits[0] : null;
  const otherUpcoming = upcomingVisits.slice(1);
  
  const pastVisits = visits
    .filter(v => v.status === 'completed' || v.attendance_status === 'attended' || v.status === 'missed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            Track your hospital visits and notes.
          </Typography>
        </View>

        <Typography variant="title3" style={styles.sectionTitle}>
          Next Appointment
        </Typography>
        {nextVisit ? (
          <View style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={[styles.premiumCard, { borderColor: theme.colors.primary, borderWidth: 1 }]}>
              <LinearGradient colors={isDark ? ['rgba(255,255,255,0.05)', 'transparent'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <CalendarHeart color={theme.colors.primaryDark} size={32} />
                  <View style={{marginLeft: theme.spacing[4]}}>
                    <Typography variant="headline" color={theme.colors.textHigh}>{nextVisit.date} at {nextVisit.time}</Typography>
                    <Typography variant="subhead" color={theme.colors.textMedium}>{nextVisit.doctor || 'Routine Checkup'}</Typography>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteVisit(nextVisit.id)} style={styles.iconBtn}>
                  <Trash2 color={theme.colors.danger} size={20} />
                </TouchableOpacity>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.markAttendedBtn} onPress={() => handleMarkAttended(nextVisit.id)}>
                  <Check color={theme.colors.background} size={16} />
                  <Typography variant="caption1" color={theme.colors.background} style={{marginLeft: 4}}>Mark as Attended</Typography>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        ) : (
          <View style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <Typography variant="body" color={theme.colors.textMedium} align="center">
                No upcoming appointments scheduled.
              </Typography>
            </BlurView>
          </View>
        )}

        {otherUpcoming.length > 0 && (
          <View style={{marginTop: 12}}>
            <Typography variant="caption1" style={[styles.sectionTitle, { marginBottom: 8 }]}>OTHER UPCOMING</Typography>
            {otherUpcoming.map(visit => (
              <View key={visit.id} style={[styles.premiumCardWrapper, { marginBottom: 8 }]}>
                <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                       <View style={styles.dateCircle}>
                        <Typography variant="subhead" color={theme.colors.primaryDark}>{visit.date.split('-')[2] || visit.date.split(' ')[0]}</Typography>
                      </View>
                      <View style={{marginLeft: theme.spacing[4]}}>
                        <Typography variant="headline" color={theme.colors.textHigh}>{visit.doctor || 'Checkup'} - {visit.time}</Typography>
                        <Typography variant="subhead" color={theme.colors.textMedium}>{visit.date}</Typography>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteVisit(visit.id)} style={styles.iconBtn}>
                      <Trash2 color={theme.colors.danger} size={20} />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            ))}
          </View>
        )}

        <Typography variant="title3" style={[styles.sectionTitle, { marginTop: 16 }]}>
          Preparation Checklist
        </Typography>
        <View style={styles.cardContainer}>
          <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
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
          Notes saved from your daily tracker to ask your doctor.
        </Typography>
        <View style={[styles.premiumCardWrapper, { backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,200,0.5)' }]}>
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
            {notes.length > 0 ? (
              notes.map((log: any, index: number) => (
                <View key={index} style={{ marginBottom: index === notes.length - 1 ? 0 : 12, paddingBottom: index === notes.length - 1 ? 0 : 12, borderBottomWidth: index === notes.length - 1 ? 0 : 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                  <Typography variant="caption2" color={theme.colors.textMedium} style={{marginBottom: 4}}>
                    Logged on {new Date(log.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                  </Typography>
                  <Typography style={styles.bullet} color={theme.colors.textHigh}>• {log.notes}</Typography>
                </View>
              ))
            ) : (
              <Typography style={styles.bullet} color={theme.colors.textMedium}>No notes saved yet. Add notes in your Daily Log to see them here!</Typography>
            )}
          </BlurView>
        </View>

        <Typography variant="title3" style={[styles.sectionTitle, {marginTop: theme.spacing[6]}]}>
          Past Visits
        </Typography>
        
        {pastVisits.length > 0 ? pastVisits.map((visit, index) => (
          <View key={index} style={styles.premiumCardWrapper}>
            <BlurView intensity={isDark ? 30 : 70} tint={isDark ? 'dark' : 'light'} style={styles.premiumCard}>
              <View style={styles.rowBetween}>
                <View style={styles.row}>
                  <View style={styles.dateCircle}>
                    <Typography variant="subhead" color={theme.colors.primaryDark}>{visit.date.split('-')[2] || visit.date.split(' ')[0]}</Typography>
                  </View>
                  <View style={{marginLeft: theme.spacing[4], flex: 1}}>
                    <Typography variant="headline" color={theme.colors.textHigh}>{visit.doctor || 'Checkup'} - {visit.time}</Typography>
                    <Typography variant="subhead" color={theme.colors.textMedium}>{visit.notes || 'Routine antenatal checkup'}</Typography>
                    
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                      <CheckCircle2 color={theme.colors.success} size={16} />
                      <Typography variant="caption1" color={theme.colors.success} style={{marginLeft: 4}}>Attended on {visit.date}</Typography>
                    </View>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeleteVisit(visit.id)} style={styles.iconBtn}>
                  <Trash2 color={theme.colors.textMedium} size={18} />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
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
                <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginBottom: 8, marginLeft: 4 }}>DATE (YYYY-MM-DD)</Typography>
                <TextInput
                  placeholder="e.g. 2024-11-25"
                  value={newDate}
                  onChangeText={setNewDate}
                  style={styles.premiumInput}
                  placeholderTextColor={theme.colors.textMedium}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Typography variant="caption1" color={theme.colors.textMedium} style={{ marginBottom: 8, marginLeft: 4 }}>TIME (HH:MM AM/PM)</Typography>
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
  premiumCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  premiumCard: {
    padding: 20,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    padding: 8,
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
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
    fontSize: 14,
    fontFamily: theme.typography.families.bodyMedium,
  },
  markAttendedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
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

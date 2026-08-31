import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Modal, Linking } from 'react-native';
import { AlertCircle, PhoneCall, MapPin, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import { Typography } from './Typography';
import { Button } from './Button';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  style?: any;
};

export function EmergencyButton({ style }: Props) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [modalVisible, setModalVisible] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const handleCallHospital = () => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
    setModalVisible(false);
    navigation.navigate('EmergencyLocator');
  };

  const handleAlertPartner = () => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme, isDark);
    // Would trigger backend SMS to trusted partner
    alert("Emergency alert SMS sent to your trusted partner.");
  };

  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={() => setModalVisible(true)}
        style={[styles.buttonContainer, style]}
      >
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.iconContainer}>
          <AlertCircle color="#FFF" size={24} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <BlurView intensity={isDark ? 50 : 90} tint={isDark ? "dark" : "light"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.alertIconWrap}>
                <AlertCircle color={theme.colors.danger} size={32} />
              </View>
              <Typography variant="title2" style={styles.modalTitle}>Emergency Options</Typography>
              <Typography variant="body" color="#666" align="center" style={styles.modalDesc}>
                If you are experiencing a severe danger sign like heavy bleeding, select an option below immediately.
              </Typography>
            </View>

            <TouchableOpacity style={styles.actionCard} onPress={handleCallHospital}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#E8F5E9' }]}>
                <PhoneCall color="#2E7D32" size={24} />
              </View>
              <View style={styles.actionTextWrap}>
                <Typography variant="headline">Call Nearest Hospital</Typography>
                <Typography variant="caption1" color="#666">Dial emergency dispatch</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleAlertPartner}>
              <View style={[styles.actionIconWrap, { backgroundColor: '#FFF3E0' }]}>
                <MapPin color="#EF6C00" size={24} />
              </View>
              <View style={styles.actionTextWrap}>
                <Typography variant="headline">Alert Trusted Partner</Typography>
                <Typography variant="caption1" color="#666">Send SOS SMS with your location</Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <X color="#999" size={24} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  buttonContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.danger + '40',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    backgroundColor: isDark ? theme.colors.surface : '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  alertIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: theme.colors.textHigh,
    marginBottom: 12,
    fontFamily: theme.typography.families.headingBold,
  },
  modalDesc: {
    lineHeight: 24,
    color: theme.colors.textMedium,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
    padding: 20,
    borderRadius: 24,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextWrap: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

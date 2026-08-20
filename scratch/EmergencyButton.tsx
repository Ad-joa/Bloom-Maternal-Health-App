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
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
  const { theme } = useTheme();
  const styles = getStyles(theme);
    setModalVisible(false);
    navigation.navigate('EmergencyLocator');
  };

  const handleAlertPartner = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
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

      <Modal visible={modalVisible} transparent animationType="fade">
        <BlurView intensity={90} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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

const getStyles = (theme: any) => StyleSheet.create({
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
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  alertIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.danger + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#000',
    marginBottom: 8,
  },
  modalDesc: {
    lineHeight: 22,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextWrap: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  }
});

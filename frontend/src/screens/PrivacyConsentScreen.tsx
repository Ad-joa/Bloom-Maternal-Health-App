import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme/theme';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react-native';

export default function PrivacyConsentScreen({ navigation }: any) {
  const [agreed, setAgreed] = useState(false);

  const handleProceed = () => {
    if (agreed) {
      navigation.navigate('Onboarding'); // Or wherever they go next
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ShieldCheck size={48} color={theme.colors.primary} />
        <Typography variant="title2" style={{ marginTop: 16 }}>Privacy & Consent</Typography>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Typography variant="body" color={theme.colors.textMedium} style={{ marginBottom: 16 }}>
          In compliance with the Ghana Data Protection Act (Act 843), we are committed to protecting your personal information.
        </Typography>

        <Typography variant="headline" style={{ marginTop: 16, marginBottom: 8 }}>1. Data Collection</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>
          We collect your health data (vitals, symptoms) solely for the purpose of providing personalized maternal health guidance and tracking.
        </Typography>

        <Typography variant="headline" style={{ marginTop: 16, marginBottom: 8 }}>2. Data Encryption</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>
          Your data is encrypted securely on your device and when transmitted to our cloud servers. Only you and authorized healthcare providers can access it.
        </Typography>

        <Typography variant="headline" style={{ marginTop: 16, marginBottom: 8 }}>3. Your Rights</Typography>
        <Typography variant="body" color={theme.colors.textMedium}>
          You have the right to access, modify, or permanently delete your data at any time from the Profile settings.
        </Typography>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)} activeOpacity={0.8}>
          {agreed ? <CheckSquare color={theme.colors.primary} size={24} /> : <Square color={theme.colors.textMedium} size={24} />}
          <Typography variant="subhead" style={{ marginLeft: 12, flex: 1, color: theme.colors.textHigh }}>
            I have read and agree to the Data Privacy Terms.
          </Typography>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Accept & Continue" 
          onPress={handleProceed} 
          disabled={!agreed} 
          style={{width: "100%"}} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    padding: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

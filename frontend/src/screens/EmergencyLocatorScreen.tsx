import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, PhoneCall, MapPin } from 'lucide-react-native';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Card } from '../components/Card';

// Simulated Ghanaian hospitals/clinics for demonstration
const MOCK_HOSPITALS = [
  { id: '1', name: 'Korle-Bu Teaching Hospital', type: 'Hospital', phone: '+233 30 266 2063', offset: { lat: 0.01, lng: -0.015 } },
  { id: '2', name: 'Ridge Regional Hospital', type: 'Hospital', phone: '+233 30 222 8315', offset: { lat: -0.02, lng: 0.005 } },
  { id: '3', name: 'Community CHPS Compound', type: 'Clinic', phone: '+233 55 123 4567', offset: { lat: 0.005, lng: 0.01 } },
];

export default function EmergencyLocatorScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        setLoading(false);
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (e) {
        setErrorMsg('Could not fetch GPS location.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.danger} />
        <Typography variant="body" style={{ marginTop: 16 }}>Locating nearest hospitals...</Typography>
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="title3" color={theme.colors.danger}>Location Error</Typography>
        <Typography variant="body" align="center" style={{ marginTop: 8 }}>{errorMsg}</Typography>
        <TouchableOpacity style={styles.backBtnFallback} onPress={() => navigation.goBack()}>
          <Typography color="#fff">Go Back</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {MOCK_HOSPITALS.map((hosp) => (
          <Marker
            key={hosp.id}
            coordinate={{
              latitude: location.coords.latitude + hosp.offset.lat,
              longitude: location.coords.longitude + hosp.offset.lng,
            }}
            title={hosp.name}
            description={hosp.type}
            pinColor={hosp.type === 'Hospital' ? theme.colors.danger : theme.colors.primary}
          >
            <Callout tooltip onPress={() => handleCall(hosp.phone)}>
              <View style={styles.calloutCard}>
                <View style={styles.calloutHeader}>
                  <MapPin color={theme.colors.primaryDark} size={16} />
                  <Typography variant="headline" style={{ marginLeft: 4 }}>{hosp.name}</Typography>
                </View>
                <Typography variant="caption1" color="#666" style={{ marginVertical: 4 }}>{hosp.type}</Typography>
                <View style={styles.callBtn}>
                  <PhoneCall color="#fff" size={14} />
                  <Typography variant="caption1" color="#fff" style={{ marginLeft: 4 }}>Call {hosp.phone}</Typography>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Typography variant="headline">Emergency Locator</Typography>
            <Typography variant="caption1" color={theme.colors.danger}>Nearest Facilities</Typography>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <View style={styles.footerPanel}>
        <Card variant="glass" style={styles.infoCard}>
          <Typography variant="headline" color={theme.colors.danger}>SOS Activated</Typography>
          <Typography variant="subhead" style={{ marginTop: 4 }}>Tap on a red or green marker on the map to view the facility and call them directly.</Typography>
        </Card>
      </View>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  headerArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleWrap: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerPanel: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
  calloutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  backBtnFallback: {
    marginTop: 24,
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  }
});

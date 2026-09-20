import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, PhoneCall, MapPin } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme/ThemeContext';
import { Card } from '../components/Card';

import { getHospitals } from '../api/api';

export default function EmergencyLocatorScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { isDark } = useTheme();
  const styles = getStyles(theme, isDark);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Get location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // 2. Fetch hospitals from backend
      const data = await getHospitals();
      setHospitals(data);
    } catch (e) {
      setErrorMsg('Failed to load emergency data.');
    } finally {
      setLoading(false);
    }
  };

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
          <Typography color={theme.colors.background}>Go Back</Typography>
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
        {hospitals.map((hosp, index) => {
          // Generate deterministic offset based on index so they fan out around user
          const offsets = [
            { lat: 0.01, lng: -0.015 },
            { lat: -0.02, lng: 0.005 },
            { lat: 0.005, lng: 0.01 },
            { lat: -0.01, lng: -0.01 }
          ];
          const offset = offsets[index % offsets.length];

          return (
            <Marker
              key={hosp.id}
              coordinate={{
                latitude: location.coords.latitude + offset.lat,
                longitude: location.coords.longitude + offset.lng,
              }}
              title={hosp.name}
              description={`${hosp.distance} away`}
              pinColor={theme.colors.danger}
            >
              <Callout tooltip onPress={() => hosp.phone ? handleCall(hosp.phone) : null}>
                <View style={styles.calloutCard}>
                  <View style={styles.calloutHeader}>
                    <MapPin color={theme.colors.primaryDark} size={16} />
                    <Typography variant="headline" style={{ marginLeft: 4 }}>{hosp.name}</Typography>
                  </View>
                  <Typography variant="caption1" color="#666" style={{ marginVertical: 4 }}>{hosp.distance} • Wait: {hosp.wait_time}</Typography>
                  {hosp.phone && (
                    <View style={styles.callBtn}>
                      <PhoneCall color={theme.colors.background} size={14} />
                      <Typography variant="caption1" color={theme.colors.background} style={{ marginLeft: 4 }}>Call {hosp.phone}</Typography>
                    </View>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <SafeAreaView style={styles.headerArea} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={styles.blurIconWrap}>
              <ChevronLeft color={theme.colors.textHigh} size={24} />
            </BlurView>
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={styles.blurTitleWrap}>
              <Typography variant="headline">Emergency Locator</Typography>
              <Typography variant="caption1" color={theme.colors.danger} style={{ marginTop: 2 }}>Nearest Facilities</Typography>
            </BlurView>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>
      
      <View style={styles.footerPanel}>
        <BlurView intensity={isDark ? 40 : 80} tint={isDark ? "dark" : "light"} style={styles.infoCard}>
          <View style={styles.infoContent}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.pulseDot} />
              <Typography variant="title3" color={theme.colors.danger} style={{fontFamily: theme.typography.families.headingBold}}>SOS Activated</Typography>
            </View>
            <Typography variant="subhead" style={{ marginTop: 6 }} color={theme.colors.textMedium}>
              Tap on a map marker to view the facility and call them directly.
            </Typography>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const getStyles = (theme: any, isDark: boolean = false) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  blurIconWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
  },
  headerTitleWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  blurTitleWrap: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
  },
  footerPanel: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  infoCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
  },
  infoContent: {
    padding: 20,
    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.danger,
    marginRight: 8,
  },
  calloutCard: {
    backgroundColor: isDark ? theme.colors.background : theme.colors.surface,
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

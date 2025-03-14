import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const LocationGate = ({ children }:any) => {
  const [locationStatus, setLocationStatus] = useState('checking');

  useEffect(() => {
    const requestLocation = async () => {
      try {
        const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        setLocationStatus(status === 'granted' ? 'granted' : 'denied');
      } catch (error) {
        console.error('Location permission error:', error);
        setLocationStatus('error');
      }
    };

    requestLocation();
  }, []);

  if (locationStatus === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500', color: '#333' }}>
          Checking location access...
        </Text>
      </View>
    );
  }

  if (locationStatus !== 'granted') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FB' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#D32F2F', marginBottom: 10 }}>
          ⚠ Location Permission Required
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
          Location permission is required to use **InCampus**.
          {'\n\n'}Please enable it in app settings.
        </Text>
      </View>
    );
  }

  return children;
};

export default LocationGate;

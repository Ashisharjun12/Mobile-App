import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const CameraGate = ({ children }:any) => {
  const [cameraStatus, setCameraStatus] = useState('checking');

  useEffect(() => {
    const requestCamera = async () => {
      try {
        const status = await request(PERMISSIONS.ANDROID.CAMERA);
        setCameraStatus(status === 'granted' ? 'granted' : 'denied');
      } catch (error) {
        console.error('Camera permission error:', error);
        setCameraStatus('error');
      }
    };

    requestCamera();
  }, []);

  if (cameraStatus === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500', color: '#333' }}>
          Checking camera access...
        </Text>
      </View>
    );
  }

  if (cameraStatus !== 'granted') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FB' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#D32F2F', marginBottom: 10 }}>
          📷 Camera Permission Required
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
          Camera access is required to use **InCampus**.
          {'\n\n'}Please enable it in app settings.
        </Text>
      </View>
    );
  }

  return children;
};

export default CameraGate;

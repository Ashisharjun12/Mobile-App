import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

const MediaGate = ({ children }:any) => {
  const [mediaStatus, setMediaStatus] = useState('checking');

  useEffect(() => {
    const requestMedia = async () => {
      try {
        const status = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        setMediaStatus(status === 'granted' ? 'granted' : 'denied');
      } catch (error) {
        console.error('Media permission error:', error);
        setMediaStatus('error');
      }
    };

    requestMedia();
  }, []);

  if (mediaStatus === 'checking') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FB' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500', color: '#333' }}>
          Checking media access...
        </Text>
      </View>
    );
  }

  if (mediaStatus !== 'granted') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FB' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#D32F2F', marginBottom: 10 }}>
          🖼️ Media Access Required
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
          Media access is required to use **InCampus**.
          {'\n\n'}Please enable it in app settings.
        </Text>
      </View>
    );
  }

  return children;
};

export default MediaGate;

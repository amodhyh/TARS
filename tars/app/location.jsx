import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export default function LocationMap() {
  const [busLocation, setBusLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const busRef = ref(db, '/Busses/busesInfo/bus001/currentLocation');
    
    const listener = onValue(busRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase data:', data);
      
      if (data) {
        setBusLocation(data);
        
        // Update map region to bus location
        setRegion({
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    });

    // Cleanup listener on unmount
    return () => off(busRef, listener);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {busLocation && (
          <Marker
            coordinate={{
              latitude: busLocation.latitude,
              longitude: busLocation.longitude
            }}
            title="Bus 001"
            description={`Last update: ${new Date(busLocation.timestamp).toLocaleTimeString()}`}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
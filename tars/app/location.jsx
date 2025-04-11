import React, { useEffect, useState } from 'react'; 
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export default function location() {
  const [busLocation, setBusLocation] = useState(null);
  const [noSignal, setNoSignal] = useState(false);
  const [region, setRegion] = useState({
    latitude: 9.3137,
    longitude: 80.4018,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const busRef = ref(db, '/Busses/busesInfo/bus001/currentLocation');
    
    const listener = onValue(busRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Firebase data:', data);
      
      if (data) {
        // Check whether the latitude or longitude indicates "No Signal"
        if (data.latitude === "No Signal" || data.longitude === "No Signal") {
          // Set flag so we can display a message on the UI
          setNoSignal(true);
          // Optionally, reset busLocation to null so no marker is rendered
          setBusLocation(null);
        } else {
          // Reset error flag if valid coordinates are received
          setNoSignal(false);
          setBusLocation(data);
          // Update map region to the bus location
          setRegion({
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
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
              latitude: Number(busLocation.latitude),
              longitude: Number(busLocation.longitude)
            }}
            title="Bus 001"
            description={`Last update: ${new Date(busLocation.timestamp).toLocaleTimeString()}`}
          />
        )}
      </MapView>
      {noSignal && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>No Signal</Text>
        </View>
      )}
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
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  overlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


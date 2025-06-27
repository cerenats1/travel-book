import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen({ route }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const multiPoints = route.params?.selectedPlaces || [];

  const mapRef = useRef(null); 

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum izni reddedildi');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const userCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setCurrentLocation(userCoords);

      
      if (multiPoints.length > 0) {
        const first = multiPoints[0];
        setRegion({
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      } else {
        setRegion({
          ...userCoords,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      setLoading(false);
    })();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Harita hazırlanıyor...</Text>
      </View>
    );
  }

  
  const haversineDistance = (loc1, loc2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.latitude)) *
        Math.cos(toRad(loc2.latitude)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  
  const openDirections = (destination) => {
    if (!currentLocation) {
      Alert.alert('Konum bulunamadı', 'Konumunuzu almak için haritayı tekrar yükleyin');
      return;
    }
    const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const googleMapsURL = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;

    Linking.openURL(googleMapsURL).catch((err) =>
      Alert.alert('Hata', 'Yol tarifi açılırken bir sorun oluştu.')
    );
  };

  
  const routeCoordinates =
    currentLocation && multiPoints.length > 0
      ? [
          currentLocation,
          ...multiPoints.map((pt) => ({
            latitude: pt.latitude,
            longitude: pt.longitude,
          })),
        ]
      : [];

  
  const zoomIn = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.8, 
      longitudeDelta: region.longitudeDelta * 0.8, 
    };
    setRegion(newRegion);
  };

  const zoomOut = () => {
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 1.2, 
      longitudeDelta: region.longitudeDelta * 1.2, 
    };
    setRegion(newRegion);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation ref={mapRef}>
        
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Mevcut Konum"
            pinColor="blue"
          />
        )}

        
        {multiPoints.map((pt) => (
          <Marker
            key={pt.id}
            coordinate={{ latitude: pt.latitude, longitude: pt.longitude }}
            title={pt.name}
            onPress={() => {
              if (currentLocation) {
                const dist = haversineDistance(currentLocation, {
                  latitude: pt.latitude,
                  longitude: pt.longitude,
                });
                Alert.alert(
                  pt.name,
                  `Sana olan uzaklık: ${dist.toFixed(2)} km\n\nYol tarifi için tıklayın`,
                  [
                    {
                      text: 'Yol Tarifi',
                      onPress: () => openDirections({ latitude: pt.latitude, longitude: pt.longitude }),
                    },
                    {
                      text: 'İptal',
                      style: 'cancel',
                    },
                  ]
                );
              }
            }}
          />
        ))}

       
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>

     
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(126, 123, 123, 0.5)', 
    borderRadius: 8,
    padding: 3, 
    zIndex: 1,
    flexDirection: 'column',
  },
  
  zoomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderRadius: 5,
    margin: 2, 
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  
  zoomButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  
});
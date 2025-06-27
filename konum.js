import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const KonumTest = () => {
  const [konum, setKonum] = useState(null);
  const [hata, setHata] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHata('İzin verilmedi');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setKonum(location);
    })();
  }, []);

  if (hata) return <Text>Hata: {hata}</Text>;
  if (!konum) return <ActivityIndicator />;

  return (
    <View>
      <Text>Latitude: {konum.coords.latitude}</Text>
      <Text>Longitude: {konum.coords.longitude}</Text>
    </View>
  );
};

export default KonumTest;

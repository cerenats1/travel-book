import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import placesData from '../data/places';
import { addFavoritePlace } from '../addFavoritePlace';
import { deleteFavoritePlace } from '../deleteFavoritePlace';
import { getFavoritePlaces } from '../getFavoritePlaces';

export default function CityPlaces({ navigation }) {
  const [selectedCity] = useState('sivas');
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await getFavoritePlaces();
      setFavoritePlaces(favs);
    };
    fetchFavorites();
  }, []);

  const isFavorite = (place) => {
    return favoritePlaces.some(
      (fav) =>
        fav.latitude === place.latitude && fav.longitude === place.longitude
    );
  };

  const toggleFavorite = async (place) => {
    const alreadyFavorite = isFavorite(place);

    if (alreadyFavorite) {
      const favoriteDoc = favoritePlaces.find(
        (fav) =>
          fav.latitude === place.latitude &&
          fav.longitude === place.longitude
      );

      if (favoriteDoc) {
        await deleteFavoritePlace(favoriteDoc.id);
        setFavoritePlaces((prev) =>
          prev.filter((fav) => fav.id !== favoriteDoc.id)
        );
        Alert.alert('Favorilerden kaldırıldı');
      }
    } else {
      await addFavoritePlace({
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
      });
      const favs = await getFavoritePlaces();
      setFavoritePlaces(favs);
      Alert.alert('Favorilere eklendi');
    }
  };

  const togglePlaceSelection = (placeId) => {
    setSelectedPlaces((prevSelected) =>
      prevSelected.includes(placeId)
        ? prevSelected.filter((id) => id !== placeId)
        : [...prevSelected, placeId]
    );
  };

  const handleShowRoute = () => {
    if (selectedPlaces.length === 0) {
      Alert.alert('Uyarı', 'Lütfen en az bir yer seçin.');
      return;
    }

    const selectedPlaceObjects = placesData[selectedCity].filter((place) =>
      selectedPlaces.includes(place.id)
    );

    navigation.navigate('MapScreen', { selectedPlaces: selectedPlaceObjects });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {selectedCity.toUpperCase()}’ta Gezilecek Yerler
      </Text>

      
      <Text style={styles.selectedCount}>
        {selectedPlaces.length} yer seçildi
      </Text>

      <FlatList
        data={placesData[selectedCity]}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedPlaces.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selected]}
              onPress={() => togglePlaceSelection(item.id)}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.cardFooter}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons
                    name={isFavorite(item) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite(item) ? 'red' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[
          styles.routeButton,
          selectedPlaces.length === 0 && styles.routeButtonDisabled,
        ]}
        onPress={handleShowRoute}
        disabled={selectedPlaces.length === 0}
      >
        <Text style={styles.routeButtonText}>📍 Seçilenlerle Rota Çiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f4f6f8' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  selectedCount: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  selected: {
    backgroundColor: '#a3d8ff',
  },
  image: {
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  routeButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  routeButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

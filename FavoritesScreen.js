
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("Kullanıcı oturum açmamış.");
          return;
        }

        const favoritesRef = collection(db, "users", user.uid, "favorites");
        const snapshot = await getDocs(favoritesRef);

        const loadedFavorites = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name?.trim() || "İsimsiz Yer",
            latitude: data.latitude,
            longitude: data.longitude,
          };
        });

        setFavorites(loadedFavorites);
      } catch (error) {
        console.error("Favoriler alınırken hata:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoritePress = (item) => {
    navigation.navigate('MapScreen', { selectedPlaces: [item] });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleFavoritePress(item)}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Lat: {item.latitude}</Text>
      <Text>Lon: {item.longitude}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

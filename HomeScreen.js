import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const nav = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      nav.replace('Login');
    } catch (error) {
      Alert.alert('Çıkış Hatası', error.message);
    }
  };

  const handleGoToFavorites = () => {
    setModalVisible(false);
    navigation.navigate('FavoritesScreen');
  };

  return (
    <LinearGradient
      colors={['#74ebd5', '#ACB6E5', '#FEC163']}

      style={styles.container}
    >
      
      <TouchableOpacity style={styles.profileIcon} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-circle-outline" size={40} color="white" />
      </TouchableOpacity>

      <Text style={styles.header}>Travel Book</Text>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gezilecek Yerler</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate('CityPlaces')}
        >
          <Text style={styles.cardButtonText}>Keşfet</Text>
        </TouchableOpacity>
      </View>

     
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => Alert.alert('Profil', 'Profil ayarları yakında.')}>
              <Text style={styles.menuItem}>👤 Profil Ayarları</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoToFavorites}>
              <Text style={styles.menuItem}>❤️ Favorilerim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={styles.menuItem}>🚪 Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  cardButton: {
    backgroundColor: '#a1c4fd',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  cardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 100,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: 180,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
});

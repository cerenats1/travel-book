import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import { TextEncoder, TextDecoder } from 'text-encoding';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}


import LoginScreen from './LoginScreen'; 
import HomeScreen from './HomeScreen';
import FavoritesScreen from './FavoritesScreen';
import MapScreen from './MapScreen';
import CityPlaces from './screens/CityPlaces';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; 
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="HomeScreen" 
              component={HomeScreen} 
              options={{ title: 'Ana Sayfa' }} 
            />
            <Stack.Screen 
              name="MapScreen" 
              component={MapScreen} 
              options={{ title: 'Harita' }} 
            />
            <Stack.Screen 
              name="CityPlaces" 
              component={CityPlaces} 
              options={{ title: 'Gezilecek Yerler' }} 
            />
            <Stack.Screen
             name="FavoritesScreen"
              component={FavoritesScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

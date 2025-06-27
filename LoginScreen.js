import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Giriş başarılı!');
    } catch (error) {
      alert('Giriş hatası: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Kayıt başarılı!');
    } catch (error) {
      alert('Kayıt hatası: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş / Kayıt</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.button}>
        <Button title="Giriş Yap" onPress={handleLogin} />
      </View>
      <View style={{ height: 10 }} />
      <View style={styles.button}>
        <Button title="Kayıt Ol" onPress={handleRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    width: '80%',             
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '80%',             
  },
});

export default LoginScreen;

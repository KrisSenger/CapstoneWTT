import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiURL = process.env.EXPO_PUBLIC_API_URL;

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiURL}/api/token/`, {
        username,
        password,
      });

    if (response.status === 200) {
      const { access, refresh} = response.data;

      await AsyncStorage.setItem('ACCESS_TOKEN', access);
      await AsyncStorage.setItem('REFRESH_TOKEN', refresh);
      navigation.navigate('Home');
    }
  } catch (error) {
    Alert.alert('Login Failed', 'Invalid username or password');
  }
};
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logov1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login:</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#0057e1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default LoginScreen;
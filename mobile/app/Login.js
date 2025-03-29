import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; //Toggle password icon
import axios from 'axios';  
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const apiURL = process.env.EXPO_PUBLIC_API_URL;

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async () => {
    console.log('Login attempted with:', { username}); // Debugging log

    try {
      const response = await axios.post(`${apiURL}/api/token/`, {
        username,
        password,
      });

      console.log('Response status:', response.status); // Debugging log
      console.log('Response data:', response.data); // Debugging log

      if (response.status === 200) {
        const { access, refresh } = response.data;
        await AsyncStorage.setItem('ACCESS_TOKEN', access);
        await AsyncStorage.setItem('REFRESH_TOKEN', refresh);
        console.log('Tokens saved:', { access, refresh }); // Debugging log
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center mb-10">
        <Image source={require('../assets/images/logov1.png')} className="w-full h-auto" resizeMode="contain" />
      </View>
      <View className="flex-1 px-6">
        <Text className="text-2xl text-center mb-4 font-semibold">Login:</Text>
        
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <View className="relative mb-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword} 
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{
              position: 'absolute', 
              right: 10, 
              top: '50%', 
              transform: [{ translateY: -12 }]
            }}
            onPress={() => setShowPassword(!showPassword)} 
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-blue-600 py-3 rounded-lg items-center" onPress={handleLogin}>
          <Text className="text-white text-lg font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

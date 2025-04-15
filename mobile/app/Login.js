import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; // 👈 Icon import
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/api/driver/token/`, {
        username: userName,
        password: password,
      });
      if (res.status === 200) {
        await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
        await AsyncStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigation.navigate("Home");
      }
    } catch (error) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-gray-800">
      
      
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../assets/images/CTS.png")}
          style={{ width: 450, height: 400 }} 
          resizeMode="contain"
        />
      </View>

      {/* Login Form */}
      <View className="px-6 mb-16 bg-gray-800 rounded-t-3xl">
        <Text className="text-3xl font-bold text-blue-700 mb-2 text-center">
          What The Truck!
        </Text>
        <Text className="mb-1 mt-6 text-white/90">Username</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-4 py-2 mb-4 text-white/90"
          placeholder="Enter your username"
          value={userName}
          onChangeText={setUserName}
          placeholderTextColor="#ccc"
          autoCapitalize="none"
        />

        <Text className="mb-1 text-white/90">Password</Text>
        <View className="relative mb-6">
          <TextInput
            className="border border-gray-200 rounded-lg px-4 py-2 pr-12 text-white/90"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#ccc"
            autoCapitalize="none"
          />
          <TouchableOpacity
            className="absolute right-3 top-1.5"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-700 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;


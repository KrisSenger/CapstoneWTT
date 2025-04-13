import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeMessage from '../components/WelcomeMessage';
import TruckPicker from '../components/TruckPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICKED_TRUCK } from '../constants';
import TrailerPicker from '../components/TrailerPicker';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }
  };

  useEffect(() => {
    readData();
  }, []);

  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem(PICKED_TRUCK);
      console.log(value);
    } catch (e) {
      // read error
    }
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-gray-800 h-full">
      {/* Logout Button */}
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color="#ed5829" />
      </TouchableOpacity>

      <WelcomeMessage />

      {/* Dropdown Lists */}
      <View className="w-4/5 my-2">
        <TruckPicker />
        <TrailerPicker />
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity
        className="w-4/5 my-2 bg-blue-700 h-14 justify-center items-center rounded-xl hover:bg-blue-400"
        onPress={() => navigation.navigate('LogbookViewer')}
      >
        <Text className="text-white text-lg font-semibold">Logbook Viewer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-4/5 my-2 bg-blue-700 h-14 justify-center items-center rounded-xl hover:bg-blue-400 "
        onPress={() => navigation.navigate('TripLogger')}
      >
        <Text className="text-white text-lg font-semibold">Pre/Post Trip Logger</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-4/5 my-2 bg-blue-700 h-14 justify-center items-center rounded-xl hover:bg-blue-400"
        onPress={() => navigation.navigate('IncidentReporter')}
      >
        <Text className="text-white text-lg font-semibold">Incident Reporter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;


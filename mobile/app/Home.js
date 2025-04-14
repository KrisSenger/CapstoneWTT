import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import WelcomeMessage from '../components/WelcomeMessage';
import TruckPicker from '../components/TruckPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICKED_TRUCK, PICKED_TRAILER } from '../constants';
import TrailerPicker from '../components/TrailerPicker';

const HomeScreen = ({ navigation }) => {
  const [truckSelected, setTruckSelected] = useState(null);
  const [trailerSelected, setTrailerSelected] = useState(null);
  const isReady = !!truckSelected && !!trailerSelected;
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
      const truck = await AsyncStorage.getItem(PICKED_TRUCK);
      const trailer = await AsyncStorage.getItem(PICKED_TRAILER);
      setTruckSelected(truck);
      setTrailerSelected(trailer);
    } catch (e) {
      console.error("Error reading selected truck/trailer:", e);
    }
  };

  return (
    <View className="flex-1 justify-evenly items-center bg-gray-800 h-full">

      

      <WelcomeMessage />

      {/* Dropdown Lists */}
      <View className="w-4/5 my-2 text-white">
          <TruckPicker onChange={setTruckSelected} />
          <TrailerPicker onChange={setTrailerSelected} />
      </View>
      {!isReady && (
        <Text className="text-red-400 text-xl text-center">
          Please select a truck and trailer to proceed
        </Text>
      )}
      <TouchableOpacity
        className="w-4/5 my-2 h-14 rounded-xl bg-blue-700/70"
        onPress={() => navigation.navigate('LogbookViewer')}
      >
        <View className="flex-row items-center justify-center h-full gap-x-2">
          <MaterialCommunityIcons name="notebook-outline" size={20} color="white" />
          <Text className="text-white text-lg font-semibold">Logbook Viewer</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!isReady}
        className={`w-4/5 my-2 h-14 rounded-xl ${
          isReady ? 'bg-blue-700/70' : 'bg-gray-500'
        }`}
        onPress={() => navigation.navigate('TripLogger')}
      >
        <View className="flex-row items-center justify-center h-full gap-x-2">
          <FontAwesome5 name="truck" size={20} color="white" />
          <Text className="text-white text-lg font-semibold">Pre/Post Trip Logger</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!isReady}
        className={`w-4/5 my-2 h-14 rounded-xl ${
          isReady ? 'bg-blue-700/70' : 'bg-gray-500'
        }`}
        onPress={() => navigation.navigate('IncidentReporter')}
      >
        <View className="flex-row items-center justify-center h-full gap-x-2">
          <MaterialIcons name="warning" size={20} color="white" />
          <Text className="text-white text-lg font-semibold">Incident Reporter</Text>
        </View>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        className="right-36 z-10  mt-20 bg-[#ed5829] w-20 h-10 justify-center items-center rounded-xl "
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>

    </View>
  );
};

export default HomeScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; 
import { PICKED_TRUCK, PICKED_TRAILER } from '../constants'; 

const IncidentReporter = ({ navigation }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [truck, setTruck] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [trailerDisplay, setTrailerDisplay] = useState(null);

  useEffect(() => {
      const fetchAllData = async () => {
        try {
          const storedTruck = await AsyncStorage.getItem(PICKED_TRUCK);
          const storedTrailer = await AsyncStorage.getItem(PICKED_TRAILER);
  
          const response = await api.get('/api/user/data/me/');
          setUser(response.data);
    
          if(storedTrailer === "Other" || storedTrailer === "No Trailer"){
            setTrailerDisplay(storedTrailer);
            setTrailer(null);
          }else{
            setTrailerDisplay(storedTrailer);
            setTrailer(storedTrailer);
          }
          setTruck(storedTruck);

        } catch (error) {
          console.error('Error loading truck/trailer data:', error);
        }
      };
    
      fetchAllData();
    }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images, ImagePicker.MediaType.Videos],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    console.log('Incident Details:', text);
    console.log('Image:', image);
    try {
      const response = await api.post('/api/incident/add/', {
        date: date,
        summary: text,
        truckID: truck,
        trailerID: trailer,
        date: date,
        employeeID: user.employeeID,
      });
      console.log('Incident submitted successfully:', response.data);
      alert('Incident created successfully!');
      navigation.navigate('Home');
    }
    catch (error) {
      console.error('Error submitting incident:', error);
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-800">
      {/* Back Arrow */}
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>

      {/*Selected Truck and Trailer */}
      <View className="flex-col items-end ">
        <Text className="text-xl text-bold text-white p-2 mt-14">Truck: {truck}</Text>
        <Text className="text-xl text-bold   text-white ">Trailer: {trailerDisplay}</Text>
      </View>

      {/* Text Input */}
      <View className="flex-row border border-gray-200 rounded-lg mt-28 p-2 bg-gray-600">
        <TextInput
          className="flex-1 h-60 text-white"
          placeholder="Enter incident details here"
          placeholderTextColor="#d1d5db"
          textAlignVertical='top'
        
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
        <TouchableOpacity className="absolute bottom-2 right-2" onPress={pickImage}>
          <Text className="text-2xl">📷</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity className="mt-4 p-4 bg-blue-600 rounded-lg items-center" onPress={handleSubmit}>
        <Text className="text-white text-lg">Submit</Text>
      </TouchableOpacity>

      {/* Image Preview */}
      {image && <Image source={{ uri: image }} className="w-full h-48 mt-4 rounded-lg" />}
    </View>
  );
};

export default IncidentReporter;

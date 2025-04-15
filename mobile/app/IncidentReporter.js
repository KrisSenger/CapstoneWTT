import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; 
import { PICKED_TRUCK, PICKED_TRAILER } from '../constants'; 
import UploadLogPicture from './../components/UploadLogPicture';


const IncidentReporter = ({ navigation }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date());
  const [truck, setTruck] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [trailerDisplay, setTrailerDisplay] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);



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


    const addPicture = async () => {
      const asset = await UploadLogPicture(); 
      if (asset) {
        setSelectedImage(asset); 
      }
    };
    const uploadSelectedImage = async (incidentIDNum) => {
      if (!selectedImage) return;
    
      const fileName = selectedImage.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(fileName ?? '');
      const fileType = match ? `image/${match[1]}` : `image`;
    
      const formData = new FormData();
      formData.append('incidentID', incidentIDNum);
      formData.append('picture', {
        uri: selectedImage.uri,
        name: fileName,
        type: fileType,
      });
    
      try {
        const response = await api.post('/api/incident/picture/add/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error('❌ Upload failed:', error.response?.data || error.message);
        alert('❌ Upload failed. Try again.');
      }
    };

  const handleSubmit = async () => {
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

      if(selectedImage) {
        await uploadSelectedImage(response.data.incidentID);
      }
      alert('Incident Submitted successfully!');
      navigation.navigate('Home');
    }
    catch (error) {
      console.error('Error submitting incident:', error);
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-800">
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
      </View>
  <View>
  <TouchableOpacity onPress={addPicture} className="mt-4 p-4 bg-blue-700/70 rounded-xl items-center">
      <Text className="text-white text-base">Add a Picture</Text>
  </TouchableOpacity>
  </View>

  {selectedImage && (
    <View style={{ alignSelf: 'center', marginVertical: 10 }}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: selectedImage.uri }}
          style={{ width: 200, height: 200, borderRadius: 10 }}
        />
        <TouchableOpacity
          onPress={() => setSelectedImage(null)}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 2,
            elevation: 4,
          }}
        >
          <Ionicons name="close" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    </View>
  )}

      {/* Submit Button */}
      <TouchableOpacity className="mt-4 p-4 bg-blue-700/70 rounded-xl items-center" onPress={handleSubmit}>
        <Text className="text-white text-lg">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default IncidentReporter;

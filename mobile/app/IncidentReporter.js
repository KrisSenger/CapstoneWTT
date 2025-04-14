import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>

      {/*Selected Truck and Trailer */}
      <View style={styles.buttonRow}>
        <Text style={{ fontSize: 16, color: '#000' }}>Truck: {truck}</Text>
        <Text style={{ fontSize: 16, color: '#000' }}>Trailer: {trailerDisplay}</Text>
      </View>

      {/* Text Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter incident details here"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Image Preview */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10, // Ensures it stays on top
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: '#0057e1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 8,
    marginTop: 150,
    height: 150,
  },
  input: {
    flex: 1,
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  submitButton: {
    backgroundColor: '#0057e1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    },

    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
      },    


  imagePickerText: {
    color: '#ed5829',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default IncidentReporter;

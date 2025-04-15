import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICKED_TRUCK, PICKED_TRAILER } from '../constants';
import api from '../api';
import UploadLogPicture from './../components/UploadLogPicture';


  
const InspectionForm = ({ navigation }) => {
   
  const truckKeyMap = {
    // Tractor/Truck Items
    'Truck Brake Adjustments': 1,
    'Truck Brake Connections': 3,
    'Truck Cargo Securement': 5,
    'Truck Coupling Devices': 7,
    'Truck Dangerous Goods': 9,
    'Truck Frame Body': 11,
    'Truck Inspection Decal': 13,
    'Truck Lamp Reflector': 15,
    'Truck Plate Validation': 17,
    'Truck Suspension System': 19,
    'Truck Tires': 21,
    'Truck Wheels Hubs Fasteners': 23,
    'Air Brake Adjustments': 25,
    'Brake Pedal Boost Gauges': 26,
    'Brakes Warning Lights Low Pressure Vacuum': 27,
    'Compressor': 28,
    'Hoses Connections': 29,
    'Hydraulic Brake Fluid': 30,
    'Parking Brakes': 31,
    'Battery': 32,
    'Defroster Heater': 33,
    'Documents Registration etc': 34,
    'Driver Seat': 36,
    'Emergency Equipment Safety Devices': 37,
    'Exhaust System': 38,
    'Fifth Wheel': 39,
    'Fuel System': 40,
    'General Quality': 41,
    'Glass Mirrors': 42,
    'Horn': 43,
    'Pintle Hook': 44,
    'Power Steering System': 45,
    'Radiator': 46,
    'Steering Mechanism': 47,
    'Towing Attachment': 48,
    'Windshield Wiper Washer Fluid': 49,
  };
  const trailerKeyMap = {
    // Trailer Items
    'Trailer Brake Adjustments': 2,
    'Trailer Brake Connections': 4,
    'Trailer Cargo Securement': 6,
    'Trailer Coupling Devices': 8,
    'Trailer Dangerous Goods': 10,
    'Trailer Frame Body': 12,
    'Trailer Inspection Decal': 14,
    'Trailer Lamp Reflector': 16,
    'Trailer Plate Validation': 18,
    'Trailer Suspension System': 20,
    'Trailer Tires': 22,
    'Trailer Wheels Hubs Fasteners': 24,
  };
  const [user, setUser] = useState(null);
  const [trailerDisplay, setTrailerDisplay] = useState('');
  const [truckDisplay, setTruckDisplay] = useState('');
  const [trailer, setTrailer] = useState(null);
  const [truck, setTruck] = useState(null);
  const [carrier, setCarrier] = useState('Chinook Transport Services Ltd.');
  const [carrierAddress, setCarrierAddress] = useState('2612 58 Ave SE, Calgary, AB T2C 1G5');
  const [userCity, setUserCity] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [odometer, setOdometer] = useState(0);
  const [trailerPlate, setTrailerPlate] = useState();
  const [answers, setAnswers] = useState([]);
  const [showBoxes, setShowBoxes] = useState(false);
  const [date, setDate] = useState(new Date());
  const [remarks, setRemarks] = useState();
  const [loadWeight, setLoadWeight] = useState(0);
  const [loadHeight, setLoadHeight] = useState(0);
  const [defects, setDefects] = useState();
  const [incidents, setIncidents] = useState();
  const [trips, setTrips] = useState(0);
  const [declaration, setDeclaration] = useState(1);
  const [logIDNumber, setLogIDNumber] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0});
    }
  }, [showBoxes]);
  const toggleAnswer = (id) => {
    setAnswers((prev) =>
      prev.includes(id) ? prev.filter((val) => val !== id) : [...prev, id]
    );
    console.log('Selected answers:', answers);
  };
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const storedTruck = await AsyncStorage.getItem(PICKED_TRUCK);
        const storedTrailer = await AsyncStorage.getItem(PICKED_TRAILER);

        const { data: truckData } = await api.get('/api/truck/data/');
        const { data: trailerData } = await api.get('/api/trailer/data/');
        const response = await api.get('/api/user/data/me/');
        setUser(response.data);
  
        
        const selectedTrailer = trailerData.find(
          (item) => item.trailerID === Number(storedTrailer)
        );
        if (selectedTrailer) {
          setTrailer(selectedTrailer.trailerID);
          setTrailerDisplay(selectedTrailer.trailerID);
          setTrailerPlate(selectedTrailer.license_plate);
        }else if(storedTrailer === "Other" || storedTrailer === "No Trailer"){
          setTrailerDisplay(storedTrailer);
          setTrailerPlate(storedTrailer);
          setTrailer(null);
        }
        const selectedTruck = truckData.find(
          (item) => item.truckID === Number(storedTruck)
        );
        if (selectedTruck) {
          setTruck(selectedTruck);
          setTruckDisplay(selectedTruck.truckID);
          setOdometer(selectedTruck.odometer);
        }
  
      } catch (error) {
        console.error('Error loading truck/trailer data:', error);
      }
    };
  
    fetchAllData();
  }, []);

  const pushLog = async () => {
    try {
      const response = await api.post('/api/log/add/', {
        trip: trips,
        location: userLocation,
        city: userCity,
        date: date,
        load: loadWeight,
        height: loadHeight,
        defects_en_route: defects,
        incidents: incidents,
        remarks: remarks,
        declaration: declaration,
        signature: user.first_name,
        employeeID: user.employeeID,
        trailerID: trailer,
        truckID: truck.truckID,
      });
      console.log('Log created successfully:', response.data.logID);
      setLogIDNumber(response.data.logID);
      //Switch disply to allow the user to fill out the check boxes
      if(declaration === 0){
        setShowBoxes(true);
      }else{
        alert('Log created successfully!');
        navigation.navigate('Home');
      }
      console.log('Log created successfully:', response.data);
      

    } catch (error) {
      console.error('Error creating log:', error);
      console.log({
        trip: trips,
        location: userLocation,
        city: userCity,
        date: date,
        load: loadWeight,
        height: loadHeight,
        defects_en_route: defects,
        incidents: incidents,
        remarks: remarks,
        declaration: declaration,
        signature: user.first_name,
        employeeID: user.employeeID,
        trailerID: trailer,
        truckID: truck.truckID,
      });
    }
  }
  const submitAnswers = async () => {
    try {
      for (const detailId of answers) {
        const payload = {
          logID: logIDNumber, 
          itemID: detailId
        };
  
        console.log('Sending payload:', payload);
        await api.post('api/log-inspect-det/add/', payload);
      }
      await uploadSelectedImage();
      console.log('All details submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };
  const addPicture = async () => {
    const asset = await UploadLogPicture(); 
    if (asset) {
      setSelectedImage(asset); 
    }
  };
  const uploadSelectedImage = async () => {
    if (!selectedImage) return;
  
    const fileName = selectedImage.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName ?? '');
    const fileType = match ? `image/${match[1]}` : `image`;
  
    const formData = new FormData();
    formData.append('logID', logIDNumber);
    formData.append('picture', {
      uri: selectedImage.uri,
      name: fileName,
      type: fileType,
    });
  
    try {
      const response = await api.post('/api/log/picture/add/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error.response?.data || error.message);
      alert('❌ Upload failed. Try again.');
    }
  };


  return (
    <ScrollView 
    className="flex-1 p-5 bg-gray-800 pb-10"
    contentContainerStyle={{ paddingBottom: 25 }}
    ref={scrollRef}>
          {/* Back Button */}
          <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={30} color="#ed5829" />
          </TouchableOpacity>

          {!showBoxes && (
            <>
          <View className="flex-row justify-around mt-20 ">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setTrips(0)} className="mr-2">
                {trips === 0 ? (
                  <Ionicons name="checkbox" size={24} color="#2563eb" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold">Pre-Trip</Text>
            </View>

            <View className="flex-row justify-center ">
              <TouchableOpacity onPress={() => setTrips(1)} className="mr-2">
                {trips === 1 ? (
                  <Ionicons name="checkbox" size={24} color="#2563eb" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text className="text-2xl text-white font-bold">Post-Trip</Text>
            </View>
          </View>
        <View className="flex-row justify-around mt-5 ">
          <View className=" mb-4">
              <Text className="text-2xl font-bold mt-5 mb-2 text-white">Truck:</Text>
              <Text className="text-white text-xl font-bold">{truckDisplay}</Text>
            </View>
            <View className="mb-4">
              <Text className="text-2xl font-bold mt-5 mb-2 text-white">Trailer:</Text>
              <Text className="text-white text-xl font-bold">{trailerDisplay}</Text>
            </View>
         </View>
          
          {/* Carrier field */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Carrier:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter carrier name here"
              placeholderTextColor='#d1d5db'
              value={carrier}
              onChangeText={setCarrier}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Carrier address field */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Carrier Address:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter carrier address here"
              placeholderTextColor='#d1d5db'
              value={carrierAddress}
              onChangeText={setCarrierAddress}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* City */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">City:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter carrier address here"
              placeholderTextColor='#d1d5db'
              value={userCity}
              onChangeText={setUserCity}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Location */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Location</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter a short description of the location"
              placeholderTextColor='#d1d5db'
              value={userLocation}
              onChangeText={setUserLocation}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Date */}
          <View className="flex-row items-center mb-2 mt-5 ">
            <Text className="text-xl font-bold text-white p-2 ">Date:</Text>
            <Text className="text-xl text-white">{date.toLocaleString()}</Text>
          </View>

          {/* Load Weight*/}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Load Weight:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter the weight of the load"
              placeholderTextColor="#d1d5db"
              value={loadWeight}
              onChangeText={setLoadWeight}
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View>
          {/* Load Height*/}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Load Height:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter the height of the load"
              placeholderTextColor="#d1d5db"
              value={loadHeight}
              onChangeText={setLoadHeight}
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View> 
          {/* Odomoter */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Odomoter:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter the current KM count of the vehicle"
              placeholderTextColor='#d1d5db'
              value={odometer}
              onChangeText={setOdometer}
              multiline={true}
              numberOfLines={10}
            />
          </View>

          {/* Trailer License Plate */}
          <View className="mb-4">
            <Text className="text-xl font-bold mt-5 mb-2 text-white">Trailer License Plate:</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded p-2 text-white bg-gray-600"
              placeholder="Enter the license plate for the trailer"
              placeholderTextColor='#d1d5db'
              value={trailerPlate}
              onChangeText={setTrailerPlate}
              multiline={true}
              numberOfLines={10}
            />
          </View>
                {/* Remarks Textbox */}
          <View className="mb-4">
          <Text className="text-xl font-bold mt-5 mb-2 text-white">Remarks:</Text>
          <TextInput
            className="h-24 border border-gray-200 rounded p-2 text-white bg-gray-600 "
            placeholder="Enter incident details here"
            placeholderTextColor='#d1d5db'
            value={remarks}
            onChangeText={setRemarks}
            multiline={true}
            textAlignVertical='top'
            numberOfLines={10}
          />
        </View>
        {/* Defects Textbox */}
        <View className="mb-4">
          <Text className="text-xl font-bold mt-5 mb-2 text-white">Defects en Route:</Text>
          <TextInput
            className="h-24 border border-gray-200 rounded p-2 text-white bg-gray-600"
            placeholder="Enter defect details here"
            placeholderTextColor='#d1d5db'
            value={defects}
            onChangeText={setDefects}
            multiline={true}
            numberOfLines={10}
          />
        </View>
        {/* Defects Textbox */}
        <View className="mb-4">
          <Text className="text-xl font-bold mt-5 mb-2 text-white">Incidents:</Text>
          <TextInput
            className="h-24 border border-gray-200 rounded p-2 text-white bg-gray-600 "
            placeholder="Enter Incident details here"
            placeholderTextColor='#d1d5db'
            value={incidents}
            onChangeText={setIncidents}
            multiline={true}
            numberOfLines={10}
          />
        </View>
        {/* Declaration Checkbox */}
        <View className="flex-row items-center space-x-2  my-2">
          <Text className="text-xl font-bold  text-white p-2 mr-3">Issues:</Text>
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setDeclaration(1)} className="mr-1">
                {declaration === 1 ? (
                  <Ionicons name="checkbox" size={24} color="#2563eb" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text className="text-base text-white mr-2">No</Text>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setDeclaration(0)} className="mr-1">
                {declaration === 0 ? (
                  <Ionicons name="checkbox" size={24} color="#2563eb" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text className="text-base text-white">Yes</Text>
            </View>
          </View>

      {/* Submit Button */}
      <TouchableOpacity onPress={pushLog} className="mt-5 bg-blue-600 rounded items-center p-5">
        <Text className="text-white text-base ">Submit</Text>
      </TouchableOpacity>
      </>
      )}
      {/* Checkbox Section*/}
      {showBoxes && (
      <>
      {/* Tractor/Truck Section */}

      <Text className="text-xl font-bold mt-20 mb-2 text-white ">Tractor/Truck:</Text>
      {Object.entries(truckKeyMap).map(([label, id]) => (
        <View key={`truck-${id}`} className="flex-row items-center mb-2 ">
          <TouchableOpacity onPress={() => toggleAnswer(id)} className="mr-2">
            {answers.includes(id) ? (
              <Ionicons name="checkbox" size={24} color="#2563eb" />
            ) : (
              <Ionicons name="square-outline" size={24} color="gray" />
            )}
          </TouchableOpacity>
          <Text className="text-lg text-white p-1">{label}</Text>
        </View>
      ))}

      <Text className="text-xl font-bold mt-5 mb-2 text-white">Trailer:</Text>
      {Object.entries(trailerKeyMap).map(([label, id]) => (
        <View key={`trailer-${id}`} className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => toggleAnswer(id)} className="mr-2">
            {answers.includes(id) ? (
              <Ionicons name="checkbox" size={24} color="#2563eb" />
            ) : (
              <Ionicons name="square-outline" size={24} color="gray" />
            )}
          </TouchableOpacity>
          <Text className="text-lg text-white p-1">{label}</Text>
        </View>

      ))}
          <View>
          <TouchableOpacity onPress={addPicture} className="mt-5 p-4 bg-blue-600 rounded items-center">
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
          
          <TouchableOpacity onPress={submitAnswers} className="mt-24 p-4 bg-blue-600 rounded items-center">
            <Text className="text-white text-base">Submit Details</Text>
          </TouchableOpacity>
          
      </>
      )}

    </ScrollView>
  );
};

export default InspectionForm;

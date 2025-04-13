import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import TrailerPicker from '../components/TrailerPicker';
import TruckPicker from '../components/TruckPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICKED_TRUCK, PICKED_TRAILER } from '../constants';
import api from '../api';


  
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
  const [trailers, setTrailers] = useState([]);
  const [trucks, setTrucks] = useState([]);
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
        setTrucks(truckData);
        setTrailers(trailerData);
  
        
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
        logID: 2010,
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
        navigation.navigate('Home');
      }
      console.log('Log created successfully:', response.data);

    } catch (error) {
      console.error('Error creating log:', error);
      console.log({
        logID: 2010,
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
  
        console.log('Sending payload:', payload); // optional debug log
  
        await api.post('api/log-inspect-det/add/', payload);
      }
  
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



  return (
    <ScrollView style={styles.container}>
          {/* Back Button */}
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={30} color="#ed5829" />
          </TouchableOpacity>

          {!showBoxes && (
            <>
          <View style={styles.checkboxGroup}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setTrips(0)} style={styles.checkbox}>
                {trips === 0 ? (
                  <Ionicons name="checkbox" size={24} color="blue" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Pre-Trip</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setTrips(1)} style={styles.checkbox}>
                {trips === 1 ? (
                  <Ionicons name="checkbox" size={24} color="blue" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Post-Trip</Text>
            </View>
          </View>
         <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Truck</Text>
            <Text>{truckDisplay}</Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Trailer</Text>
            <Text>{trailerDisplay}</Text>
          </View>
          
          {/* Carrier field */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Carrier</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter carrier name here"
              placeholderTextColor='#888'
              value={carrier}
              onChangeText={setCarrier}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Carrier address field */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Carrier Address</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter carrier address here"
              placeholderTextColor='#888'
              value={carrierAddress}
              onChangeText={setCarrierAddress}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* City */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>City</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter carrier address here"
              placeholderTextColor='#888'
              value={userCity}
              onChangeText={setUserCity}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Location */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Location</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter a short description of the location"
              placeholderTextColor='#888'
              value={userLocation}
              onChangeText={setUserLocation}
              multiline={true}
              numberOfLines={10}
            />
          </View>
          {/* Date */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Date</Text>
            <Text>{date.toLocaleString()}</Text>
          </View>
          {/* Load Weight*/}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Load Weight</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter the weight of the load"
              placeholderTextColor="#888"
              value={loadWeight}
              onChangeText={setLoadWeight}
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View>
          {/* Load Height*/}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Load Height</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter the height of the load"
              placeholderTextColor="#888"
              value={loadHeight}
              onChangeText={setLoadHeight}
              keyboardType="numeric"
              multiline={false}
              numberOfLines={1}
            />
          </View> 
          {/* Odomoter */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Odomoter</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter the current KM count of the vehicle"
              placeholderTextColor='#888'
              value={odometer}
              onChangeText={setOdometer}
              multiline={true}
              numberOfLines={10}
            />
          </View>

          {/* Trailer License Plate */}
          <View style={styles.remarksContainer}>
            <Text style={styles.sectionHeader}>Trailer License Plate</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter the license plate for the trailer"
              placeholderTextColor='#888'
              value={trailerPlate}
              onChangeText={setTrailerPlate}
              multiline={true}
              numberOfLines={10}
            />
          </View>
                {/* Remarks Textbox */}
          <View style={styles.remarksContainer}>
          <Text style={styles.sectionHeader}>Remarks</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Enter incident details here"
            placeholderTextColor='#888'
            value={remarks}
            onChangeText={setRemarks}
            multiline={true}
            numberOfLines={10}
          />
        </View>
        {/* Defects Textbox */}
        <View style={styles.remarksContainer}>
          <Text style={styles.sectionHeader}>Defects en Route</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Enter defect details here"
            placeholderTextColor='#888'
            value={defects}
            onChangeText={setDefects}
            multiline={true}
            numberOfLines={10}
          />
        </View>
        {/* Defects Textbox */}
        <View style={styles.remarksContainer}>
          <Text style={styles.sectionHeader}>Incidents</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Enter Incident details here"
            placeholderTextColor='#888'
            value={incidents}
            onChangeText={setIncidents}
            multiline={true}
            numberOfLines={10}
          />
        </View>
        {/* Declaration Checkbox */}
        <View style={styles.checkboxGroup}>
          <Text style={styles.sectionHeader}>Is there any issues with the truck or trailer?</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setDeclaration(1)} style={styles.checkbox}>
                {declaration === 1 ? (
                  <Ionicons name="checkbox" size={24} color="blue" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>No</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity onPress={() => setDeclaration(0)} style={styles.checkbox}>
                {declaration === 0 ? (
                  <Ionicons name="checkbox" size={24} color="blue" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="gray" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Yes</Text>
            </View>
          </View>

      {/* Submit Button */}
      <TouchableOpacity onPress={pushLog} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      </>
      )}
      {/* Checkbox Section*/}
      {showBoxes && (
      <>
      {/* Tractor/Truck Section */}
      <TouchableOpacity onPress={submitAnswers} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Details</Text>
      </TouchableOpacity>
      <Text style={styles.sectionHeader}>Tractor/Truck</Text>
      {Object.entries(truckKeyMap).map(([label, id]) => (
        <View key={`truck-${id}`} style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => toggleAnswer(id)} style={styles.checkbox}>
            {answers.includes(id) ? (
              <Ionicons name="checkbox" size={24} color="blue" />
            ) : (
              <Ionicons name="square-outline" size={24} color="gray" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
      ))}

      <Text style={styles.sectionHeader}>Trailer</Text>
      {Object.entries(trailerKeyMap).map(([label, id]) => (
        <View key={`trailer-${id}`} style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => toggleAnswer(id)} style={styles.checkbox}>
            {answers.includes(id) ? (
              <Ionicons name="checkbox" size={24} color="blue" />
            ) : (
              <Ionicons name="square-outline" size={24} color="gray" />
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
      ))}
      </>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  remarksInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', 
  },
  smallInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', 
  },
  submitButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#0057e1',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default InspectionForm;

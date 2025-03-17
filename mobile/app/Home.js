import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState('');

  const vehicleData = [
    { key: '1', value: 'Vehicle 1' },
    { key: '2', value: 'Vehicle 2' },
    // Add more vehicles as needed
  ];

  const trailerData = [
    { key: '1', value: 'Trailer 1' },
    { key: '2', value: 'Trailer 2' },
    // Add more trailers as needed
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color="#ed5829" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Welcome John Doe</Text>
      
      {/* Dropdown Lists */}
      <View style={styles.selectListContainer}>
        <View style={styles.selectListWrapper}>
          <SelectList 
            setSelected={(val) => setSelectedVehicle(val)} 
            data={vehicleData} 
            save="value"
            placeholder='Select a Vehicle'
          />
        </View>
        <View style={styles.selectListWrapper}>
          <SelectList 
            setSelected={(val) => setSelectedTrailer(val)} 
            data={trailerData} 
            save="value"
            placeholder='Select a Trailer'
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Logbook Viewer"
          onPress={() => navigation.navigate('LogbookViewer')}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Pre/Post Trip Logger"
          onPress={() => navigation.navigate('TripLogger')}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Incident Reporter"
          onPress={() => navigation.navigate('IncidentReporter')}
          color="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#0057e1',
    height: 60,
    justifyContent: 'center',
    borderRadius: 15,
  },
  selectListContainer: {
    width: '80%',
    marginVertical: 10,
  },
  selectList: {
    marginBottom: 20,
  },
  selectListWrapper: {
    marginBottom: 20, // Add space between the dropdown lists
  },
  buttonRow: {
    width: '80%',
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10, // Ensures it stays on top
  },
});

export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WelcomeMessage from '../components/WelcomeMessage';
import TruckPicker from '../components/TruckPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PICKED_TRUCK } from '../constants';
import api from '../api';
import TrailerPicker from '../components/TrailerPicker';


const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Handle logout logic here
    clearAll();
    
    navigation.navigate('Login');
  };
  const clearAll = async () => { 
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }
  }

  useEffect(() => {
    readData();
  }, [])



  const readData = async () => {
    try {
      const value = await AsyncStorage.getItem(PICKED_TRUCK)
      console.log(value)
    } catch(e) {
      // read error
    }
  }

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={30} color="#ed5829" />
      </TouchableOpacity>

      <WelcomeMessage />

      
      {/* Dropdown Lists */}
      <View style={styles.selectListContainer}>
        <TruckPicker />
        <TrailerPicker />
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

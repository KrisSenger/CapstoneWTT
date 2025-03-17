import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
const InspectionForm = ({ navigation }) => {
   
  const tractorTruckItems = [
    'Brake Adjustments',
    'Brake Connections',
    'Cargo Securement',
    'Coupling Devices',
    'Dangerous Goods Placard/Holder',
    'Frame & Cargo Body',
    'Inspection Decal',
    'Lamps & Reflectors',
    'Plate Validation Sticker',
    'Suspension System',
    'Tires',
    'Wheels/Hubs/Fasteners',
    'Air Brake Adjustments',
    'Brakes - Pedal/Booster/Gauges',
    'Brakes - Warning Lights',
    'Compressor',
    'Hoses & Connections',
    'Hydraulic Brake Fluid',
    'Parking Brakes',
    'Battery',
    'Detester/Heater',
    'Documents - Registration, etc.',
    'Driver Seat',
    'Emergency Equipment/Safety Devices',
    'Exhaust System',
    'Fifth Wheel',
    'Fuel System',
    'General',
    'Glass & Mirrors',
    'Horn',
    'Pintle Hook',
    'Power Steering System',
    'Radiator',
    'Steering Mechanism',
    'Towing Attachment',
    'Windshield Wiper/Washer',
  ];

  const trailerItems = [
    'Brake Adjustments',
    'Brake Connections',
    'Cargo Securement',
    'Coupling Devices',
    'Frame & Cargo Body',
    'Inspection Decal',
    'Lamps & Reflectors',
    'Plate Validation Sticker',
    'Suspension System',
    'Tires',
    'Wheels/Hubs/Fasteners',
  ];
  const [text, setText] = useState('');

  const [answers, setAnswers] = useState({});

  const toggleAnswer = (item) => {
    setAnswers((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>
      
      {/* Carrier field */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Carrier</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Enter carrier name here"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
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
          value={text}
          onChangeText={setText}
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
          value={text}
          onChangeText={setText}
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
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      {/* Date */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Date</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Enter the date and time of the inspection"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      {/* Make and Model */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Make/Model</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Enter the make and model of the vehicle"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      {/* Odomoter */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Odomoter</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Enter the current KM count of the vehicle"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      {/* Truck License Plate */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Truck License Plate</Text>
        <TextInput
          style={styles.smallInput}
          placeholder="Enter the license plate for the truck"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
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
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>
      <Text style={styles.headerText}>Driver's Daily Vehicle Inspection Report</Text>

      {/* Tractor/Truck Section */}
      <Text style={styles.sectionHeader}>Tractor/Truck</Text>
      {tractorTruckItems.map((item, index) => (
        <View key={`tractor-${index}`} style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => toggleAnswer(item)} style={styles.checkbox}>
            {answers[item] ? <Ionicons name="checkbox" size={24} color="blue" /> : <Ionicons name="square-outline" size={24} color="gray" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{item}</Text>
        </View>
      ))}

      {/* Trailer Section */}
      <Text style={styles.sectionHeader}>Trailer</Text>
      {trailerItems.map((item, index) => (
        <View key={`trailer-${index}`} style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => toggleAnswer(item)} style={styles.checkbox}>
            {answers[item] ? <Ionicons name="checkbox" size={24} color="blue" /> : <Ionicons name="square-outline" size={24} color="gray" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>{item}</Text>
        </View>
      ))}
      {/* Remarks Textbox */}
      <View style={styles.remarksContainer}>
        <Text style={styles.sectionHeader}>Remarks</Text>
        <TextInput
          style={styles.remarksInput}
          placeholder="Enter incident details here"
          placeholderTextColor='#888'
          value={text}
          onChangeText={setText}
          multiline={true}
          numberOfLines={10}
        />
      </View>


      {/* Submit Button */}
      <TouchableOpacity onPress={() => console.log(answers)} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
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
});

export default InspectionForm;

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import api from '../api';
import LoadingCircle from '../components/LoadingCircle';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SpecificLog = ({navigation}) => {
  const route = useRoute();
  const { id } = route.params;
  const [log, setLog] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    console.info("Fetching log details for log ID:", id);
    api
      .get(`/api/log/${id}/`)
      .then((response) => setLog(response.data))
      .catch((error) => console.error("Error fetching log details:", error));
  }, [id]);

  if (!log) return <LoadingCircle />;
  const {
    truck_items_group1 = [],
    truck_items_group2 = [],
    truck_items_group3 = [],
    trailer_items = [],
  } = log.inspection_items || {};

  const anyDefects = log.any_defects;

  return (
    <ScrollView>
        <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={30} color="#ed5829" />
          </TouchableOpacity>
      <Text>Your Daily Inspection for log {log.logID}</Text>

      <View>
        <View>
          <Text>TRUCK ID: {log.truckID}</Text>
          <Text>TRAILER ID: {log.trailerID}</Text>
        </View>
        <View>
          <Text>TRIP: {log.trip === 1 ? "Post Trip" : "Pre Trip"}</Text>
          <Text>DATE: {(log.date)}</Text>
          <Text>LOCATION: {log.location}</Text>
          <Text>CITY: {log.city}</Text>
          <Text>TRUCK JURISDICTION: {log.truck_jurisdiction}</Text>
          <Text>TRAILER JURISDICTION: {log.trailer_jurisdiction}</Text>
        </View>
      </View>

      <View>
        <View>
          <Text>LOAD: {log.load}</Text>
          <Text>HEIGHT: {log.height}</Text>
          <Text>INCIDENTS: {log.incidents}</Text>
        </View>
        <View>
          <Text>Declaration: {log.declaration === 1 ? 'Yes' : 'No'}</Text>
          <Text>Driver Name: {log.driver_name}</Text>
          <Text>Signature: {log.signature}</Text>
        </View>
      </View>

      <View>
        <Text>No Defects Found: {anyDefects ? 'No' : 'Yes'}</Text>
        <Text>Defects Found: {anyDefects ? 'Yes' : 'No'}</Text>
      </View>

      <View>
        {[truck_items_group1, truck_items_group2, truck_items_group3, trailer_items].map((group, index) => (
          <View key={index}>
            <Text>{index < 3 ? 'Tractor / Truck' : 'Trailer'}</Text>
            {group.map((item) => (
              <View key={item.itemID} >
                  {item.defective ? (
                        <Ionicons name="checkbox" size={24} color="#2563eb" /> 
                    ) : (
                        <Ionicons name="square-outline" size={24} color="gray" />
                    )}
                    <Text>
                        {item.item_name}
                    </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View>
        <Text>Defects en route: {log.defects_en_route}</Text>
        <Text>Remarks</Text>
        <Text>{log.remarks}</Text>
      </View>

      <View>
        <Text >Pictures</Text>
        {log.pictures && log.pictures.length > 0 ? (
          <View >
            {log.pictures.map((pic) => (
              <TouchableOpacity key={pic.logpicID}>
                <Image source={{ uri: pic.picture }} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text>No pictures available.</Text>
        )}
      </View>
    </ScrollView>
  );
};



export default SpecificLog;
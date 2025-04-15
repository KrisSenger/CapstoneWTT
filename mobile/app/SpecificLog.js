import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import api from '../api';
import LoadingCircle from '../components/LoadingCircle';
import DynamicImage from '../components/DynamicImage';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const SpecificLog = ({navigation}) => {
  const route = useRoute();
  
  const { id } = route.params;
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/log/${id}/`);
        setLog(response.data);
      } catch (error) {
        console.error("Error fetching log details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  if (loading || !log) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-800">
        <LoadingCircle />
      </View>
    );
  }

  const {
    truck_items_group1 = [],
    truck_items_group2 = [],
    truck_items_group3 = [],
    trailer_items = [],
  } = log.inspection_items || {};

  const anyDefects = log.any_defects;

  return (
    <View className="flex-1 bg-gray-800">
      {/* Back Arrow */}
      <TouchableOpacity className=" top-14 left-4 z-10" onPress={() => navigation.navigate('LogbookViewer')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center mt-16 mb-4 text-white">Daily Inspection Log #{log.logID}</Text>

      <ScrollView className="px-4">
        <View className="bg-gray-600 p-4 rounded-lg mb-5">
          <View className="mb-5">
            <Text className="text-lg font-semibold text-white">Vehicle Information:</Text>
            <Text className="text-white">Truck ID: {log.truckID}</Text>
            <Text className="text-white">Trailer ID: {log.trailerID}</Text>
          </View>
  
          <View className="mb-2">
            <Text className="text-lg font-semibold text-white">Inspection Details:</Text>
            <Text className="text-white"><Text className="font-semibold">Trip: </Text>{log.trip === 1 ? "Post Trip" : "Pre Trip"}</Text>
            <Text className="text-white"><Text className="font-semibold">Date: </Text>{formatDate(log.date)}</Text>
            <Text className="text-white"><Text className="font-semibold">Location: </Text>{log.location}</Text>
            <Text className="text-white"><Text className="font-semibold">City: </Text>{log.city}</Text>
            <Text className="text-white"><Text className="font-semibold">Truck Jurisdiction: </Text>{log.truck_jurisdiction}</Text>
            <Text className="text-white"><Text className="font-semibold">Trailer Jurisdiction: </Text>{log.trailer_jurisdiction}</Text>
          </View>
        </View>
  
        <View className="bg-gray-600 p-4 rounded-lg mb-5">
          <View className="mb-2">
            <Text className="text-lg font-semibold text-white">Load Information</Text>
            <Text className="text-white"><Text className="font-semibold">Load: </Text>{log.load}</Text>
            <Text className="text-white"><Text className="font-semibold">Height: </Text>{log.height}</Text>
            <Text className="text-white"><Text className="font-semibold">Incidents: </Text>{log.incidents}</Text>
          </View>
  
          <View className="mb-2">
            <Text className="text-lg font-semibold text-white">Driver Information</Text>
            <Text className="text-white"><Text className="font-semibold">Declaration: </Text>{log.declaration === 1 ? 'Yes' : 'No'}</Text>
            <Text className="text-white"><Text className="font-semibold">Driver Name: </Text>{log.driver_name}</Text>
            <Text className="text-white"><Text className="font-semibold">Signature: </Text>{log.signature}</Text>
          </View>
        </View>
  
        <View className="bg-gray-600 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2 text-white">Defects Status</Text>
          <Text className={`text-lg ${anyDefects ? 'text-red-600' : 'text-green-600'}`}>
            {anyDefects ? 'Defects Found' : 'No Defects Found'}
          </Text>
        </View>
  
        <View className="bg-gray-800 p-4 rounded-lg mb-4">
          {[truck_items_group1, truck_items_group2, truck_items_group3, trailer_items].map((group, index) => (
            <View key={index} className="mb-4">
              <Text className="text-lg font-semibold mb-2 text-white">
                {index < 3 ? 'Tractor / Truck' : 'Trailer'} Inspection Items
              </Text>
              {group.map((item) => (
                <View key={item.itemID} className="flex-row items-center mb-2 ">
                  {item.defective ? (
                    <Ionicons name="checkbox" size={24} color="#1d4ed8" className="mr-2" />
                  ) : (
                    <Ionicons name="square-outline" size={24} color="gray" className="mr-2" />
                  )}
                  <Text className="text-white">{item.item_name}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
  
        <View className="bg-gray-600 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2 text-white">Additional Information</Text>
          <Text className="text-white mb-2 font-semibold">Defects en route:</Text>
          <Text className="text-white mb-2">{log.defects_en_route}</Text>
          <Text className="font-semibold mb-2 text-white">Remarks:</Text>
          <Text className="text-white">{log.remarks}</Text>
        </View>
  
        <View className="bg-gray-600 p-4 rounded-lg mb-4">
          <Text className="text-lg font-semibold mb-2 text-white">Pictures</Text>
          {log.pictures && log.pictures.length > 0 ? (
            <View>
              {log.pictures.map((pic) => (
                <TouchableOpacity key={pic.logpicID}>
                  <DynamicImage imageUri={pic.picture} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-white">No pictures available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SpecificLog;

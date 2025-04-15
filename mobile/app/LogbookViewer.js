import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api'; 
import LoadingCircle from '../components/LoadingCircle';

const LogbookViewer = () => {
  const navigation = useNavigation();
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/log/data/me/');
      const sortLogs = response.data.sort((a, b) => b.logID - a.logID);
      setAllLogs(sortLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <View className="flex-1 bg-gray-800">
      {/* Back Arrow */}
      <TouchableOpacity className=" top-14 left-4 z-10" onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-white text-center mt-16 mb-4">User Logs</Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingCircle />
        </View>
      ) : (
        <ScrollView className="px-4">
          {allLogs.map((log) => (
            <TouchableOpacity
              key={log.logID}
              onPress={() => navigation.navigate('SpecificLog', { id: log.logID })}
              className="bg-gray-700 my-2 p-4 rounded-lg border border-gray-600 shadow-lg"
            >
              <Text className="text-white font-bold text-xl mb-2">Log ID: {log.logID}</Text>
              <Text className="text-gray-300 text-lg">Truck: {log.truckID || 'N/A'}</Text>
              <Text className="text-gray-300 text-lg">Trailer: {log.trailerID || 'N/A'}</Text>
              <Text className="text-gray-300 text-lg">Date: {formatDate(log.date)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LogbookViewer;

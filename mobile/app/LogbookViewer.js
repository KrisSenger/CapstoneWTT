import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import api from '../api'; 



const LogbookViewer = ({ navigation }) => {
  const [allLogs, setAllLogs] = useState([]);
  const getLogs = async () => {
    try {
      const response = await api.get('/api/log/data/me/');
      console.log(response.data);
      const sortLogs = response.data.sort((a, b) => b.logID - a.logID)
      setAllLogs(sortLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }  
  useEffect(() => {
    getLogs();
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>
      <Text style={styles.text}>Logbook Viewer</Text>
      <ScrollView>
        {allLogs.map((log) => (
          <TouchableOpacity
            key={log.logID}
            onPress={() => navigation.navigate('SpecificLog', { id: log.logID })}
            style={{
              backgroundColor: '#f9f9f9',
              marginVertical: 6,
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#d1d5db',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Log ID: {log.logID}</Text>
            <Text>Truck: {log.truckID || 'N/A'}</Text>
            <Text>Trailer: {log.trailerID || 'N/A'}</Text>
            <Text>Date: {log.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 10, // Ensures it stays on top
  },
});

export default LogbookViewer;
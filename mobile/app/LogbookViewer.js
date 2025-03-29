import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const LogbookViewer = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={30} color="#ed5829" />
      </TouchableOpacity>
      <Text style={styles.text}>Logbook Viewer</Text>
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
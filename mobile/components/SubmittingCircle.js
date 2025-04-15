import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function SubmittingCircle() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f97316" />
      <Text style={styles.text}>Submitting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    color: '#ffffff', 
    fontSize: 16,
  },
});
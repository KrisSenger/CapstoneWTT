import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../app/Home';
import LoginScreen from '../app/Login';
import LogbookViewer from '../app/LogbookViewer';
import TripLogger from '../app/TripLogger';
import IncidentReporter from '../app/IncidentReporter';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LogbookViewer" component={LogbookViewer} />
        <Stack.Screen name="TripLogger" component={TripLogger} />
        <Stack.Screen name="IncidentReporter" component={IncidentReporter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
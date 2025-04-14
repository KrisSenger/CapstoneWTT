import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PICKED_TRUCK } from "@/constants";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";

const TruckPicker = ({onChange}) => {
    const [trucks, setTrucks] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState("");
    
    useEffect(() => {
        fetchTrucks();
        loadStoredTruck();
    }, []);
    const fetchTrucks = async () => {
        try {
            const { data } = await api.get('/api/truck/data/');
            setTrucks(data);
        } catch (error) {
            console.error('Error fetching trucks:', error);
        }
    }
    const storeSelectedTruck = async (truckID) => {
        try {
            await AsyncStorage.setItem(PICKED_TRUCK, truckID);
            onChange?.(truckID);
        } catch (error) {
            console.error('Error storing selected truck:', error);
        }
    }
    const loadStoredTruck = async () => {
        try {
          const savedTruck = await AsyncStorage.getItem(PICKED_TRUCK);
          if (savedTruck) {
            setSelectedTruck(savedTruck);
          }
        } catch (error) {
          console.error("Error loading stored truck:", error);
        }
    }
    return (
        <View>
            <SelectList
                setSelected={storeSelectedTruck}
                data={trucks.filter(truck => truck.in_service).map(truck => ({
                    key: truck.truckID.toString(),
                    value: truck.truckID.toString(),
                }))}
                placeholder="Select a truck"

                
                boxStyles={{
                    backgroundColor: "#4b5563", 
                    borderRadius: 10,
                    borderColor: "#e2e8f0", 
                    padding: 12,
                    marginBottom: 15,
                    color: "#ffffff",
                    
                    
                    
                  }}
                  
                  
                  inputStyles={{
                    color: "#ffffff",
                    textColor: "#ffffff",
                    placeholderTextColor: '#ffffff', 
                  }}

                  dropdownStyles={{
                    backgroundColor: "#4b5563", 
                    borderRadius: 10,
                    borderColor: "#e2e8f0",
                    
                  }}
                  dropdownTextStyles={{
                    color: "#ffffff", 
                }}
                searchicon={<Icon name="search-outline" size={20} color="#ffffff" />}
                closeicon={<Icon name="close-circle-outline" size={20} color="#ffffff" />}
                arrowicon={<Icon name="chevron-down-outline" size={20} color="#ffffff" />}
                
                save="value"
                defaultOption={selectedTruck ? { key: selectedTruck, value: selectedTruck } : null} 
        />
        </View>
    );
};

export default TruckPicker;
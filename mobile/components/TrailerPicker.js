import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from "react-native-dropdown-select-list";
import { PICKED_TRAILER } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";

const TrailerPicker = ({onChange}) => {
    const [trailers, setTrailers] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState("");
    const trailerOptions = [
        { key: "no_trailer", value: "No Trailer" },
        { key: "other", value: "Other" },
        ...trailers
          .filter(trailer => trailer.in_service)
          .map(trailer => ({
            key: trailer.trailerID.toString(),
            value: trailer.trailerID.toString(),
          })),
      ];
    useEffect(() => {
        fetchTrailers();
        loadStoredTrailer();
    }, []);
    const fetchTrailers = async () => {
        try {
            const { data } = await api.get('/api/trailer/data/');
            setTrailers(data);
        } catch (error) {
            console.error('Error fetching trailers:', error);
        }
    }
    const storeSelectedTrailer = async (trailerID) => {
        try {
            await AsyncStorage.setItem(PICKED_TRAILER, trailerID);
            onChange?.(trailerID);
        } catch (error) {
            console.error('Error storing selected trailer:', error);
        }
    }
    const loadStoredTrailer = async () => {
        try {
          const savedTrailer = await AsyncStorage.getItem(PICKED_TRAILER);
          if (savedTrailer) {
            setSelectedTrailer(savedTrailer);
          }
        } catch (error) {
          console.error("Error loading stored trailer:", error);
        }
    }
    return (
        <View>
            <SelectList
                setSelected={storeSelectedTrailer}
                data={trailerOptions}
                placeholder="Select a trailer"
                boxStyles={{
                    backgroundColor: "#4b5563", 
                    borderRadius: 10,
                    borderColor: "#e2e8f0", 
                    padding: 12,
                    marginTop: 10,
                  }}
                  inputStyles={{
                    color: "#ffffff",
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
                
                defaultOption={selectedTrailer ? { key: selectedTrailer, value: selectedTrailer } : null} 
        />
        </View>
    );
};

export default TrailerPicker;
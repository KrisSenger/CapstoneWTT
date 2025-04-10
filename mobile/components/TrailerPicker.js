import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SelectList } from "react-native-dropdown-select-list";
import { PICKED_TRAILER } from "../constants";

const TrailerPicker = () => {
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
                boxStyles={{ margin: 10 }}
                dropdownStyles={{ marginHorizontal: 10 }}
                save="value"
                defaultOption={selectedTrailer ? { key: selectedTrailer, value: selectedTrailer } : null} 
        />
        </View>
    );
};

export default TrailerPicker;
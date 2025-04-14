import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from '../api'; 

const WelcomeMessage = () => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await api.get('/api/user/data/me/');
            setUser(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <View >
            <Text className="text-center text-3xl font-semibold text-white mt-5">
                Welcome, {user?.first_name || 'Guest'}
            </Text>
        </View>
    );
};


export default WelcomeMessage;


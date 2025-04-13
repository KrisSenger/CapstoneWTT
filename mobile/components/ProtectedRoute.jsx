import { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const navigation = useNavigation(); 

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);
       
    const refreshToken = async () => {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken
            });
            if (res.status === 200) {
                await AsyncStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <Text>Loading... </Text>;
    }

    if (!isAuthorized) {
        navigation.navigate('Login'); 
        return null; 
    }

    return children;
}

export default ProtectedRoute;

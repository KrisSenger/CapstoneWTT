import { ACCESS_TOKEN } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => (
        Promise.reject(error)
    )
)

export default api;
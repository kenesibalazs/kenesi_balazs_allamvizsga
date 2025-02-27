import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
 

const API_URL = 'http://192.168.1.162:3000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
};
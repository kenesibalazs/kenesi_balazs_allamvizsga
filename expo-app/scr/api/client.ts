import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://192.168.1.9:3000/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAuthHeaders = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return { Authorization: `Bearer ${token}` };
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw new Error('Failed to retrieve authentication token');
    }
};
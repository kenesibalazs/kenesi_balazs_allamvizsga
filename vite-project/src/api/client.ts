import axios from 'axios';

// Base URL for API requests
const API_URL = 'http://192.168.0.104:3000/api';

// Create an Axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to get token
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    return { Authorization: `Bearer ${token}` };
};

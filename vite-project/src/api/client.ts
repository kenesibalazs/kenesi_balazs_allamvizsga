import axios from 'axios';
import { message } from 'antd'; 
import { getExternalLogout } from '../context/AuthContext';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
 
const API_URL = 'http://192.168.1.196:3001/api';
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message?.includes('jwt expired')
    ) {
      message.error('Session expired. Logging out...');
      getExternalLogout()(); 
    }
    return Promise.reject(error);
  }
);
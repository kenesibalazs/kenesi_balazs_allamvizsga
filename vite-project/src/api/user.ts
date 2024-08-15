import axios from 'axios';
import { User } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance


export const fetchUserById = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.get(`/user/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user by ID error:', error);
        throw new Error('Failed to fetch user');
    }
};


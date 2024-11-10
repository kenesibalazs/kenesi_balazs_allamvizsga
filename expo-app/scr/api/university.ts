import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance
import  { University } from '../types/apiTypes';

export const fetchUniversities = async (): Promise<University[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/universities', { headers });
        return response.data;
    } catch (error) {
        console.error('Fetch universities error:', error);
        throw new Error('Failed to fetch universities');
    }
};

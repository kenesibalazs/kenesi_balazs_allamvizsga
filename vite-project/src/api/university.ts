import { University } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance



export const fetchUniversities = async (): Promise<University[]> => {
    try {
        const response = await apiClient.get('/universities', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch universities error:', error);
        throw new Error('Failed to fetch universities');
    }
};

import { Period } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance


export const fetchAllPeriods = async (): Promise<Period[]> => {
    try {
        const response = await apiClient.get('/periods', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch periods error:', error);
        throw new Error('Failed to fetch periods');
    }
};
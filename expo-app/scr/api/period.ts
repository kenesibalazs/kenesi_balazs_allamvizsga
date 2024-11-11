import { Period } from '../types/apiTypes';
import { apiClient, getAuthHeaders } from './client';  

export const fetchAllPeriods = async (): Promise<Period[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/periods', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch periods error:', error);
        throw new Error('Failed to fetch periods');
    }
};
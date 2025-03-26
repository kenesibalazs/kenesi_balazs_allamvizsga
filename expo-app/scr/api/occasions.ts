// api/fetchOccasionsByGroupId.ts
import { Occasion } from '../types/apiTypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance

export const fetchOccasionsByIds = async (ids: string[]): Promise<Occasion[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post('/occasions/ids', { occasionIds: ids }, { headers });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by IDs error:', error);
        throw new Error('Failed to fetch occasions');
    }
};



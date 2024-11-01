// api/fetchOccasionsByGroupId.ts
import { Occasion } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance

export const fetchOccasionsByGroupId = async (groupId: string): Promise<Occasion[]> => {
    try {
        const response = await apiClient.get(`/occasions/${groupId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch occasions by group ID error:', error);
        throw new Error('Failed to fetch occasions');
    }
};

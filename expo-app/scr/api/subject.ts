import { apiClient, getAuthHeaders } from "./client";
import { Subject } from "../types/apiTypes";


export const fetchAllSubjects = async (): Promise<Subject[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/subjects', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch all subjects error:', error);
        throw new Error('Failed to fetch subjects');
    }
};

import { Major } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance



export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
    try {
        const response = await apiClient.get('/majors', {
            headers: getAuthHeaders(),
            params: universityId ? { universityId } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors error:', error);
        throw new Error('Failed to fetch majors');
    }
};
// Fetch majors by university ID
export const fetchMajorsByUniversityId = async (universityId: string): Promise<Major[]> => {
    try {
        const response = await apiClient.get(`/majors/university/${universityId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors by university ID error:', error);
        throw new Error('Failed to fetch majors');
    }
};
// Fetch a major by ID
export const fetchMajorById = async (id: string): Promise<Major> => {
    try {
        const response = await apiClient.get(`/majors/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch major by ID error:', error);
        throw new Error('Failed to fetch major');
    }
};

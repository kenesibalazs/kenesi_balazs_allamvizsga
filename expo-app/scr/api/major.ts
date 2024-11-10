import { apiClient, getAuthHeaders } from "./client";
import { Major } from "../types/apiTypes";


export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/majors', {
            headers,
            params: universityId ? { universityId } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors error:', error);
        throw new Error('Failed to fetch majors');
    }
};


export const fetchMajorsByUniversityId = async (universityId: string): Promise<Major[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/majors/university/${universityId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors by university ID error:', error);
        throw new Error('Failed to fetch majors');
    }
};

export const fetchMajorById = async (id: string): Promise<Major> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/majors/${id}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch major by ID error:', error);
        throw new Error('Failed to fetch major');
    }
};

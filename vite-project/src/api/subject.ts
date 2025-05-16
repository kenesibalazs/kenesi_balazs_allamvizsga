
import { Subject } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance

// Fetch all subjects
export const fetchAllSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await apiClient.get('/subjects', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch all subjects error:', error);
        throw new Error('Failed to fetch subjects');
    }
};

export const fetchSubjectsByTeacherId = async (teacherId: string): Promise<Subject[]> => {
    try {
        const response = await apiClient.get(`/subjects/teacher/${teacherId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch subjects by teacher ID error:', error);
        throw new Error('Failed to fetch subjects by teacher ID');
    }
};
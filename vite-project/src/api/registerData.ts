import { University, Major, Group } from '../types/apitypes';
import { apiClient } from './client';  // Import the configured axios instance


export const fetchUniversitiesForRegister = async (): Promise<University[]> => {
    try {
        const response = await apiClient.get('/register/universities');
        return response.data;
    } catch (error) {
        console.error('Error fetching universities:', error);
        return [];
    }
};

export const fetchMajorsForRegister = async (universityId: string): Promise<Major[]> => {
    try {
        const response = await apiClient.get(`/register/universities/${universityId}/majors`);
        return response.data;
    } catch (error) {
        console.error('Error fetching majors:', error);
        return [];
    }
};


export const fetchGroupsForRegister = async (majorId: string): Promise<Group[]> => {
    try {
        const response = await apiClient.get(`/register/majors/${majorId}/groups`);
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
};
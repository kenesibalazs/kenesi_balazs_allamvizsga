import axios from 'axios';
import { Group } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance



export const fetchAllGroups = async (): Promise<Group[]> => {
    try {
        const response = await apiClient.get('/groups', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch all groups error:', error);
        throw new Error('Failed to fetch groups');
    }
};

// Fetch groups by major ID
export const fetchGroupsByMajorId = async (majorId: string): Promise<Group[]> => {
    try {
        const response = await apiClient.get(`/groups/majors/${majorId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch groups by major ID error:', error);
        throw new Error('Failed to fetch groups');
    }
};

// Fetch a group by ID
export const fetchGroupById = async (id: string): Promise<Group> => {
    try {
        const response = await apiClient.get(`/groups/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch group by ID error:', error);
        throw new Error('Failed to fetch group');
    }
};
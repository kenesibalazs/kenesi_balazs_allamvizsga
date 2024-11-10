import { apiClient, getAuthHeaders } from "./client";
import { Group } from "../types/apiTypes";

export const fetchAllGroups = async (): Promise<Group[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/groups', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch all groups error:', error);
        throw new Error('Failed to fetch groups');
    }
};

export const fetchGroupsByMajorId = async (majorId: string): Promise<Group[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/groups/majors/${majorId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch groups by major ID error:', error);
        throw new Error('Failed to fetch groups');
    }
};

export const fetchGroupById = async (id: string): Promise<Group> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/groups/${id}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch group by ID error:', error);
        throw new Error('Failed to fetch group');
    }
};

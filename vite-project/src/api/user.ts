import { User } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance


export const fetchUserById = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.get(`/user/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user by ID error:', error);
        throw new Error('Failed to fetch user');
    }
};

export const addOccasionToUser = async (userId: string, occasionId: string): Promise<User> => {
    try {
        const response = await apiClient.post(`/user/${userId}/occasions/${occasionId}`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Add occasion to user error:', error);
        throw new Error('Failed to add occasion to user');
    }
};

export const updateUserGroups = async (userId: string, groupId: string): Promise<User> => {
    try {
        const response = await apiClient.post(
            `/user/update-groups`,
            { userId, groupId },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error('Update user groups error:', error);
        throw new Error('Failed to update user groups');
    }
};

export const setUsersOccasion = async (userId: string, groupId: string): Promise<User> => {
    try {
        const response = await apiClient.post(
            `/user/set-users-occasion`,
            { userId, groupId },
            {
                headers: getAuthHeaders(),
            }
        );
        return response.data;
    } catch (error) {
        console.error('Set users occasion error:', error);
        throw new Error('Failed to set users occasion');
    }
};
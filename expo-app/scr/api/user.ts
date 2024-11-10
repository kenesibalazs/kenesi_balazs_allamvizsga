import { apiClient, getAuthHeaders } from "./client";
import { User } from "../types/apiTypes";

export const fetchUserById = async (id: string): Promise<User> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/user/${id}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch user by ID error:', error);
        throw new Error('Failed to fetch user');
    }
};

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

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/users', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Get all users error:', error);
        throw new Error('Failed to get all users');
    }
};

export const uploadProfileImage = async (userId: string, image: any): Promise<User> => {
    const formData = new FormData();
    formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || 'profile.jpg',
    } as any);

    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post(`/user/upload-profile/${userId}`, formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.user;
    } catch (error) {
        console.error('Upload profile image error:', error);
        throw new Error('Failed to upload profile image');
    }
};
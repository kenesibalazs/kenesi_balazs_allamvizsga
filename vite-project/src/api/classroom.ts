import { Classroom } from "../types/apitypes";
import { apiClient, getAuthHeaders } from './client'; 

export const fetchClassroomsById = async (id: string): Promise<Classroom[]> => {
    try{
        const response = await apiClient.get(`/classrooms/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch classroom by ID error:', error);
        throw new Error('Failed to fetch classroom');
    }

}

export const fetchAllClassrooms = async (): Promise<Classroom[]> => {
    try{
        const response = await apiClient.get('/classrooms', {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch classrooms error:', error);
        throw new Error('Failed to fetch classrooms');
    }
}
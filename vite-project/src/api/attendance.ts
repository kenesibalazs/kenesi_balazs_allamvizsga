import { Attendance } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  

export const createAttendance = async (attendanceData: Attendance, occasionId: string) => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post(`/attendances/create/${occasionId}`, attendanceData, { headers });

        console.log('Full response from API:', response);
        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};

export const getUsersActiveAttendance = async (userId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/${userId}`, { headers });
         if (response.data && Array.isArray(response.data)) {
            return response.data; 
        }
        return [];
    } catch (error) {
        console.error('Fetch attendances by user ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
}
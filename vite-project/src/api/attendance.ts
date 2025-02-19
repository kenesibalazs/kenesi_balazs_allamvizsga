import { Attendance } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';

export const createAttendance = async (attendanceData: Attendance, occasionId: string, creatorId: string) => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post(`/attendances/create/${occasionId}/${creatorId}`, attendanceData, { headers });

        console.log('Full response from API:', response);
        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};


export const getTeachersActiveAttendance = async (userId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/teacherId/${userId}`, { headers });
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Fetch attendances by teacher ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};

export const getStudentsActiveAttendance = async (userId: string): Promise<Attendance[]> => {

    try {
        const headers = await getAuthHeaders();

        const response = await apiClient.get(`/attendances/studentId/${userId}`, { headers });
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];

    } catch (error) {
        console.error('Fetch attendances by studnet ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};
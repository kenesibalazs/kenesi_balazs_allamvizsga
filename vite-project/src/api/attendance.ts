import { Attendance } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';

export const createAttendance = async (attendanceData: Attendance, occasionId: string, creatorId: string) => {
    try {
        const headers = await getAuthHeaders();

        console.log('Creator ID: ' + creatorId);
        const response = await apiClient.post(`/attendances/create/${occasionId}/${creatorId}`, attendanceData, { headers });

        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};

export const getTeachersActiveAttendance = async (userId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/teacherId/active/${userId}`, { headers });
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

        const response = await apiClient.get(`/attendances/studentId/active/${userId}`, { headers });
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];

    } catch (error) {
        console.error('Fetch attendances by studnet ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};

export const endAttendance = async (attendanceId: string, teacherId: string) => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.put(
            `/attendance/${attendanceId}/end`,
            { teacherId },
            { headers }
        );

        return response.data;  // Returning the updated attendance data
    } catch (error) {
        console.error('End attendance error:', error);
        throw new Error('Failed to end attendance');
    }
};



export const getStudentsAttendances = async (userId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/studentId/${userId}`, { headers });
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Fetch past attendances error:', error);
        throw new Error('Failed to fetch past attendances');
    }
};

export const getTeachersAttendances = async (userId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/teacherId/${userId}`, { headers });
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Fetch past attendances error:', error);
        throw new Error('Failed to fetch past attendances');
    }
};

export const setUserPresenceApi = async (attendanceId: string, userId: string, signature: string) => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post(
            `/attendance/setPresence`,
            { attendanceId, userId, signature },
            { headers }
        );

        if (!response.data.success) throw new Error(response.data.message || "Failed to set presence");

        return response.data;
    } catch (error) {
        console.error("Error in setUserPresenceApi:", error);
        throw new Error('Failed to set presence');
    }
};

export const getAttendanceById = async (attendanceId: string) => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendance/${attendanceId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Fetch attendance by ID error:', error);
        throw new Error('Failed to fetch attendance');
    }
};


export const getAttendancesByOccasionId = async (occasionId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendance/occasion/${occasionId}`, { headers });

        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch (error) {
        console.error('Fetch attendances by occasionId error:', error);
        throw new Error('Failed to fetch attendances by occasionId');
    }
};




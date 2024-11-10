import { apiClient, getAuthHeaders } from "./client";
import { Attendance } from "../types/apiTypes";

export const createAttendance = async (data: Omit<Attendance, '_id'>): Promise<Attendance> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.post('/attendances', data, { headers });
        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};

// Fetch attendances by teacher ID
export const fetchAttendancesByTeacherId = async (teacherId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/teacher/${teacherId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by teacher ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};

// Fetch attendances by group ID
export const fetchAttendancesByGroupId = async (groupId: string): Promise<Attendance[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/attendances/group/${groupId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by group ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};


// Update attendance by ID
export const updateAttendanceById = async (id: string, data: Partial<Omit<Attendance, '_id'>>): Promise<Attendance | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.put(`/attendances/${id}`, data, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Update attendance by ID error:', error);
        throw new Error('Failed to update attendance');
    }
}

// Add student to attendance
export const addStudentToAttendance = async (attendanceId: string, studentId: string): Promise<Attendance> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.patch(`/attendance/${attendanceId}/student/${studentId}`, {}, { headers });
        return response.data;
    } catch (error) {
        console.error('Add student to attendance error:', error.response?.data || error.message);
        throw new Error('Failed to add student to attendance');
    }
};

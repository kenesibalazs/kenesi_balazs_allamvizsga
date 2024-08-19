
import { Attendance } from '../types/apitypes';
import { apiClient, getAuthHeaders } from './client';  // Import the configured axios instance


export const createAttendance = async (data: Omit<Attendance, '_id'>): Promise<Attendance> => {
    try {
        const response = await apiClient.post('/attendances', data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};

// Fetch attendances by teacher ID
export const fetchAttendancesByTeacherId = async (teacherId: string): Promise<Attendance[]> => {
    try {
        const response = await apiClient.get(`/attendances/teacher/${teacherId}`, {
            headers: getAuthHeaders(),
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
        const response = await apiClient.get(`/attendances/group/${groupId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by group ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
}

// Update attendance by ID
export const updateAttendanceById = async (id: string, data: Partial<Omit<Attendance, '_id'>>): Promise<Attendance | null> => {
    try {
        const response = await apiClient.put(`/attendances/${id}`, data, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Update attendance by ID error:', error);
        throw new Error('Failed to update attendance');
    }
}


export const addStudentToAttendance = async (attendanceId: string, studentId: string): Promise<Attendance> => {
    try {
        const response = await apiClient.patch(`/attendance/${attendanceId}/student/${studentId}`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Add student to attendance error:', error);
        throw new Error('Failed to add student to attendance');
    }
};

//app.get('/attendances/subject/:subjectId/teacher/:teacherId', attendanceController.getAttendancesBySubjectIdAndTeacherId.bind(attendanceController));

export const fetchAttendancesBySubjectIdAndTeacherId = async (subjectId: string, teacherId: string): Promise<Attendance[]> => {
    try {
        const response = await apiClient.get(`/attendances/subject/${subjectId}/teacher/${teacherId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by subject ID and teacher ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};

export const endAttendance = async (attendanceId: string): Promise<Attendance | null> => {
    try {
        const response = await apiClient.patch(`/attendance/${attendanceId}/end`, {}, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error('End attendance error:', error);
        throw new Error('Failed to end attendance');
    }   

}
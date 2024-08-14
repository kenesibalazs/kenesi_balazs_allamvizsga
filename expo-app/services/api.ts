import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    University, Major, Group, AuthResponse, UserSignup, Attendance, Subject, User, AuthSuccessResponse
} from '../types/apiTypes';

// Base URL for API requests
const API_URL = 'http://192.168.0.101:3000/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to get token from AsyncStorage
const getAuthHeaders = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return { Authorization: `Bearer ${token}` };
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw new Error('Failed to retrieve authentication token');
    }
};

// Login user
export const loginUser = async (values: any): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/login', values);
        if ('token' in response.data) {
            const { token } = response.data as AuthSuccessResponse;
            await AsyncStorage.setItem('token', token);
            console.log('Login successful with token:', token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        return { message: 'Login failed' };
    }
};


// Signup user
export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/signup', values);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return { message: 'Registration failed' };
    }
};

// Fetch universities
export const fetchUniversities = async (): Promise<University[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/universities', { headers });
        return response.data;
    } catch (error) {
        console.error('Fetch universities error:', error);
        throw new Error('Failed to fetch universities');
    }
};

// Fetch majors
export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/majors', {
            headers,
            params: universityId ? { universityId } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors error:', error);
        throw new Error('Failed to fetch majors');
    }
};

// Fetch majors by university ID
export const fetchMajorsByUniversityId = async (universityId: string): Promise<Major[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/majors/university/${universityId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors by university ID error:', error);
        throw new Error('Failed to fetch majors');
    }
};

// Fetch a major by ID
export const fetchMajorById = async (id: string): Promise<Major> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get(`/majors/${id}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch major by ID error:', error);
        throw new Error('Failed to fetch major');
    }
};

// Fetch all groups
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

// Fetch groups by major ID
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

// Fetch a group by ID
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

// Attendance API
// Create attendance
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


// Fetch all subjects
export const fetchAllSubjects = async (): Promise<Subject[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await apiClient.get('/subjects', {
            headers,
        });
        return response.data;
    } catch (error) {
        console.error('Fetch all subjects error:', error);
        throw new Error('Failed to fetch subjects');
    }
};

// Fetch user by ID
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

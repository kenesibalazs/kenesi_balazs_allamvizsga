import axios from 'axios';
import { University, Major, Group, AuthResponse, UserSignup, Attendance, Subject , User} from '../types/apitypes';

// Base URL for API requests
const API_URL = 'http://192.168.0.106:3000/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Login user
export const loginUser = async (values: any): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/login', values);
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

export const fetchUniversities = async (): Promise<University[]> => {
    try {
        const response = await apiClient.get('/universities');
        return response.data;
    } catch (error) {
        console.error('Fetch universities error:', error);
        throw new Error('Failed to fetch universities');
    }
};
// Fetch a university by ID
export const fetchUniversityById = async (id: string): Promise<University> => {
    try {
        const response = await apiClient.get(`/universities/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch university by ID error:', error);
        throw new Error('Failed to fetch university');
    }
};
// Create a new university
export const createUniversity = async (data: Omit<University, '_id'>): Promise<University> => {
    try {
        const response = await apiClient.post('/universities', data);
        return response.data;
    } catch (error) {
        console.error('Create university error:', error);
        throw new Error('Failed to create university');
    }
};
// Update an existing university
export const updateUniversity = async (id: string, data: Partial<Omit<University, '_id'>>): Promise<University> => {
    try {
        const response = await apiClient.put(`/universities/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Update university error:', error);
        throw new Error('Failed to update university');
    }
};
// Delete a university
export const deleteUniversity = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/universities/${id}`);
    } catch (error) {
        console.error('Delete university error:', error);
        throw new Error('Failed to delete university');
    }
};

export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
    try {
        const response = await apiClient.get('/majors', {
            params: universityId ? { universityId } : {},
        });
        return response.data;
    } catch (error) {
        console.error('Fetch majors error:', error);
        throw new Error('Failed to fetch majors');
    }
};

export const fetchMajorsByUniversityId = async (universityId: string): Promise<Major[]> => {
    try {
        const response = await apiClient.get(`/majors/university/${universityId}`);
        return response.data;
    } catch (error) {
        console.error('Fetch majors error:', error);
        throw new Error('Failed to fetch majors');
    }
};

export const fetchMajorById = async (id: string): Promise<Major> => {
    try {
        const response = await apiClient.get(`/majors/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch major by ID error:', error);
        throw new Error('Failed to fetch major');
    }
};

export const createMajor = async (data: Omit<Major, '_id'>): Promise<Major> => {
    try {
        const response = await apiClient.post('/majors', data);
        return response.data;
    } catch (error) {
        console.error('Create major error:', error);
        throw new Error('Failed to create major');
    }
};

export const updateMajor = async (id: string, data: Partial<Omit<Major, '_id'>>): Promise<Major> => {
    try {
        const response = await apiClient.put(`/majors/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Update major error:', error);
        throw new Error('Failed to update major');
    }
};

export const deleteMajor = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/majors/${id}`);
    } catch (error) {
        console.error('Delete major error:', error);
        throw new Error('Failed to delete major');
    }
};

// Fetch all groups
export const fetchAllGroups = async (): Promise<Group[]> => {
    try {
        const response = await apiClient.get('/groups');
        return response.data;
    } catch (error) {
        console.error('Fetch all groups error:', error);
        throw new Error('Failed to fetch groups');
    }
};
// Fetch groups by major ID
export const fetchGroupsByMajorId = async (majorId: string): Promise<Group[]> => {
    try {
        const response = await apiClient.get(`/groups/majors/${majorId}`);
        return response.data;
    } catch (error) {
        console.error('Fetch groups by major ID error:', error);
        throw new Error('Failed to fetch groups');
    }
};
// Fetch a group by ID
export const fetchGroupById = async (id: string): Promise<Group> => {
    try {
        const response = await apiClient.get(`/groups/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch group by ID error:', error);
        throw new Error('Failed to fetch group');
    }
};
// Create a new group
export const createGroup = async (data: Omit<Group, '_id'>): Promise<Group> => {
    try {
        const response = await apiClient.post('/groups', data);
        return response.data;
    } catch (error) {
        console.error('Create group error:', error);
        throw new Error('Failed to create group');
    }
};
// Update an existing group
export const updateGroup = async (id: string, data: Partial<Omit<Group, '_id'>>): Promise<Group> => {
    try {
        const response = await apiClient.put(`/groups/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Update group error:', error);
        throw new Error('Failed to update group');
    }
};
// Delete a group
export const deleteGroup = async (id: string): Promise<void> => {
    try {
        await apiClient.delete(`/groups/${id}`);
    } catch (error) {
        console.error('Delete group error:', error);
        throw new Error('Failed to delete group');
    }
};

// Attendances
export const createAttendance = async (data: Omit<Attendance, '_id'>): Promise<Attendance> => {
    try {
        const response = await apiClient.post('/attendances', data);
        return response.data;
    } catch (error) {
        console.error('Create attendance error:', error);
        throw new Error('Failed to create attendance');
    }
};

export const fetchAttendancesByTeacherId = async (teacherId: string): Promise<Attendance[]> => {
    try {
        const response = await apiClient.get(`/attendances/teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by teacher ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
};

export const fetchAttendancesByGroupId = async (groupId: string): Promise<Attendance[]> => {
    try {
        const response = await apiClient.get(`/attendances/group/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Fetch attendances by group ID error:', error);
        throw new Error('Failed to fetch attendances');
    }
}

export const updateAttendanceById = async (id: string, data: Partial<Omit<Attendance, '_id'>>): Promise<Attendance | null> => {
    try {
        const response = await apiClient.put(`/attendances/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Update attendance by ID error:', error);
        throw new Error('Failed to update attendance');
    }
}
// Subjects

export const fetchAllSubjects = async (): Promise<Subject[]> => {
    try {
        const response = await apiClient.get('/subjects');
        return response.data;
    } catch (error) {
        console.error('Fetch all subjects error:', error);
        throw new Error('Failed to fetch subjects');
    }
};

export const fetchUserById = async (id: string): Promise<User> => {
    try {
        const response = await apiClient.get(`/user/${id}`);
        return response.data;
    } catch (error) {   
        console.error('Fetch user by ID error:', error);
        throw new Error('Failed to fetch user');
    }
}
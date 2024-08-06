import axios from 'axios';
import { University, Major, Group , AuthResponse, UserSignup} from '../types/apitypes';

// Base URL for API requests
const API_URL = 'http://192.168.0.110:3000/api';

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
        return { message: 'Login failed' };
    }
};

// Fetch universities
export const fetchUniversities = async (): Promise<University[]> => {
    const response = await apiClient.get('/universities');
    return response.data;
};

// Fetch majors
export const fetchMajors = async (universityId?: string): Promise<Major[]> => {
    const response = await apiClient.get('/majors', {
        params: universityId ? { universityId } : {},
    });
    return response.data;
};

// Fetch groups
export const fetchGroups = async (majorIds: string[]): Promise<Group[]> => {
    const response = await apiClient.get('/fetchGroups', {
        params: { majorIds },
    });
    return response.data;
};

// Signup user
export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/signup', values);
        return response.data;
    } catch (error) {
        return { message: 'Registration failed' };
    }
};
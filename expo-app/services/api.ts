// services/api.ts

import axios from 'axios';
import { University, Major, Group, UserSignup, AuthResponse } from '../types/apiTypes';

// Base URL for API requests
const API_URL = 'http://192.168.0.106:3000/api';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch universities
export const fetchUniversities = async (): Promise<University[]> => {
    const response = await apiClient.get('/universities');
    return response.data;
};

// Fetch majors based on the university ID
export const fetchMajors = async (universityId: string): Promise<Major[]> => {
    const response = await apiClient.get('/fetchMajors', {
        params: { universityId }
    });
    return response.data;
};


// Fetch groups based on an array of major IDs
export const fetchGroups = async (majorIds: string[]): Promise<Group[]> => {
    const response = await apiClient.get('/fetchGroups', {
        params: { majorIds }
    });
    return response.data;
};



// Function for user registration
export const registerUser = async (userData: UserSignup): Promise<AuthResponse> => {
    const response = await apiClient.post('/signup', userData);
    return response.data;
};

// Function for user login
export const loginUser = async (loginData: { neptunCode: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post('/login', loginData);
    return response.data;
};

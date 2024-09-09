import { AuthResponse, UserSignup, AuthSuccessResponse } from '../types/apitypes';
import { apiClient } from './client';  // Import the configured axios instance


export const loginUser = async (values: any): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/login', values);

        if ('token' in response.data) {
            const { token } = response.data as AuthSuccessResponse;
            localStorage.setItem('token', token); // Store token in localStorage
            console.log('Login successful with token:', token);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        return { message: 'Login failed' };
    }
};

// Add a new function for Neptun login
export const loginWithNeptun = async (neptunData: { UserLogin: string; Password: string }): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/login-neptun', neptunData);  // Adjust the endpoint as necessary

        if ('token' in response.data) {
            const { token } = response.data as AuthSuccessResponse;
            localStorage.setItem('token', token); // Store token in localStorage
            console.log('Neptun login successful with token:', token);
        }

        return response.data;
    } catch (error) {
        console.error('Neptun login error:', error);
        return { message: 'Neptun login failed' };
    }
};


export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/signup', values);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return { message: 'Registration failed' };
    }
};

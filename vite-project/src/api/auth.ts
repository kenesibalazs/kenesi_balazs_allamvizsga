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



export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/signup', values);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return { message: 'Registration failed' };
    }
};


export const signupUserWithNeptun = async (values: { neptunCode: string; password: string }): Promise<AuthResponse> => {
    try {
        console.log(values);
        const response = await apiClient.post('/signup-neptun', values); 
        return response.data;
    } catch (error) {
        console.error('Neptun signup error:', error);
        return { message: 'Neptun registration failed' };
    }
}

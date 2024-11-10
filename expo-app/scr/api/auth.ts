import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, UserSignup, AuthSuccessResponse } from '../types/apiTypes';
import { apiClient } from './client';  // Import the configured axios instance

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

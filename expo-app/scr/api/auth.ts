/* eslint-disable */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, UserSignup, AuthSuccessResponse } from '../types/apiTypes';
import { apiClient } from './client';  // Import the configured axios instance
import * as SecureStore from 'expo-secure-store';

import MyModule from '../../modules/my-module/src/MyModule';

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


export const signupUser = async (values: UserSignup): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post('/signup', values);
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return { message: 'Registration failed' };
    }
};


async function generateKeys() {
    try {
        const publicKey = 'mockPublicKey';
        const privateKey = 'mockPrivateKey';

        await SecureStore.setItemAsync('privateKey', privateKey);
    
        return publicKey;
    } catch (error) {
        console.error('Error during key generation:', error);
    }
}


export const signupUserWithNeptun = async (values: { neptunCode: string; password: string; universityId: string }): Promise<AuthResponse> => {
    try {
        console.log("Generating key pair...");

        console.log("MyModule:", MyModule);
        const publicKey = await generateKeys();

        const payload = { ...values, publicKey };



        console.log("Sending signup request with:", payload);

        const response = await apiClient.post('/signup-neptun', payload);
        return response.data;
    } catch (error) {
        console.error('Neptun signup error:', error);
        return { message: 'Neptun registration failed' };
    }
}

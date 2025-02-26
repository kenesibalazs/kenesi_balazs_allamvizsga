/* eslint-disable */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, UserSignup, AuthSuccessResponse } from '../types/apiTypes';
import { apiClient } from './client';  // Import the configured axios instance
import * as SecureStore from 'expo-secure-store';

import MyModule from '../../modules/my-module';

import nacl from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';


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



async function generateKeys(): Promise<string> {
    try {
        console.log("Calling generateKeyInSecureEnclave...");
        const publicKeyBase64 = await MyModule.generateKeyInSecureEnclave();
        if (!publicKeyBase64) {
            throw new Error("Public key generation failed: Native module returned null");
        }
        console.log("Generated Public Key (Base64):", publicKeyBase64);
        return publicKeyBase64;
    } catch (error: any) {
        console.error("Error during key generation:", error.message || error);
        throw error;
    }
}

export const signupUserWithNeptun = async (values: { neptunCode: string; password: string; universityId: string }): Promise<AuthResponse> => {
    try {
        console.log("Generating key pair...");
        const publicKey = await generateKeys();
        if (!values.neptunCode || !values.password || !values.universityId) {
            throw new Error("Missing required signup values.");
        }

        const payload = { ...values, publicKey };

        console.log("Sending signup request with:", payload);

        const response = await apiClient.post('/signup-neptun', payload);

        if (response.data && response.data.message) {
            console.log("Signup response message:", response.data.message);
        }

        return response.data;
    } catch (error: any) {
        console.error("Neptun signup error:", error.message || error);
        return { message: "Neptun registration failed" };
    }
};
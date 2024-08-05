import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { loginUser } from '../services/api';
import { AuthResponse } from '../types/apiTypes';

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (values: { neptunCode: string; password: string }) => {
        try {
            setError(null);
            setLoading(true);

            const { token, user }: AuthResponse = await loginUser(values);

            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Logged in successfully',
            });
            login(token, user);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
            Toast.show({
                type: 'error',
                position: 'top',
                text1: err.response?.data?.message || 'Login failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleLogin };
};

export default useLogin;

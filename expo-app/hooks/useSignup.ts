import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { registerUser } from '../services/api';
import { UserSignup } from '../types/apiTypes';

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async (values: UserSignup) => {
        if (values.password !== values.passwordConfirm) {
            setError("Passwords do not match");
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Passwords do not match',
            });
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const { token, user } = await registerUser(values);

            Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Account created successfully',
            });
            login(token, user);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
            Toast.show({
                type: 'error',
                position: 'top',
                text1: err.response?.data?.message || 'Registration failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleRegister };
};

export default useSignup;

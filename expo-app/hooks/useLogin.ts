import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUser = async (values: any) => {
        try {
            setError(null);
            setLoading(true);
            console.log(`Backend URL: http://192.168.0.102:3000/api/login`); // Log backend URL
            const res = await fetch(`http://192.168.0.102:3000/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await res.json();
            console.log('Response data:', data); // Log response data

            if (res.status === 200) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Logged in successfully',
                });
                login(data.token, data.user);
            } else if (res.status === 401 || res.status === 400) {
                setError(data.message);
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: data.message,
                });
            } else {
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Login failed',
                });
            }
        } catch (err) {
            console.error('Login error:', err); // Log error
            setError('Login failed');
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Login failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;

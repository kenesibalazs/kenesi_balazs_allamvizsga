import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import Toast from 'react-native-toast-message';

// Get environment variables from a `.env` file or a similar setup
const API_BASE_URL = process.env.REACT_NATIVE_API_BASE_URL || 'http://192.168.0.102:3000'; // Default to local if not set

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const registerUser = async (values: any) => {
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
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Account created successfully',
                });
                login(data.token, data.user);
            } else if (response.status === 400 || response.status === 409) {
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
                    text1: 'Registration failed',
                });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed');
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Registration failed',
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;



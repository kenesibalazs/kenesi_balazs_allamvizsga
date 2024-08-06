// src/hooks/useLogin.ts

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { loginUser as apiLoginUser } from "../services/api";  // Import the login API function
import { AuthResponse, AuthSuccessResponse } from "../types/apitypes";

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUser = async (values: any) => {
        try {
            setError(null);
            setLoading(true);
            const data: AuthResponse = await apiLoginUser(values);  // Use the login API function

            if ('token' in data && 'user' in data) {
                message.success("Logged in successfully");
                login(data.token, data.user);
            } else if ('message' in data) {
                setError(data.message);
                message.error(data.message);
            } else {
                setError('Login failed');
                message.error('Login failed');
            }
        } catch (err) {
            setError('Login failed');
            message.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;

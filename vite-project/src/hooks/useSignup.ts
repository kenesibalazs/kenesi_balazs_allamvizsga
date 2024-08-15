// src/hooks/useSignup.ts

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { signupUser as apiSignupUser } from "../api";  // Import the signup API function
import { UserSignup } from "../types/apitypes";

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const registerUser = async (values: UserSignup & { passwordConfirm: string }) => {
        if (values.password !== values.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const data = await apiSignupUser(values);  // Use the signup API function

            if ('token' in data && 'user' in data) {
                message.success("Account created successfully");
                login(data.token, data.user);
            } else if ('message' in data) {
                setError(data.message);
                message.error(data.message);
            } else {
                setError('Registration failed');
                message.error('Registration failed');
            }
        } catch (err) {
            setError('Registration failed');
            message.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;

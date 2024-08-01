import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const registerUser = async (values: any) => {
        if (values.password !== values.passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 201) {
                message.success("Account created successfully");
                login(data.token, data.user);
            } else if (res.status === 400 || res.status === 409) {
                setError(data.message);
            } else {
                message.error('Registration failed');
            }
        } catch (err) {
            message.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUser = async (values: any) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 200) {
                message.success("Logged in successfully");
                login(data.token, data.user);
            } else if (res.status === 401 || res.status === 400) {
                setError(data.message);
            } else {
                message.error('Login failed');
            }
        } catch (err) {
            message.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;

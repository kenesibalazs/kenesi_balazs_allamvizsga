import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { loginUser as apiLoginUser } from "../api";  // Import the login API function
import { AuthResponse, AuthSuccessResponse } from "../types/apitypes";


const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loginUser = async (values: { email: string; password: string }) => {
        try {
            setError(null);
            setLoading(true);
            const data: AuthResponse = await apiLoginUser(values);  // Use the login API function

            if ('token' in data && 'user' in data) {
                message.success("Logged in successfully");
                // console.log("data:", data);

                localStorage.setItem("token", data.token);

                login(data.token, {
                    _id: data.user.id,
                    name: data.user.name,
                    neptunCode: data.user.neptunCode,
                    type: data.user.type,
                    universityId: data.user.universityId,
                    majors: data.user.majors,
                    groups: data.user.groups,
                    occasionIds: data.user.occasionIds || [],
                    publicKey: "",
                });
            } else if ('message' in data) {
                setError(data.message);
                message.error(data.message);
            } else {
                setError('Login failed');
                message.error('Login failed');
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError('Login failed');
            message.error('Login failed');
        } finally {
            setLoading(false);
        }
    };


    return { loading, error, loginUser };
};

export default useLogin;

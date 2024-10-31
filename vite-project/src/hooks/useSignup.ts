import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { signupUser as apiSignupUser, signupUserWithNeptun as apiSignupUserWithNeptun } from "../api";
import { UserSignup, AuthResponse } from "../types/apitypes";

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
            const data = await apiSignupUser(values);

            if ("token" in data && "user" in data) {
                message.success("Account created successfully");
                login(data.token, data.user);
            } else if ("message" in data) {
                setError(data.message);
                message.error(data.message);
            } else {
                setError("Registration failed");
                message.error("Registration failed");
            }
        } catch (err) {
            setError("Registration failed");
            message.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // Register with Neptun (username and password only, no password confirm)
    const signupUserWithNeptun = async (values: { neptunCode: string; password: string }) => {
      try {
        setLoading(true);
        const response = await apiSignupUserWithNeptun(values);
        
        if ('token' in response && 'user' in response) {
          message.success("Neptun account registered successfully");
          login(response.token, response.user);
        } else {
          setError(response.message);
          message.error(response.message);
        }
      } catch (err) {
        setError("Neptun registration failed");
        message.error("Neptun registration failed");
      } finally {
        setLoading(false);
      }
  };
  

    return { loading, error, registerUser, signupUserWithNeptun };
};

export default useSignup;

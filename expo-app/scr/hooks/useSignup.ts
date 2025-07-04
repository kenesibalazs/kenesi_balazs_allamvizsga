/*eslint-disable */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signupUser as apiSignupUser, signupUserWithNeptun as apiSignupUserWithNeptun } from "../api";
import { UserSignup } from "../types/apiTypes";
import Toast from "react-native-toast-message";

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
                // message.success("Account created successfully");
                login(data.token, { ...data.user, _id: data.user.id });
            } else if ("message" in data) {
                setError(data.message);
                // message.error(data.message);
            } else {
                setError("Registration failed");
                // message.error("Registration failed");
            }
        } catch (err) {
            setError("Registration failed");
            // message.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

   
    const signupUserWithNeptun = async (values: { neptunCode: string; password: string; universityId: string }) => {
      try {
        setLoading(true);
        const response = await apiSignupUserWithNeptun(values);
        
        if ('token' in response && 'user' in response) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Registration successful',
            text2: 'You can now login with your Neptun code',
          });
          login(response.token, { ...response.user, _id: response.user.id });
        } else {
          setError(response.message);
          Toast.show({
            type: 'error',
            position: 'top',
            text1: response.message,
          });
        }
      } catch (err) {
        setError("Neptun registration failed");
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Neptun registration failed',
        });
      } finally {
        setLoading(false);
      }
  };
  

    return { loading, error, registerUser, signupUserWithNeptun };
};

export default useSignup;

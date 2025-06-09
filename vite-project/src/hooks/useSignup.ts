import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { message } from "antd";
import { signupUser as apiSignupUser, signupUserWithNeptun as apiSignupUserWithNeptun } from "../api";
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
            const data = await apiSignupUser(values);

            if ("token" in data && "user" in data) {
                message.success("Account created successfully");
                login(data.token, {
                  _id: data.user.id,
                  name: data.user.name,
                  neptunCode: data.user.neptunCode,
                  type: data.user.type,
                  universityId: data.user.universityId,
                  majors: data.user.majors,
                  groups: data.user.groups,
                  occasionIds: [],
                  publicKey: "",
                });
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

   
    const signupUserWithNeptun = async (values: { neptunCode: string; password: string; universityId: string }) => {
      try {
        setLoading(true);
        const response = await apiSignupUserWithNeptun(values);
        
        if ('token' in response && 'user' in response) {
          message.success("Neptun account registered successfully");
          login(response.token, {
            _id: response.user.id,
            name: response.user.name,
            neptunCode: response.user.neptunCode,
            type: response.user.type,
            universityId: response.user.universityId,
            majors: response.user.majors,
            groups: response.user.groups,
            occasionIds: [],
            publicKey: "",
          });
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

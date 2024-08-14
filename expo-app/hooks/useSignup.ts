import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import { UserSignup } from '../types/apiTypes';

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

   

    
};

export default useSignup;

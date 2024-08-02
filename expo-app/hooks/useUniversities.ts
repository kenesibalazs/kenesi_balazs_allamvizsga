import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';

interface University {
    _id: string;
    name: string;
    neptunUrl: string;
}

const useUniversities = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get<University[]>(`http://192.168.0.102:3000/api/universities`);
                setUniversities(response.data);
            } catch (error) {
                console.error('Error fetching universities:', error);
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Failed to fetch universities',
                })
                setError(error as Error);
            }
        };

        fetchUniversities();
    }, []);

    return { universities, error };
};

export default useUniversities;

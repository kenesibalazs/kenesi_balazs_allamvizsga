import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from "antd";

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
                const response = await axios.get<University[]>(`${import.meta.env.VITE_BACKEND_URL}/api/fetchUniversities`);
                setUniversities(response.data);
            } catch (error) {
                console.error('Error fetching universities:', error);
                message.error('Failed to fetch universities');
                setError(error as Error);
            }
        };

        fetchUniversities();
    }, []);

    return { universities, error };
};

export default useUniversities;

import { useState, useEffect } from 'react';
import { fetchUniversities as fetchUniversitiesApi } from '../services/api';
import { University } from '../types/apitypes';
import { message } from 'antd';

const useUniversities = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const data = await fetchUniversitiesApi();
                setUniversities(data);
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
    
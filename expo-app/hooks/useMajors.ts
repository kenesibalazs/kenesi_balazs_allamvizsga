import { useState, useCallback } from 'react';
import axios from 'axios';


const useMajors = () => {
    const [majors, setMajors] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchMajors = useCallback(async (universityId: string) => {
        try {
            const response = await axios.get('http://192.168.0.102:3000/api/majors', {
                params: { universityId }
            });
            setMajors(response.data);
        } catch (err) {
            setError('Error fetching majors.');
        }
    }, []);

    return { majors, fetchMajors, error };
};

export default useMajors;

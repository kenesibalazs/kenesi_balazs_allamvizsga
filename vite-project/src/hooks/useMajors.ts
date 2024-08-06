import { useState, useCallback } from 'react';
import { fetchMajors as fetchMajorsApi } from '../services/api';
import { Major } from '../types/apitypes';

const useMajors = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchMajors = useCallback(async (universityId: string) => {
        try {
            const data = await fetchMajorsApi(universityId);
            setMajors(data);
        } catch (err) {
            setError('Error fetching majors.');
        }
    }, []);

    return { majors, fetchMajors, error };
};

export default useMajors;
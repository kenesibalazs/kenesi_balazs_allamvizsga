// hooks/useMajors.ts
import { useState, useCallback } from 'react';
import { fetchMajors } from '../services/api';
import { Major } from '../types/apiTypes';

const useMajors = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchMajorsData = useCallback(async (universityId: string) => {
        try {
            const data = await fetchMajors(universityId);
            setMajors(data);
        } catch (err) {
            setError('Error fetching majors.');
            console.error('Error fetching majors:', err); // Log the error for debugging
        }
    }, []);

    return { majors, fetchMajorsData, error };
};

export default useMajors;

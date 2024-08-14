import { useState, useCallback } from 'react';
import {
    fetchMajorById,
    fetchMajorsByUniversityId
} from '../services/api'; // Adjust the path if necessary
import { Major } from '../types/apiTypes'; // Adjust the path if necessary

const useMajors = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchMajorByIdData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await fetchMajorById(id);
            setSelectedMajor(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch major by ID.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMajorsByUniversityIdData = useCallback(async (universityId: string) => {
        setLoading(true);
        try {
            const data = await fetchMajorsByUniversityId(universityId);
            setMajors(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch majors by university ID.');
        } finally {
            setLoading(false);
        }
    }, []);

  

    return {
        majors,
        selectedMajor,
        fetchMajorByIdData,
        fetchMajorsByUniversityIdData,
        error,
        loading
    };
};

export default useMajors;

import { useState, useCallback } from 'react';
import {
    fetchMajors,
    fetchMajorById,
    fetchMajorsByUniversityId
} from '../api'; // Adjust the path if necessary
import { Major } from '../types/apitypes'; // Adjust the path if necessary

const useMajors = () => {
    const [majors, setMajors] = useState<Major[]>([]);
    const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAllMajorsData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchMajors();
            setMajors(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch all majors.');
        } finally {
            setLoading(false);
        }
    }, []);

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
        fetchAllMajorsData,
        selectedMajor,
        fetchMajorByIdData,
        fetchMajorsByUniversityIdData,
        error,
        loading
    };
};

export default useMajors;

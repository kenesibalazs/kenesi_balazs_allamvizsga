import { useState, useCallback } from 'react';
import {
    fetchMajorById,
    createMajor,
    updateMajor,
    deleteMajor,
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

    const createMajorData = useCallback(async (data: Omit<Major, '_id'>) => {
        setLoading(true);
        try {
            const newMajor = await createMajor(data);
            setMajors(prevMajors => [...prevMajors, newMajor]);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to create major.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMajorData = useCallback(async (id: string, data: Partial<Omit<Major, '_id'>>) => {
        setLoading(true);
        try {
            const updatedMajor = await updateMajor(id, data);
            setMajors(prevMajors => prevMajors.map(major => major._id === id ? updatedMajor : major));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to update major.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteMajorData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await deleteMajor(id);
            setMajors(prevMajors => prevMajors.filter(major => major._id !== id));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to delete major.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        majors,
        selectedMajor,
        fetchMajorByIdData,
        fetchMajorsByUniversityIdData,
        createMajorData,
        updateMajorData,
        deleteMajorData,
        error,
        loading
    };
};

export default useMajors;

import { useState, useCallback } from 'react';
import {
    fetchUniversities,
    fetchUniversityById,
    createUniversity,
    updateUniversity,
    deleteUniversity
} from '../services/api'; // Adjust the path if necessary
import { University } from '../types/apitypes'; // Adjust the path if necessary

const useUniversities = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAllUniversities = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUniversities();
            setUniversities(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch universities.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUniversityByIdData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await fetchUniversityById(id);
            setSelectedUniversity(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch university by ID.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createUniversityData = useCallback(async (data: Omit<University, '_id'>) => {
        setLoading(true);
        try {
            const newUniversity = await createUniversity(data);
            setUniversities(prevUniversities => [...prevUniversities, newUniversity]);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to create university.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUniversityData = useCallback(async (id: string, data: Partial<Omit<University, '_id'>>) => {
        setLoading(true);
        try {
            const updatedUniversity = await updateUniversity(id, data);
            setUniversities(prevUniversities => prevUniversities.map(university => university._id === id ? updatedUniversity : university));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to update university.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUniversityData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await deleteUniversity(id);
            setUniversities(prevUniversities => prevUniversities.filter(university => university._id !== id));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to delete university.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        universities,
        selectedUniversity,
        fetchAllUniversities,
        fetchUniversityByIdData,
        createUniversityData,
        updateUniversityData,
        deleteUniversityData,
        error,
        loading
    };
};

export default useUniversities;

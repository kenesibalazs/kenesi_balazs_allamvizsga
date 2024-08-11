import { useState, useCallback } from 'react';
import {
    fetchUniversities
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

    return {
        universities,
        selectedUniversity,
        fetchAllUniversities,
        error,
        loading
    };
};

export default useUniversities;

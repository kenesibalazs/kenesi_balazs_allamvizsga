import { useState, useCallback } from 'react';
import {
    fetchAllSubjects,
} from '../services/api';

import { Subject } from '../types/apitypes';

const useSubject = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAllSubjectsData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllSubjects();
            setSubjects(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch all subjects.');
        } finally {
            setLoading(false);
        }
    }, []);


    return {
        subjects,
        error,
        loading,
        fetchAllSubjectsData
    };

}

export default useSubject;
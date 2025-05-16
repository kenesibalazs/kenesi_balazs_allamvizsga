import { useState, useCallback } from 'react';
import { fetchAllSubjects, fetchSubjectsByTeacherId } from '../api';
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
            console.error(err); // Log the error to see details
            setError('Failed to fetch all subjects.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSubjectsForTeacher = useCallback(async (teacherId: string) => {
        setLoading(true);
        try {
            const data = await fetchSubjectsByTeacherId(teacherId);
            setSubjects(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch subjects for teacher.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        subjects,
        error,
        loading,
        fetchAllSubjectsData,
        fetchSubjectsForTeacher
    };
}

export default useSubject;

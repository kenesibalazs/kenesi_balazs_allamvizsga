import {useState , useCallback} from 'react';
import {fetchSubjects as fetchSubjectsApi} from '../services/api';
import {Subject} from '../types/apitypes';

const useFetchSubjects = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = useCallback(async () => {
        try {
            const data = await fetchSubjectsApi();
            setSubjects(data);
        } catch (err) {
            setError('Error fetching subjects.');
        }

    }, []);

    return {subjects, fetchSubjects, error};
};
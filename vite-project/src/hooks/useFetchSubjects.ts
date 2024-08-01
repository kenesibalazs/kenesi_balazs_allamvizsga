// hooks/useFetchSubjects.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Occasion {
    startDate: string;
    endDate: string;
    classroom: string;
    day: string;
    groups: string[]; // Adjust the type according to your actual data
}

interface Subject {
    name: string;
    occasions: Occasion[];
}

const useFetchSubjects = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fetchSubjects`); 
                setSubjects(response.data);
            } catch (err) {
                setError('Failed to fetch timetable data');
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    return { subjects, loading, error };
};

export default useFetchSubjects;

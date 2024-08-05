// hooks/useUniversities.ts

import { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { fetchUniversities } from '../services/api';
import { University } from '../types/apiTypes';

const useUniversities = () => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadUniversities = async () => {
            try {
                const data = await fetchUniversities();
                setUniversities(data);
                console.log('Universities:', data);
            } catch (err) {
                console.error('Error fetching universities:', err);
                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Failed to fetch universities',
                });
                setError(err as Error);
            }
        };

        loadUniversities();
    }, []);

    return { universities, error };
};

export default useUniversities;

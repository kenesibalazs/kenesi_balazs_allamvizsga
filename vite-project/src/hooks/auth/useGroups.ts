import { useState, useCallback } from 'react';
import axios from 'axios';

const useGroups = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async (majorIds: string[]) => {
        try {
            const response = await axios.get('http://192.168.0.106:3000/api/fetchGroups', {
                params: { majorIds }
            });
            setGroups(response.data);
        } catch (err) {
            setError('Error fetching groups.');
        }
    }, []);

    return { groups, fetchGroups, error };
};

export default useGroups;

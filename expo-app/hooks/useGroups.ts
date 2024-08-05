// hooks/useGroups.ts
import { useState, useCallback } from 'react';
import { fetchGroups } from '../services/api';
import { Group } from '../types/apiTypes';

const useGroups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchGroupsData = useCallback(async (majorIds: string[]) => {
        try {
            const data = await fetchGroups(majorIds);
            setGroups(data);
        } catch (err) {
            setError('Error fetching groups.');
            console.error('Error fetching groups:', err); // Log the error for debugging
        }
    }, []);

    return { groups, fetchGroupsData, error };
};

export default useGroups;

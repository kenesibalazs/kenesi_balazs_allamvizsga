import { useState, useCallback } from 'react';
import { fetchGroups as fetchGroupsApi } from '../services/api';
import { Group } from '../types/apitypes';

const useGroups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async (majorIds: string[]) => {
        try {
            const data = await fetchGroupsApi(majorIds);
            setGroups(data);
        } catch (err) {
            setError('Error fetching groups.');
        }
    }, []);

    return { groups, fetchGroups, error };
};

export default useGroups;

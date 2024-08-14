import { useState, useCallback } from 'react';
import {
    fetchAllGroups,
    fetchGroupsByMajorId,
    fetchGroupById,
  
} from '../services/api'; // Adjust the path if necessary
import { Group } from '../types/apiTypes'; // Adjust the path if necessary

const useGroups = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAllGroupsData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAllGroups();
            setGroups(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch all groups.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGroupsByMajorIdData = useCallback(async (majorIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const allGroups = await Promise.all(majorIds.map(fetchGroupsByMajorId));
            setGroups(allGroups.flat()); // Flatten the array of arrays
        } catch (err) {
            setError('Failed to fetch groups');
            console.error('Fetch groups by major IDs error:', err);
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchGroupByIdData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await fetchGroupById(id);
            setGroups([data]); // Assuming you only need a single group; adjust if needed
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch group by ID.');
        } finally {
            setLoading(false);
        }
    }, []);

  
    return {
        groups,
        fetchAllGroupsData,
        fetchGroupsByMajorIdData,
        fetchGroupByIdData,

        error,
        loading
    };
};

export default useGroups;

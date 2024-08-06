import { useState, useCallback } from 'react';
import {
    fetchAllGroups,
    fetchGroupsByMajorId,
    fetchGroupById,
    createGroup,
    updateGroup,
    deleteGroup
} from '../services/api'; // Adjust the path if necessary
import { Group } from '../types/apitypes'; // Adjust the path if necessary

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

    const createGroupData = useCallback(async (data: Omit<Group, '_id'>) => {
        setLoading(true);
        try {
            const newGroup = await createGroup(data);
            setGroups(prevGroups => [...prevGroups, newGroup]);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to create group.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateGroupData = useCallback(async (id: string, data: Partial<Omit<Group, '_id'>>) => {
        setLoading(true);
        try {
            const updatedGroup = await updateGroup(id, data);
            setGroups(prevGroups => prevGroups.map(group => group._id === id ? updatedGroup : group));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to update group.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteGroupData = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await deleteGroup(id);
            setGroups(prevGroups => prevGroups.filter(group => group._id !== id));
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to delete group.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        groups,
        fetchAllGroupsData,
        fetchGroupsByMajorIdData,
        fetchGroupByIdData,
        createGroupData,
        updateGroupData,
        deleteGroupData,
        error,
        loading
    };
};

export default useGroups;

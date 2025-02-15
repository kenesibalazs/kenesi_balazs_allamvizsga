import { useState, useCallback } from 'react';
import { 
    fetchUserById as fetchUserByIdApi, 
    updateUserGroups as updateUserGroupsApi, 
    setUsersOccasion as setUsersOccasionApi,
    getAllUsers as getAllUsersApi
} from '../api';
import { User } from '../types/apitypes';

const useUsers = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]); // <-- Added missing state

    const fetchUserById = useCallback(async (id: string): Promise<User> => {
        setLoading(true);
        try {
            const data = await fetchUserByIdApi(id);
            setSelectedUser(data);
            setError(null);
            return data; 
        } catch (err) {
            setError('Failed to fetch user by ID.');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUserGroups = useCallback(async (userId: string, groupId: string): Promise<User | null> => {
        setLoading(true);
        try {
            const updatedUser = await updateUserGroupsApi(userId, groupId);
            setSelectedUser(updatedUser);
            setError(null);
            return updatedUser;
        } catch (err) {
            setError('Failed to update user groups.');
            console.error('Error updating user groups:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const setUsersOccasion = useCallback(async (userId: string, groupId: string): Promise<User | null> => {
        setLoading(true);
        try {
            const updatedUser = await setUsersOccasionApi(userId, groupId); // Call the API
            setSelectedUser(updatedUser);
            setError(null);
            return updatedUser;
        } catch (err) {
            setError('Failed to set user occasions.');
            console.error('Error setting user occasions:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllUsers = useCallback(async (): Promise<User[]> => {
        setLoading(true);
        try {
            const data = await getAllUsersApi();
            setUsers(data);
            setError(null);
            return data;
        } catch (err) {
            setError('Failed to fetch all users.');
            console.error('Error fetching all users:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        selectedUser,
        error,
        loading,
        users,
        fetchUserById,
        updateUserGroups,
        setUsersOccasion, 
        getAllUsers
    };
};

export default useUsers;
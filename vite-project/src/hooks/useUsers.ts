// useUsers.ts
import { useState, useCallback } from 'react';
import { fetchUserById as fetchUserByIdApi } from '../services/api';
import { User } from '../types/apitypes';

const useUsers = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserById = useCallback(async (id: string): Promise<User> => {
        setLoading(true);
        try {
            const data = await fetchUserByIdApi(id);
            setSelectedUser(data);
            setError(null);
            return data; // Ensure this returns the User object
        } catch (err) {
            setError('Failed to fetch user by ID.');
            throw err; // Rethrow to handle it where it's called
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        selectedUser,
        error,
        loading,
        fetchUserById
    };
};

export default useUsers;

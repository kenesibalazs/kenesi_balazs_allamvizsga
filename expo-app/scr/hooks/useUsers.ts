import { useState, useCallback } from 'react';
import { 
    getAllUsers as getAllUsersApi
} from '../api';
import { User } from '../types/apiTypes';

const useUsers = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]); // <-- Added missing state



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
        getAllUsers
    };
};

export default useUsers;
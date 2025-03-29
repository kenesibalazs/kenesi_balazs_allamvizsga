import { useState, useCallback } from 'react';
import { 
    getAllUsers as getAllUsersApi,
    uploadProfileImage
} from '../api';
import { User } from '../types/apiTypes';

const useUsers = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]); 

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

    const uploadUserProfileImage = useCallback(async (userId: string, image: any) => {
        try {
            const updatedUser = await uploadProfileImage(userId, image);
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user._id === userId ? updatedUser : user))
            );
            setError(null);
        } catch (err) {
            setError('Failed to upload profile image.');
            console.error('Error uploading profile image:', err);
        }
    }, []);

    return {
        error,
        loading,
        users,
        getAllUsers,
        uploadUserProfileImage
    };
};

export default useUsers;
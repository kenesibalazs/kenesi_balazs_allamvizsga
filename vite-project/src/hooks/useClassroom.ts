import { useState, useCallback } from "react";
import { Classroom } from "../types/apitypes";
import {
    fetchClassroomsById as apiFetchClassroomsById,
    fetchAllClassrooms as apiFetchClassrooms
} from '../api';

const useClassroom = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchClassroomsById = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await apiFetchClassroomsById(id);
            setClassrooms(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch classroom by ID.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllClassrooms = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetchClassrooms();
            setClassrooms(data);
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Failed to fetch classrooms.');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        classrooms,
        error,
        loading,
        fetchClassroomsById,
        fetchAllClassrooms
    };
};

export default useClassroom;
/* eslint-disable */
import { useCallback, useState } from 'react';
import {
    createAttendance,
    getTeachersActiveAttendance,
    getStudentsActiveAttendance,
    endAttendance,
    getStudentsAttendances,
    getTeachersAttendances,
    setUserPresenceApi,
    getAttendanceById
} from '../api'; // Import the createAttendance function
import { Attendance } from '../types/apiTypes';

const useAttendance = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [teachersActiveAttendances, setTeachersActiveAttendances] = useState<Attendance[] | null>(null);
    const [studentsActiveAttendances, setStudentsActiveAttendances] = useState<Attendance[] | null>(null);
    const [userAttendances, setUserAttendances] = useState<Attendance[] | null>(null);
    const [userActiveAttendances, setUserActiveAttendances] = useState<Attendance[] | null>(null);

    const createNewAttendance = async (attendanceData: Attendance, occasionId: string, creatorId: string) => {
        setLoading(true);
        setError(null);
        try {
            const newAttendance = await createAttendance(attendanceData, occasionId, creatorId);


            setAttendance(newAttendance);

            return newAttendance;
        } catch (err) {
            setError('Failed to create attendance');
            console.error('Error creating attendance:', err);
        } finally {
            setLoading(false);
        }
    };


    const fetchTeachersActiveAttendance = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {

            const attendances = await getTeachersActiveAttendance(userId);
            setUserActiveAttendances(attendances);

        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStudentActiveAttendances = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {

            const attendances = await getStudentsActiveAttendance(userId);
            setUserActiveAttendances(attendances);

        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const endAttendanceHandler = async (attendanceId: string, teacherId: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAttendance = await endAttendance(attendanceId, teacherId);
            setAttendance(updatedAttendance);
            return updatedAttendance;
        } catch (err) {
            setError('Failed to end attendance');
            console.error('Error ending attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudetsAttendances = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const attendances = await getStudentsAttendances(userId);
            setUserAttendances(attendances);
        } catch (err) {
            setError('Failed to fetch past attendances');
            console.error('Error fetching past attendances:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTeachersAttendances = useCallback(async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const attendances = await getTeachersAttendances(userId);
            setUserAttendances(attendances);
        } catch (err) {
            setError('Failed to fetch past attendances');
            console.error('Error fetching past attendances:', err);
        } finally {
            setLoading(false);
        }
    }, []);


    const setUserPresence = async (attendanceId: string, userId: string, signature: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await setUserPresenceApi(attendanceId, userId, signature);
            return response;
        } catch (err) {
            setError('Failed to set user presence');
            console.error('Error setting user presence:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceById = async (attendanceId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAttendanceById(attendanceId);
            return response;
        } catch (err) {
            setError('Failed to fetch attendance');
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        attendance,
        teachersActiveAttendances,
        studentsActiveAttendances,
        userActiveAttendances,
        userAttendances,
        createNewAttendance,
        fetchTeachersActiveAttendance,
        fetchStudentActiveAttendances,
        fetchStudetsAttendances,
        fetchTeachersAttendances,
        endAttendance: endAttendanceHandler,
        setUserPresence,
        fetchAttendanceById,
    };
};

export default useAttendance;
/* eslint-disable */
import { useState } from 'react';
import {
    createAttendance,
    getTeachersActiveAttendance,
    getStudentsActiveAttendance,
    endAttendance,
    getStudentsPastAttendances
} from '../api'; // Import the createAttendance function
import { Attendance } from '../types/apiTypes';

const useAttendance = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [teachersActiveAttendances, setTeachersActiveAttendances] = useState<Attendance[] | null>(null);
    const [studentsActiveAttendances, setStudentsActiveAttendances] = useState<Attendance[] | null>(null);
    const [stundetsPastAttendances, setStundetsPastAttendances] = useState<Attendance[] | null>(null);

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


    const fetchTeachersActiveAttendance = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {

            console.log(userId)
            const attendances = await getTeachersActiveAttendance(userId);
            setTeachersActiveAttendances(attendances);

        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentActiveAttendances = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {

            console.log(userId)
            const attendances = await getStudentsActiveAttendance(userId);
            setStudentsActiveAttendances(attendances);

        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
        } finally {
            setLoading(false);
        }
    }

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

    const fetchStundetsPastAttendances = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const attendances = await getStudentsPastAttendances(userId);
            setStundetsPastAttendances(attendances);
        } catch (err) {
            setError('Failed to fetch past attendances');
            console.error('Error fetching past attendances:', err);
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        attendance,
        teachersActiveAttendances,
        studentsActiveAttendances,
        stundetsPastAttendances,
        createNewAttendance,
        fetchTeachersActiveAttendance,
        fetchStudentActiveAttendances,
        fetchStundetsPastAttendances,
        endAttendance: endAttendanceHandler,
    };
};

export default useAttendance;
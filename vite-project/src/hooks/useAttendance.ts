/* eslint-disable */
import { useState } from 'react';
import { createAttendance, getTeachersActiveAttendance, getStudentsActiveAttendance } from '../api'; // Import the createAttendance function
import { Attendance } from '../types/apitypes';

const useAttendance = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [teachersActiveAttendances, setTeachersActiveAttendances] = useState<Attendance[] | null>(null);
    const [studentsActiveAttendances, setStudentsActiveAttendances] = useState<Attendance[] | null>(null);

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

            console.log('Fetched attendaces ' + attendances);
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

            console.log('Fetched attendaces ' + attendances);
        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
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
        createNewAttendance,
        fetchTeachersActiveAttendance,
        fetchStudentActiveAttendances
    };
};

export default useAttendance;
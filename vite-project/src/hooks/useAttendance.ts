/* eslint-disable */
import { useState } from 'react';
import { createAttendance, getUsersActiveAttendance } from '../api'; // Import the createAttendance function
import { Attendance } from '../types/apitypes';

const useAttendance = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [activeAttendances, setActiveAttendances] = useState<Attendance[] | null>(null);

    const createNewAttendance = async (attendanceData: Attendance, occasionId: string) => {
        setLoading(true);
        setError(null);
        try {
            const newAttendance = await createAttendance(attendanceData, occasionId);


            setAttendance(newAttendance);

            return newAttendance;
        } catch (err) {
            setError('Failed to create attendance');
            console.error('Error creating attendance:', err);
        } finally {
            setLoading(false);
        }
    };


    const fetchUsersActiveAttendance = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const attendances = await getUsersActiveAttendance(userId);
            setActiveAttendances(attendances);

            console.log('Fetched attendaces ' + attendances);
        } catch (err) {
            setError('Failed to fetch active attendances');
            console.error('Error fetching active attendances:', err);
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        attendance,
        activeAttendances,
        createNewAttendance,
        fetchUsersActiveAttendance
    };
};

export default useAttendance;
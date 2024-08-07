import { useState, useCallback } from "react";
import { createAttendance as createAttendanceApi, 
         fetchAttendancesByTeacherId as fetchAttendancesByTeacherIdApi, 
         updateAttendanceById as updateAttendanceByIdApi,
        fetchAttendancesByGroupId as fetchAttendancesByGroupIdApi
        } from "../services/api"; 
import { Attendance } from "../types/apitypes";

const useAttendance = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const createAttendance = useCallback(async (data: Omit<Attendance, "_id">): Promise<Attendance> => {
        setLoading(true);
        try {
            console.log(data);
            const attendance = await createAttendanceApi(data); 
            setAttendances(prevAttendances => [...prevAttendances, attendance]);
            setError(null);
            return attendance; 
        } catch (err) {
            setError("Failed to create attendance. " + (err as Error).message);
            throw err; 
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAttendancesByTeacherId = useCallback(async (teacherId: string): Promise<Attendance[]> => {
        setLoading(true);
        try {
            const fetchedAttendances = await fetchAttendancesByTeacherIdApi(teacherId);
            setAttendances(fetchedAttendances);
            setError(null);
            return fetchedAttendances;
        } catch (err) {
            setError("Failed to fetch attendances. " + (err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAttendanceById = useCallback(async (id: string, data: Partial<Attendance>): Promise<Attendance | null> => {
        setLoading(true);
        try {
            const updatedAttendance = await updateAttendanceByIdApi(id, data);
            setAttendances(prevAttendances => 
                prevAttendances.map(attendance => 
                    attendance._id === id ? updatedAttendance : attendance
                ).filter((attendance): attendance is Attendance => attendance !== null)
            );
            setError(null);
            return updatedAttendance;
        } catch (err) {
            setError("Failed to update attendance. " + (err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAttendancesByGroupId = useCallback(async (groupId: string): Promise<Attendance[]> => {
        setLoading(true);
        try {
            const fetchedAttendances = await fetchAttendancesByGroupIdApi(groupId);
            setAttendances(fetchedAttendances);
            setError(null);
            return fetchedAttendances;
        } catch (err) {
            setError("Failed to fetch attendances. " + (err as Error).message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { attendances, error, loading, createAttendance, fetchAttendancesByTeacherId, updateAttendanceById ,fetchAttendancesByGroupId};
}

export default useAttendance;

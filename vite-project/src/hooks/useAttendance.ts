import { useState, useCallback } from "react";
import { createAttendance as createAttendanceApi
    , fetchAttendancesByTeacherId as fetchAttendancesByTeacherIdApi
} from "../services/api"; // Rename the imported function
import { Attendance } from "../types/apitypes";

const useAttendance = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Rename the hook function to avoid conflict
    const createAttendance = useCallback(async (data: Omit<Attendance, "_id">): Promise<Attendance> => {
        setLoading(true);
        try {
            console.log(data);
            const attendance = await createAttendanceApi(data); // Use the renamed function
            setAttendances(prevAttendances => [...prevAttendances, attendance]);
            setError(null); // Clear previous errors
            return attendance; // Return the created attendance
        } catch (err) {
            setError("Failed to create attendance.");
            throw err; // Rethrow the error to be caught by the caller
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAttendancesByTeacherId = useCallback(async (teacherId: string): Promise<Attendance[]> => {
        try {
            const attendances = await fetchAttendancesByTeacherIdApi(teacherId);
            setAttendances(attendances);
            setError(null);
            return attendances;
        } catch (err) {
            setError("Failed to fetch attendances.");
            throw err; // Rethrow the error to be caught by the caller
        }
    }, []);


    return { attendances, error, loading, createAttendance, fetchAttendancesByTeacherId };
}

export default useAttendance;

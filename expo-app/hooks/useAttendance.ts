import { useState , useCallback } from 'react';
import {
    fetchAttendaceByGroupIds as fetchAttendaceByGroupIdsApi,
} from '../services/api';

import { Attendance } from '../types/apiTypes';

const useAttendance = () => {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAttendaceByGroupIds = useCallback(async (groupIds: string[]): Promise<Attendance[]> => {
        setLoading(true);
        try {
            const fetchedAttendances = await fetchAttendaceByGroupIdsApi(groupIds);
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

    return { attendances, error, loading, fetchAttendaceByGroupIds };

}

export default useAttendance
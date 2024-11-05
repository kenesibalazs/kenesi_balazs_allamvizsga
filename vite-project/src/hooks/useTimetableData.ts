// hooks/useTimetableData.ts
import { useEffect } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';

export const useTimetableData = () => {
    const { occasions, fetchOccasionsByGroupId } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();

    useEffect(() => {
        fetchOccasionsByGroupId('*49');
        fetchAllSubjectsData();
    }, [fetchOccasionsByGroupId, fetchAllSubjectsData]);

    return { occasions, subjects };
};

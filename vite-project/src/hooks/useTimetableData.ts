// hooks/useTimetableData.ts
import { useEffect } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod'; // Import usePeriod hook

export const useTimetableData = () => {
    const { occasions, fetchOccasionsByGroupId, addCommentToOccasion } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { periods, fetchPeriods } = usePeriod(); // Fetch periods

    useEffect(() => {
        fetchOccasionsByGroupId('*49');
        fetchAllSubjectsData();
        fetchPeriods(); // Fetch periods
    }, [fetchOccasionsByGroupId, fetchAllSubjectsData, fetchPeriods]);

    return { occasions, subjects, periods, addCommentToOccasion }; // Return periods
};

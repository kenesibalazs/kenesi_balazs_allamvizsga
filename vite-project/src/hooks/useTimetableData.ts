// hooks/useTimetableData.ts
import { useEffect } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod'; 

export const useTimetableData = () => {
    const { occasions, fetchOccasionsByGroupId, addCommentToOccasion } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { periods, fetchPeriods } = usePeriod(); 

    useEffect(() => {
        fetchOccasionsByGroupId('*49');
        fetchAllSubjectsData();
        fetchPeriods(); 
    }, [fetchOccasionsByGroupId, fetchAllSubjectsData, fetchPeriods]);

    

    return { occasions, subjects, periods, addCommentToOccasion }; 
};

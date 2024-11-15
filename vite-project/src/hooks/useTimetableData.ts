// hooks/useTimetableData.ts
import { useEffect } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod'; 
import useGroups from './useGroups';
import useClassroom from './useClassroom';

export const useTimetableData = () => {
    const { classrooms, fetchAllClassrooms } = useClassroom();
    const { occasions, addCommentToOccasion } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { groups ,fetchAllGroupsData } = useGroups();
    const { periods, fetchPeriods } = usePeriod(); 


    useEffect(() => {
        fetchAllSubjectsData();
        fetchAllGroupsData();
        fetchAllClassrooms();
        fetchPeriods(); 
    }, [fetchAllClassrooms, fetchAllGroupsData, fetchAllSubjectsData, fetchPeriods]);



    return { occasions, subjects, periods, groups , classrooms, addCommentToOccasion }; 
};

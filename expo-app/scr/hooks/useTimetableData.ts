// hooks/useTimetableData.ts
import { useEffect, useCallback, useState } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod'; 
import useGroups from './useGroups';
import { useAuth } from '../context/AuthContext';

export const useTimetableData = () => {
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { groups, fetchAllGroupsData } = useGroups();
    const { periods, fetchPeriods } = usePeriod(); 
    const { userData, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userData) return;

        try {
            setIsLoading(true);

            console.log('Fetching timetable data for user:', userData);
            const occasionIds = (userData.occasionIds || []).map((id) => id.toString());
            
            await Promise.all([
                fetchAllSubjectsData(),
                fetchAllGroupsData(),
                fetchPeriods(),

        
                fetchOccasionsByIds(occasionIds),

            ]);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch timetable data.");
        } finally {
            setIsLoading(false);
        }
    }, [userData, fetchAllSubjectsData, fetchAllGroupsData, fetchPeriods, fetchOccasionsByIds]);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
        fetchData();
    }, [fetchData, logout, userData]);

    if (!userData) {
        return {
            occasions: [],
            subjects: [],
            periods: [],
            groups: [],
            classrooms: [],
            addCommentToOccasion: () => {},
            isLoading,
            error,
        };
    }

    return { occasions, subjects, periods, groups, isLoading, error };
};
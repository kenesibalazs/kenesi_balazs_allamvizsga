// hooks/useTimetableData.ts
import { useEffect, useCallback, useState } from 'react';
import useOccasions from './useOccasions';
import useSubject from './useSubject';
import usePeriod from './usePeriod';
import useGroups from './useGroups';
import useAttendance from './useAttendance';
import { useAuth } from '../context/AuthContext';

export const useTimetableData = () => {
    const { occasions, fetchOccasionsByIds } = useOccasions();
    const { subjects, fetchAllSubjectsData } = useSubject();
    const { userAttendances, fetchStudetsAttendances , fetchTeachersAttendances} = useAttendance();
    const { groups, fetchAllGroupsData } = useGroups();
    const { periods, fetchPeriods } = usePeriod();
    const { userData, logout } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userData) return;

        try {
            setIsLoading(true);

           
            const occasionIds = (userData.occasionIds || []).map((id) => id.toString());

            const promises = [
                fetchAllSubjectsData(),
                fetchAllGroupsData(),
                fetchPeriods(),
                fetchOccasionsByIds(occasionIds),

            ]

            
            if (userData.type === "STUDENT") {
                console.log("Fetching student attendance for user ID:", userData._id);
                promises.push(fetchStudetsAttendances(userData._id));
            }else if (userData.type == "TEACHER"){
                console.log("Fetching student attendance for user ID:", userData._id);
                promises.push(fetchTeachersAttendances(userData._id));
            }

            await Promise.all(promises);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch timetable data.");
        } finally {
            setIsLoading(false);
        }
    }, [userData, fetchAllSubjectsData, fetchAllGroupsData, fetchPeriods, fetchOccasionsByIds, fetchStudetsAttendances, fetchTeachersAttendances ]);

    useEffect(() => {
        if (!userData) {
            logout();
            return;
        }
        fetchData();
    }, [fetchData, logout, userData]);


    console.log("Final attendance data:", userAttendances);

    if (!userData) {
        return {
            occasions: [],
            subjects: [],
            periods: [],
            groups: [],
            attendance: [], 
            classrooms: [],
            addCommentToOccasion: () => { },
            isLoading,
            error,
        };
    }

    return { occasions, subjects, periods, groups, userAttendances, isLoading, error };
};